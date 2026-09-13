import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Plant, IPlantDocument } from '../models/Plant.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { PlantListQuery } from '../validators/catalog.validator';
import {
  PlantCreateInput,
  PlantUpdateInput,
} from '../validators/plant.validator';
import {
  uploadMultipleImageBuffers,
  deleteMultipleCloudinaryImages,
} from '../utils/cloudinaryUpload';

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  name_asc: { 'name.he': 1 },
  name_desc: { 'name.he': -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

const MIN_FUZZY_MATCH_LENGTH = 4;

/**
 * Escapes special regex characters so user input is treated
 * as plain text rather than as a regular expression.
 */
const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Normalizes Arabic characters only for search comparison.
 *
 * The original value stored in MongoDB is never changed.
 *
 * Examples:
 *   أ -> ا
 *   إ -> ا
 *   آ -> ا
 *   ى -> ي
 *   ة -> ه
 */
const normalizeArabicSearch = (value: string): string => {
  return value
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
};

/**
 * Removes the Arabic definite article "ال" from the beginning
 * of a search token for comparison purposes only.
 *
 * The original database value remains unchanged.
 *
 * Example:
 *   الجهنمية -> جهنميه
 *   جهنمية   -> جهنميه
 */
const removeArabicDefiniteArticle = (value: string): string => {
  if (value.startsWith('ال') && value.length > 2) {
    return value.slice(2);
  }

  return value;
};

/**
 * Creates normalized comparison variants for a search value.
 *
 * Both the original form and the form without the Arabic definite
 * article are kept. This means the search can match regardless of
 * whether the user typed "ال".
 */
const getSearchVariants = (value: string): string[] => {
  const normalized = normalizeArabicSearch(value.trim().toLowerCase());

  const variants = new Set<string>();

  if (normalized) {
    variants.add(normalized);

    const withoutArticle = removeArabicDefiniteArticle(normalized);

    if (withoutArticle) {
      variants.add(withoutArticle);
    }
  }

  return Array.from(variants);
};


const buildSearchRegex = (search: string): RegExp => {
  const variants = getSearchVariants(search);


  const primaryVariant = variants.reduce(
    (longest, current) =>
      current.length > longest.length ? current : longest,
    ''
  );

  if (primaryVariant.length < MIN_FUZZY_MATCH_LENGTH) {
    return new RegExp(escapeRegex(primaryVariant), 'i');
  }

  const pattern = primaryVariant
    .split('')
    .map((character) => {
      if (character === 'ه') {
        return '[هة]';
      }

      return escapeRegex(character);
    })
    .join('');

  return new RegExp(pattern, 'i');
};


const buildPlantSearchFilter = (
  search: string
): FilterQuery<IPlantDocument> => {
  const normalizedSearch = normalizeArabicSearch(search.trim());


  if (/[\u0600-\u06FF]/.test(normalizedSearch)) {
    const variants = getSearchVariants(search);

    const patterns = variants
      .filter((variant) => variant.length > 0)
      .map((variant) => {
        const pattern = variant
          .split('')
          .map((character) => {
            if (character === 'ه') {
              return '[هة]';
            }

            return escapeRegex(character);
          })
          .join('');

        return pattern;
      });

    const uniquePatterns = Array.from(new Set(patterns));

    return {
      $or: [
        ...uniquePatterns.flatMap((pattern) => [
          { 'name.ar': new RegExp(pattern, 'i') },
          { 'name.he': new RegExp(pattern, 'i') },
          { scientificName: new RegExp(pattern, 'i') },
        ]),
      ],
    };
  }

 
  const searchRegex = buildSearchRegex(search);

  return {
    $or: [
      { 'name.he': searchRegex },
      { 'name.ar': searchRegex },
      { scientificName: searchRegex },
    ],
  };
};

export const listPlants = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, sort, page, limit } =
    req.query as unknown as PlantListQuery;

  const filter: FilterQuery<IPlantDocument> = {
    isHidden: false,
  };

  if (category) {
    filter.category = category;
  }

  if (search) {
    Object.assign(filter, buildPlantSearchFilter(search));
  }

  const sortOrder = SORT_MAP[sort ?? 'newest'];
  const skip = (page - 1) * limit;

  const [plants, total] = await Promise.all([
    Plant.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .populate('category'),
    Plant.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: plants,
    meta: {
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});


export const getPlantBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const plant = await Plant.findOne({
      slug,
      isHidden: false,
    }).populate('category');

    if (!plant) {
      throw ApiError.notFound('Plant not found');
    }

    res.status(200).json({
      success: true,
      data: plant,
    });
  }
);


export const listPlantsAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { category, search, sort, page, limit } =
      req.query as unknown as PlantListQuery;

    const filter: FilterQuery<IPlantDocument> = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      Object.assign(filter, buildPlantSearchFilter(search));
    }

    const sortOrder = SORT_MAP[sort ?? 'newest'];
    const skip = (page - 1) * limit;

    const [plants, total] = await Promise.all([
      Plant.find(filter)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .populate('category'),
      Plant.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: plants,
      meta: {
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  }
);


export const getPlantByIdAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const plant = await Plant.findById(id);

    if (!plant) {
      throw ApiError.notFound('Plant not found');
    }

    res.status(200).json({
      success: true,
      data: plant,
    });
  }
);

