import { Request, Response } from 'express';
import { Category } from '../models';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { CategoryCreateInput, CategoryUpdateInput } from '../validators/category.validator';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinaryUpload';

/**
 * GET /api/categories
 * Public. Returns all categories — small, fixed-size collection for a
 * single nursery, so no pagination is needed here (unlike /plants).
 */
export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ 'name.he': 1 });

  res.status(200).json({
    success: true,
    data: categories,
  });
});

/** POST /api/categories — Protected (admin). Optional single `image` file. */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CategoryCreateInput;
  const file = req.file as Express.Multer.File | undefined;

  const existing = await Category.findOne({ slug: input.slug });
  if (existing) {
    throw ApiError.conflict(`A category with slug "${input.slug}" already exists`);
  }

  const image = file ? await uploadImageBuffer(file.buffer, 'alyasmin/categories') : undefined;

  const category = await Category.create({ ...input, image });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  });
});

/** PUT /api/categories/:id — Protected (admin). Replaces the image if a new one is provided. */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as CategoryUpdateInput;
  const file = req.file as Express.Multer.File | undefined;

  const category = await Category.findById(id);
  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  if (input.slug && input.slug !== category.slug) {
    const slugTaken = await Category.findOne({ slug: input.slug, _id: { $ne: id } });
    if (slugTaken) {
      throw ApiError.conflict(`A category with slug "${input.slug}" already exists`);
    }
  }

  if (file) {
    if (category.image?.publicId) {
      await deleteCloudinaryImage(category.image.publicId);
    }
    category.image = await uploadImageBuffer(file.buffer, 'alyasmin/categories');
  }

  Object.assign(category, input);
  await category.save();

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

/** DELETE /api/categories/:id — Protected (admin). */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  if (category.image?.publicId) {
    await deleteCloudinaryImage(category.image.publicId);
  }
  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});
