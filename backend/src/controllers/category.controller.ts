import { Request, Response } from 'express';
import { Category, Plant } from '../models';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import {
  CategoryCreateInput,
  CategoryUpdateInput,
} from '../validators/category.validator';
import {
  uploadImageBuffer,
  deleteCloudinaryImage,
} from '../utils/cloudinaryUpload';

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

/**
 * POST /api/categories
 * Protected (admin). Optional single `image` file.
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CategoryCreateInput;
  const file = req.file as Express.Multer.File | undefined;

  const existing = await Category.findOne({ slug: input.slug });

  if (existing) {
    throw ApiError.conflict(
      `A category with slug "${input.slug}" already exists`
    );
  }

  const image = file
    ? await uploadImageBuffer(file.buffer, 'alyasmin/categories')
    : undefined;

  try {
    const category = await Category.create({
      ...input,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    // MongoDB failed after Cloudinary upload.
    // Clean up the newly uploaded image so it does not become orphaned.
    if (image?.publicId) {
      try {
        await deleteCloudinaryImage(image.publicId);
      } catch {
        console.error(
          '[category] Failed to clean up Cloudinary image after database failure'
        );
      }
    }

    throw error;
  }
});

/**
 * PUT /api/categories/:id
 * Protected (admin).
 *
 * If a new image is provided, it safely replaces the existing image:
 *
 * 1. Upload the new image.
 * 2. Update MongoDB with the new image.
 * 3. Delete the old Cloudinary image.
 *
 * The old image is never deleted before the new state is safely stored.
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as CategoryUpdateInput;
  const file = req.file as Express.Multer.File | undefined;

  const category = await Category.findById(id);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  if (input.slug && input.slug !== category.slug) {
    const slugTaken = await Category.findOne({
      slug: input.slug,
      _id: { $ne: id },
    });

    if (slugTaken) {
      throw ApiError.conflict(
        `A category with slug "${input.slug}" already exists`
      );
    }
  }

  if (file) {
    const oldPublicId = category.image?.publicId;

    // Upload the new image first.
    const newImage = await uploadImageBuffer(
      file.buffer,
      'alyasmin/categories'
    );

    try {
      // Update MongoDB only after the new Cloudinary upload succeeds.
      category.image = newImage;

      Object.assign(category, input);

      await category.save();
    } catch (error) {
      // Database update failed.
      // Keep the old image and remove the newly uploaded image.
      try {
        await deleteCloudinaryImage(newImage.publicId);
      } catch {
        console.error(
          '[category] Failed to clean up new Cloudinary image after database failure'
        );
      }

      throw error;
    }

    // MongoDB now safely points to the new image.
    // Only now is it safe to delete the old Cloudinary image.
    if (oldPublicId) {
      try {
        await deleteCloudinaryImage(oldPublicId);
      } catch {
        // Database is already correct.
        // Only the old Cloudinary image remains as an orphan.
        console.error(
          '[category] Failed to delete old Cloudinary image after successful replacement'
        );
      }
    }
  } else {
    // No image replacement — only update regular category fields.
    Object.assign(category, input);

    await category.save();
  }

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  });
});

/**
 * DELETE /api/categories/:id
 * Protected (admin).
 *
 * Delete the database record first, then clean up the Cloudinary image.
 * This prevents MongoDB from referencing an image that has already
 * been deleted from Cloudinary.
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw ApiError.notFound('Category not found');
  }

  if (await Plant.exists({ category: id })) {
    throw ApiError.conflict(
      'Cannot delete a category that is assigned to plants',
    );
  }

  const publicId = category.image?.publicId;

  await category.deleteOne();

  if (publicId) {
    try {
      await deleteCloudinaryImage(publicId);
    } catch {
      console.error(
        '[category] Failed to delete Cloudinary image after category deletion'
      );
    }
  }

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});