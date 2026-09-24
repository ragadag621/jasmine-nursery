import { Router } from 'express';

import {
  getSiteContent,
  updateSiteContent,
  uploadLogo,
  deleteLogo,
} from '../controllers/content.controller';

import { validate } from '../middleware/validate.middleware';

import { contentUpdateSchema } from '../validators/content.validator';

import {
  verifyToken,
  requireAdmin,
} from '../middleware/auth.middleware';

import { uploadSingleHeroImage, uploadSingleLogo } from '../middleware/upload.middleware';

import { parseJsonFields } from '../middleware/parseJsonFields.middleware';

const router = Router();

router.get('/', getSiteContent);

router.put(
  '/',
  verifyToken,
  requireAdmin,
  uploadSingleHeroImage,
  parseJsonFields([
    'heroTitle',
    'siteName',
    'heroSubtitle',
    'aboutText',
    'openingHours',
    'socialLinks',
  ]),
  validate(contentUpdateSchema),
  updateSiteContent,
);

router.post('/logo', verifyToken, requireAdmin, uploadSingleLogo, uploadLogo);
router.delete('/logo', verifyToken, requireAdmin, deleteLogo);

export default router;