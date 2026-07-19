import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Gallery, IGalleryDocument } from '../models/Gallery.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { GalleryCreateInput, GalleryUpdateInput } from '../validators/gallery.validator';
import { uploadMultipleImageBuffers, deleteMultipleCloudinaryImages } from '../utils/cloudinaryUpload';

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

/** POST /api/gallery — Protected (admin). multipart with `images` field (1+ files). */
export const createGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as GalleryCreateInput;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  if (files.length === 0) {
    throw ApiError.badRequest('At least one image is required');
  }

  const images = await uploadMultipleImageBuffers(files, 'alyasmin/gallery');
  const item = await Gallery.create({ ...input, images });

  res.status(201).json({
    success: true,
    message: 'Gallery item created successfully',
    data: item,
  });
});

/** PUT /api/gallery/:id — Protected (admin). New images are appended to the existing set. */
export const updateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as GalleryUpdateInput;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];

  const item = await Gallery.findById(id);
  if (!item) {
    throw ApiError.notFound('Gallery item not found');
  }

  if (files.length > 0) {
    const startOrder = item.images.length;
    const newImages = await uploadMultipleImageBuffers(files, 'alyasmin/gallery');
    item.images.push(...newImages.map((img, i) => ({ ...img, order: startOrder + i })));
  }

  Object.assign(item, input);
  await item.save();

  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: item,
  });
});

/** DELETE /api/gallery/:id — Protected (admin). Deletes all images from Cloudinary first. */
export const deleteGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const item = await Gallery.findById(id);
  if (!item) {
    throw ApiError.notFound('Gallery item not found');
  }

  await deleteMultipleCloudinaryImages(item.images.map((img) => img.publicId));
  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Gallery item deleted successfully',
  });
});

/** DELETE /api/gallery/:id/images/:imageId — Protected (admin). Remove a single image. */
export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const { id, imageId } = req.params;

  const item = await Gallery.findById(id);
  if (!item) {
    throw ApiError.notFound('Gallery item not found');
  }

  const image = item.images.find((img) => img._id?.toString() === imageId);
  if (!image) {
    throw ApiError.notFound('Image not found on this gallery item');
  }

  await deleteMultipleCloudinaryImages([image.publicId]);
  item.images = item.images.filter((img) => img._id?.toString() !== imageId);
  await item.save();

  res.status(200).json({
    success: true,
    message: 'Image removed',
    data: item,
  });
});
