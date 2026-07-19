import { Router } from 'express';
import {
  listGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  deleteGalleryImage,
} from '../controllers/gallery.controller';
import { validate } from '../middleware/validate.middleware';
import { galleryQuerySchema } from '../validators/catalog.validator';
import { galleryCreateSchema, galleryUpdateSchema } from '../validators/gallery.validator';
import { idParamSchema } from '../validators/plant.validator';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import { uploadMultipleImages } from '../middleware/upload.middleware';
import { parseJsonFields } from '../middleware/parseJsonFields.middleware';

const router = Router();

router.get('/', validate(galleryQuerySchema), listGallery);

router.post(
  '/',
  verifyToken,
  requireAdmin,
  uploadMultipleImages,
  parseJsonFields(['title']),
  validate(galleryCreateSchema),
  createGalleryItem
);

router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  uploadMultipleImages,
  parseJsonFields(['title']),
  validate(galleryUpdateSchema),
  updateGalleryItem
);

router.delete('/:id', verifyToken, requireAdmin, validate(idParamSchema), deleteGalleryItem);
router.delete('/:id/images/:imageId', verifyToken, requireAdmin, deleteGalleryImage);

export default router;
