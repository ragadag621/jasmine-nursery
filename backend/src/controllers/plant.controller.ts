import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Plant, IPlantDocument } from '../models/Plant.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { PlantListQuery } from '../validators/catalog.validator';
import { PlantCreateInput, PlantUpdateInput } from '../validators/plant.validator';
import { uploadMultipleImageBuffers, deleteMultipleCloudinaryImages } from '../utils/cloudinaryUpload';

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  name_asc: { 'name.he': 1 },
  name_desc: { 'name.he': -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
};

/**
 * GET /api/plants
 * Public. Supports category filter, free-text search (Hebrew/Arabic name
 * or scientific name), sort, and pagination — matching the catalog
 * requirements (search/filter/categories/sorting) from the spec.
 * Hidden plants (isHidden: true) are never returned here.
 */
export const listPlants = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, sort, page, limit } = req.query as unknown as PlantListQuery;

  const filter: FilterQuery<IPlantDocument> = { isHidden: false };

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const sortOrder = SORT_MAP[sort ?? 'newest'];
  const skip = (page - 1) * limit;

  const [plants, total] = await Promise.all([
    Plant.find(filter).sort(sortOrder).skip(skip).limit(limit).populate('category'),
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

/**
 * GET /api/plants/:slug
 * Public. A hidden plant returns 404 — same as if it didn't exist, so
 * hiding a plant doesn't leak that it once existed via direct-URL access.
 */
export const getPlantBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const plant = await Plant.findOne({ slug, isHidden: false }).populate('category');

  if (!plant) {
    throw ApiError.notFound('Plant not found');
  }

  res.status(200).json({
    success: true,
    data: plant,
  });
});

/**
 * GET /api/plants/admin/all
 * Protected (admin). Same filters as the public listing, but includes
 * hidden plants — the public endpoint above always excludes them, so the
 * admin table needs this separate path to manage everything.
 */
export const listPlantsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, sort, page, limit } = req.query as unknown as PlantListQuery;

  const filter: FilterQuery<IPlantDocument> = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const sortOrder = SORT_MAP[sort ?? 'newest'];
  const skip = (page - 1) * limit;

  const [plants, total] = await Promise.all([
    Plant.find(filter).sort(sortOrder).skip(skip).limit(limit).populate('category'),
    Plant.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: plants,
    meta: { total, page, pages: Math.max(1, Math.ceil(total / limit)) },
  });
});

/**
 * GET /api/plants/admin/:id
 * Protected (admin). Fetches a single plant by id (including hidden ones)
 * for the admin edit form, which doesn't necessarily know the slug.
 */
export const getPlantByIdAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const plant = await Plant.findById(id);
  if (!plant) {
    throw ApiError.notFound('Plant not found');
  }
  res.status(200).json({ success: true, data: plant });
});

/**
 * POST /api/plants
 * Protected (admin). multipart/form-data with an `images` field (0-10 files).
 * Bilingual/nested fields (name, description, care) arrive as JSON strings
 * and are parsed by parseJsonFields middleware before this runs.
 */
export const createPlant = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as PlantCreateInput;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  const existing = await Plant.findOne({ slug: input.slug });
  if (existing) {
    throw ApiError.conflict(`A plant with slug "${input.slug}" already exists`);
  }

  const images = files.length > 0 ? await uploadMultipleImageBuffers(files, 'alyasmin/plants') : [];

  const plant = await Plant.create({ ...input, images });

  res.status(201).json({
    success: true,
    message: 'Plant created successfully',
    data: plant,
  });
});

/**
 * PUT /api/plants/:id
 * Protected (admin). Any newly uploaded `images` files are APPENDED to the
 * existing image set (ordered after the current ones) — removing/reordering
 * individual images is a separate, more granular action than a general
 * field update, matching how the admin ImageDropzone UI is expected to work.
 */
export const updatePlant = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as PlantUpdateInput;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  const plant = await Plant.findById(id);
  if (!plant) {
    throw ApiError.notFound('Plant not found');
  }

  if (input.slug && input.slug !== plant.slug) {
    const slugTaken = await Plant.findOne({ slug: input.slug, _id: { $ne: id } });
    if (slugTaken) {
      throw ApiError.conflict(`A plant with slug "${input.slug}" already exists`);
    }
  }

  if (files.length > 0) {
    const startOrder = plant.images.length;
    const newImages = await uploadMultipleImageBuffers(files, 'alyasmin/plants');
    plant.images.push(...newImages.map((img, i) => ({ ...img, order: startOrder + i })));
  }

  Object.assign(plant, input);
  await plant.save();

  res.status(200).json({
    success: true,
    message: 'Plant updated successfully',
    data: plant,
  });
});

/**
 * DELETE /api/plants/:id
 * Protected (admin). Deletes all associated Cloudinary images BEFORE
 * removing the MongoDB document, per the architecture's delete flow.
 */
export const deletePlant = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const plant = await Plant.findById(id);
  if (!plant) {
    throw ApiError.notFound('Plant not found');
  }

  await deleteMultipleCloudinaryImages(plant.images.map((img) => img.publicId));
  await plant.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Plant deleted successfully',
  });
});

/**
 * PATCH /api/plants/:id/hide
 * Protected (admin). Toggles visibility without deleting — lets the admin
 * temporarily pull a plant from the public catalog (e.g. out of season)
 * without losing its data or images.
 */
export const togglePlantVisibility = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const plant = await Plant.findById(id);
  if (!plant) {
    throw ApiError.notFound('Plant not found');
  }

  plant.isHidden = !plant.isHidden;
  await plant.save();

  res.status(200).json({
    success: true,
    message: plant.isHidden ? 'Plant hidden from catalog' : 'Plant is now visible',
    data: plant,
  });
});

/**
 * DELETE /api/plants/:id/images/:imageId
 * Protected (admin). Removes a single image from a plant's gallery —
 * deletes from Cloudinary first, then pulls the subdocument.
 */
export const deletePlantImage = asyncHandler(async (req: Request, res: Response) => {
  const { id, imageId } = req.params;

  const plant = await Plant.findById(id);
  if (!plant) {
    throw ApiError.notFound('Plant not found');
  }

  const image = plant.images.find((img) => img._id?.toString() === imageId);
  if (!image) {
    throw ApiError.notFound('Image not found on this plant');
  }

  await deleteMultipleCloudinaryImages([image.publicId]);
  plant.images = plant.images.filter((img) => img._id?.toString() !== imageId);
  await plant.save();

  res.status(200).json({
    success: true,
    message: 'Image removed',
    data: plant,
  });
});
