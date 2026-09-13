import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Gallery, IGalleryDocument } from '../models/Gallery.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { GalleryCreateInput, GalleryUpdateInput } from '../validators/gallery.validator';
import {
  uploadMultipleImageBuffers,
  deleteMultipleCloudinaryImages,
} from '../utils/cloudinaryUpload';

/**
 * GET /api/gallery
 * Public. Optional ?category= filter. No pagination — gallery sets are
 * expected to be a manageable, curated number of entries per category
 * rather than an endlessly-growing feed.
 */
export const listGallery = asyncHandler(async (req: Request, res: Response) => {
  const { category } = req.query as { category?: string };

  const filter: FilterQuery<IGalleryDocument> = {};

  if (category) {
    filter.category = category.toLowerCase();
  }

  const items = await Gallery.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: items,
  });
});

/**
 * POST /api/gallery
 * Protected (admin).
 * Multipart with `images` field.
 *
 * The backend still supports the `images` array contract.
 * The frontend currently sends only one image.
 */
export const createGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as GalleryCreateInput;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  if (files.length === 0) {
    throw ApiError.badRequest('At least one image is required');
  }

  const images = await uploadMultipleImageBuffers(
    files,
    'alyasmin/gallery'
  );

  try {
    const item = await Gallery.create({
      ...input,
      images,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: item,
    });
  } catch (error) {
    // MongoDB failed after Cloudinary upload.
    // Remove newly uploaded images so they do not become orphaned.
    try {
      await deleteMultipleCloudinaryImages(
        images.map((image) => image.publicId)
      );
    } catch {
      console.error(
        '[gallery] Failed to clean up Cloudinary images after database failure'
      );
    }

    throw error;
  }
});

/**
 * PUT /api/gallery/:id
 * Protected (admin).
 *
 * If a new image is provided, it replaces the existing image set.
 * The operation follows a failure-safe sequence:
 *
 * 1. Upload new image(s)
 * 2. Save new state to MongoDB
 * 3. Delete old Cloudinary image(s)
 *
 * This guarantees that an old image is never deleted before the
 * database safely points to the new image.
 */
export const updateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as GalleryUpdateInput;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  const item = await Gallery.findById(id);

  if (!item) {
    throw ApiError.notFound('Gallery item not found');
  }

  const oldPublicIds = item.images.map((image) => image.publicId);

  let newImages:
    | { url: string; publicId: string; order: number }[]
    | undefined;

  if (files.length > 0) {
    newImages = await uploadMultipleImageBuffers(
      files,
      'alyasmin/gallery'
    );

    try {
      item.images = newImages;
      Object.assign(item, input);

      await item.save();
    } catch (error) {
      // MongoDB failed after the new image was uploaded.
      // Keep the old Cloudinary image and remove the new upload.
      try {
        await deleteMultipleCloudinaryImages(
          newImages.map((image) => image.publicId)
        );
      } catch {
        console.error(
          '[gallery] Failed to clean up new Cloudinary images after database failure'
        );
      }

      throw error;
    }

    // Database is now safely pointing to the new image.
    // Only now is it safe to remove the old Cloudinary image.
    if (oldPublicIds.length > 0) {
      try {
        await deleteMultipleCloudinaryImages(oldPublicIds);
      } catch {
        // The database is already correct.
        // A Cloudinary deletion failure only leaves an orphaned old image.
        console.error(
          '[gallery] Failed to delete old Cloudinary image(s) after successful replacement'
        );
      }
    }
  } else {
    Object.assign(item, input);
    await item.save();
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: item,
  });
});

/**
 * DELETE /api/gallery/:id
 * Protected (admin).
 *
 * Delete the database record first so the database never keeps references
 * to images that were already deleted from Cloudinary.
 *
 * If Cloudinary cleanup fails afterwards, the database remains consistent
 * and the old image can be cleaned up separately.
 */
export const deleteGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await Gallery.findById(id);

  if (!item) {
    throw ApiError.notFound('Gallery item not found');
  }

  const publicIds = item.images.map((image) => image.publicId);

  await item.deleteOne();

  if (publicIds.length > 0) {
    try {
      await deleteMultipleCloudinaryImages(publicIds);
    } catch {
      console.error(
        '[gallery] Failed to delete Cloudinary image(s) after gallery deletion'
      );
    }
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item deleted successfully',
  });
});

/**
 * DELETE /api/gallery/:id/images/:imageId
 * Protected (admin).
 *
 * Remove the image from MongoDB first, then delete it from Cloudinary.
 * This prevents the database from referencing an image that no longer exists.
 */
export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const { id, imageId } = req.params;

  const item = await Gallery.findById(id);

  if (!item) {
    throw ApiError.notFound('Gallery item not found');
  }

  const image = item.images.find(
    (img) => img._id?.toString() === imageId
  );

  if (!image) {
    throw ApiError.notFound('Image not found on this gallery item');
  }

  item.images = item.images.filter(
    (img) => img._id?.toString() !== imageId
  );

  await item.save();

  try {
    await deleteMultipleCloudinaryImages([image.publicId]);
  } catch {
    console.error(
      '[gallery] Failed to delete Cloudinary image after database update'
    );
  }

  res.status(200).json({
    success: true,
    message: 'Image removed',
    data: item,
  });
});