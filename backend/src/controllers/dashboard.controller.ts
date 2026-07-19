import { Request, Response } from 'express';
import { Plant, Category, Gallery, Contact } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * GET /api/dashboard/stats
 * Protected (admin). Powers the admin dashboard's stat cards: total plants,
 * categories, gallery images, and new (unread) contact messages.
 */
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [plantCount, categoryCount, galleryItems, newMessageCount, totalMessageCount] =
    await Promise.all([
      Plant.countDocuments({}),
      Category.countDocuments({}),
      Gallery.find({}, 'images'),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({}),
    ]);

  const galleryImageCount = galleryItems.reduce((sum, item) => sum + item.images.length, 0);

  res.status(200).json({
    success: true,
    data: {
      plants: plantCount,
      categories: categoryCount,
      galleryImages: galleryImageCount,
      newMessages: newMessageCount,
      totalMessages: totalMessageCount,
    },
  });
});
