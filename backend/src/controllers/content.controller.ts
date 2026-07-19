import { Request, Response } from 'express';
import { SiteContent } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { ContentUpdateInput } from '../validators/content.validator';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinaryUpload';

/**
 * GET /api/content
 * Public. Returns the single SiteContent document, bootstrapping it with
 * placeholder content on first call if it doesn't exist yet (see
 * SiteContent.getSingleton() in the model).
 */
export const getSiteContent = asyncHandler(async (_req: Request, res: Response) => {
  const content = await SiteContent.getSingleton();

  res.status(200).json({
    success: true,
    data: content,
  });
});

/**
 * PUT /api/content
 * Protected (admin). Updates the single SiteContent document. An optional
 * `heroImage` file replaces the existing hero image (old Cloudinary asset
 * is deleted first).
 */
export const updateSiteContent = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as ContentUpdateInput;
  const file = req.file as Express.Multer.File | undefined;

  const content = await SiteContent.getSingleton();

  if (file) {
    if (content.heroImage?.publicId) {
      await deleteCloudinaryImage(content.heroImage.publicId);
    }
    content.heroImage = await uploadImageBuffer(file.buffer, 'alyasmin/content');
  }

  Object.assign(content, input);
  await content.save();

  res.status(200).json({
    success: true,
    message: 'Site content updated successfully',
    data: content,
  });
});
