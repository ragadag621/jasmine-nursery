import { Request, Response } from 'express';
import { Plant, Category, Gallery, Contact } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * GET /api/dashboard/stats
 * Protected (admin).
 *
 * Returns the statistics currently displayed by the admin dashboard:
 * total plants, total categories, total gallery images,
 * and unread contact messages.
 */
export const getDashboardStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const [plantCount, categoryCount, galleryItems, newMessageCount] =
      await Promise.all([
        Plant.countDocuments({}),
        Category.countDocuments({}),
        Gallery.find({}, 'images'),
        Contact.countDocuments({ status: 'new' }),
      ]);

    const galleryImageCount = galleryItems.reduce(
      (sum, item) => sum + item.images.length,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        plants: plantCount,
        categories: categoryCount,
        galleryImages: galleryImageCount,
        newMessages: newMessageCount,
      },
    });
  }
);