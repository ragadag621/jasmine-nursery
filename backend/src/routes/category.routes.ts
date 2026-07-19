import { Router } from 'express';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { validate } from '../middleware/validate.middleware';
import { categoryCreateSchema, categoryUpdateSchema } from '../validators/category.validator';
import { idParamSchema } from '../validators/plant.validator';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import { uploadSingleImage } from '../middleware/upload.middleware';
import { parseJsonFields } from '../middleware/parseJsonFields.middleware';

const router = Router();

router.get('/', listCategories);

router.post(
  '/',
  verifyToken,
  requireAdmin,
  uploadSingleImage,
  parseJsonFields(['name', 'description']),
  validate(categoryCreateSchema),
  createCategory
);

router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  uploadSingleImage,
  parseJsonFields(['name', 'description']),
  validate(categoryUpdateSchema),
  updateCategory
);

router.delete('/:id', verifyToken, requireAdmin, validate(idParamSchema), deleteCategory);

export default router;
