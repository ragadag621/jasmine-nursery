import { Request, Response } from 'express';
import { SiteContent } from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { ContentUpdateInput } from '../validators/content.validator';
import { uploadImageBuffer, deleteCloudinaryImage } from '../utils/cloudinaryUpload';
import { ApiError } from '../utils/ApiError';

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
 * `heroImage` file replaces the existing hero image.
 */
export const updateSiteContent = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as ContentUpdateInput;
  const file = req.file as Express.Multer.File | undefined;

  const content = await SiteContent.getSingleton();

  if (file) {
    const oldPublicId = content.heroImage?.publicId;
    const newImage = await uploadImageBuffer(file.buffer, 'alyasmin/content');
    content.heroImage = newImage;

    try {
      await content.save();
    } catch (error) {
      await deleteCloudinaryImage(newImage.publicId);
      throw error;
    }

    if (oldPublicId) {
      await deleteCloudinaryImage(oldPublicId);
    }
  }

  Object.assign(content, input);
  await content.save();

  res.status(200).json({
    success: true,
    message: 'Site content updated successfully',
    data: content,
  });
});

export const uploadLogo = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    throw ApiError.badRequest('Logo image is required');
  }

  const content = await SiteContent.getSingleton();
  const oldPublicId = content.logo?.publicId;
  const newLogo = await uploadImageBuffer(file.buffer, 'alyasmin/content');
  content.logo = newLogo;

  try {
    await content.save();
  } catch (error) {
    await deleteCloudinaryImage(newLogo.publicId);
    throw error;
  }

  if (oldPublicId) {
    await deleteCloudinaryImage(oldPublicId);
  }

  res.status(200).json({ success: true, data: content });
});

export const deleteLogo = asyncHandler(async (_req: Request, res: Response) => {
  const content = await SiteContent.getSingleton();
  const oldPublicId = content.logo?.publicId;

  content.logo = undefined;
  await content.save();

  if (oldPublicId) {
    await deleteCloudinaryImage(oldPublicId);
  }

  res.status(200).json({ success: true, data: content });
});
