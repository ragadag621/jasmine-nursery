import { Router } from 'express';
import { getSiteContent, updateSiteContent } from '../controllers/content.controller';
import { validate } from '../middleware/validate.middleware';
import { contentUpdateSchema } from '../validators/content.validator';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import { uploadSingleImage } from '../middleware/upload.middleware';
import { parseJsonFields } from '../middleware/parseJsonFields.middleware';

const router = Router();

router.get('/', getSiteContent);

router.put(
  '/',
  verifyToken,
  requireAdmin,
  uploadSingleImage,
  parseJsonFields(['heroTitle', 'heroSubtitle', 'aboutText', 'openingHours', 'socialLinks']),
  validate(contentUpdateSchema),
  updateSiteContent
);

export default router;