export const createPlant = asyncHandler(
  async (req: Request, res: Response) => {
    const input = req.body as PlantCreateInput;
    const files =
      (req.files as Express.Multer.File[] | undefined) ?? [];

    const existing = await Plant.findOne({ slug: input.slug });

    if (existing) {
      throw ApiError.conflict(
        `A plant with slug "${input.slug}" already exists`
      );
    }

    const images =
      files.length > 0
        ? await uploadMultipleImageBuffers(
            files,
            'alyasmin/plants'
          )
        : [];

    try {
      const plant = await Plant.create({
        ...input,
        images,
      });

      res.status(201).json({
        success: true,
        message: 'Plant created successfully',
        data: plant,
      });
    } catch (error) {
      // MongoDB failed after Cloudinary upload.
      // Remove newly uploaded images to avoid orphaned files.
      if (images.length > 0) {
        try {
          await deleteMultipleCloudinaryImages(
            images.map((image) => image.publicId)
          );
        } catch {
          console.error(
            '[plant] Failed to clean up Cloudinary images after database failure'
          );
        }
      }

      throw error;
    }
  }
);


export const updatePlant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const input = req.body as PlantUpdateInput;
    const files =
      (req.files as Express.Multer.File[] | undefined) ?? [];

    const plant = await Plant.findById(id);

    if (!plant) {
      throw ApiError.notFound('Plant not found');
    }

    if (input.slug && input.slug !== plant.slug) {
      const slugTaken = await Plant.findOne({
        slug: input.slug,
        _id: { $ne: id },
      });

      if (slugTaken) {
        throw ApiError.conflict(
          `A plant with slug "${input.slug}" already exists`
        );
      }
    }

    if (files.length > 0) {
      const startOrder = plant.images.length;

      // Upload first. Existing images remain untouched if this fails.
      const newImages = await uploadMultipleImageBuffers(
        files,
        'alyasmin/plants'
      );

      try {
        plant.images.push(
          ...newImages.map((img, i) => ({
            ...img,
            order: startOrder + i,
          }))
        );

        Object.assign(plant, input);

        await plant.save();
      } catch (error) {
        // MongoDB failed after Cloudinary upload.
        // Remove only the newly uploaded images.
        try {
          await deleteMultipleCloudinaryImages(
            newImages.map((image) => image.publicId)
          );
        } catch {
          console.error(
            '[plant] Failed to clean up new Cloudinary images after database failure'
          );
        }

        throw error;
      }
    } else {
      // No image upload — update normal plant fields only.
      Object.assign(plant, input);

      await plant.save();
    }

    res.status(200).json({
      success: true,
      message: 'Plant updated successfully',
      data: plant,
    });
  }
);

/**
 * DELETE /api/plants/:id
 * Protected (admin).
 *
 * Delete the MongoDB document first, then clean up Cloudinary.
 * This guarantees that MongoDB does not keep references to images
 * that were already deleted from Cloudinary.
 */
export const deletePlant = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const plant = await Plant.findById(id);

    if (!plant) {
      throw ApiError.notFound('Plant not found');
    }

    const publicIds = plant.images.map(
      (img) => img.publicId
    );

    await plant.deleteOne();

    if (publicIds.length > 0) {
      try {
        await deleteMultipleCloudinaryImages(publicIds);
      } catch {
        // Database is already correct.
        // Failed Cloudinary cleanup can be handled separately.
        console.error(
          '[plant] Failed to delete Cloudinary images after plant deletion'
        );
      }
    }

    res.status(200).json({
      success: true,
      message: 'Plant deleted successfully',
    });
  }
);

/**
 * PATCH /api/plants/:id/hide
 * Protected (admin). Toggles visibility without deleting — lets the admin
 * temporarily pull a plant from the public catalog (e.g. out of season)
 * without losing its data or images.
 */
export const togglePlantVisibility = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const plant = await Plant.findById(id);

    if (!plant) {
      throw ApiError.notFound('Plant not found');
    }

    plant.isHidden = !plant.isHidden;

    await plant.save();

    res.status(200).json({
      success: true,
      message: plant.isHidden
        ? 'Plant hidden from catalog'
        : 'Plant is now visible',
      data: plant,
    });
  }
);

/**
 * DELETE /api/plants/:id/images/:imageId
 * Protected (admin).
 *
 * Update MongoDB first, then delete the Cloudinary image.
 * This guarantees that MongoDB does not reference an image that
 * has already been deleted.
 */
export const deletePlantImage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, imageId } = req.params;

    const plant = await Plant.findById(id);

    if (!plant) {
      throw ApiError.notFound('Plant not found');
    }

    const image = plant.images.find(
      (img) => img._id?.toString() === imageId
    );

    if (!image) {
      throw ApiError.notFound('Image not found on this plant');
    }

    plant.images = plant.images.filter(
      (img) => img._id?.toString() !== imageId
    );

    await plant.save();

    try {
      await deleteMultipleCloudinaryImages([
        image.publicId,
      ]);
    } catch {
      // MongoDB is already correct.
      // Only Cloudinary cleanup failed.
      console.error(
        '[plant] Failed to delete Cloudinary image after database update'
      );
    }

    res.status(200).json({
      success: true,
      message: 'Image removed',
      data: plant,
    });
  }
);