import { Router } from 'express';
import {
  listPlants,
  listPlantsAdmin,
  getPlantBySlug,
  getPlantByIdAdmin,
  createPlant,
  updatePlant,
  deletePlant,
  togglePlantVisibility,
  deletePlantImage,
} from '../controllers/plant.controller';
import { validate } from '../middleware/validate.middleware';
import {
  plantListQuerySchema,
  plantSlugParamsSchema,
} from '../validators/catalog.validator';
import { plantCreateSchema, plantUpdateSchema, idParamSchema } from '../validators/plant.validator';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import { uploadMultipleImages } from '../middleware/upload.middleware';
import { parseJsonFields } from '../middleware/parseJsonFields.middleware';

const router = Router();

// --- Protected (admin) — registered BEFORE the public /:slug catch-all ---
router.get('/admin/all', verifyToken, requireAdmin, validate(plantListQuerySchema), listPlantsAdmin);
router.get('/admin/:id', verifyToken, requireAdmin, validate(idParamSchema), getPlantByIdAdmin);

router.post(
  '/',
  verifyToken,
  requireAdmin,
  uploadMultipleImages,
  parseJsonFields(['name', 'description', 'care', 'offer']),
  validate(plantCreateSchema),
  createPlant
);

router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  uploadMultipleImages,
  parseJsonFields(['name', 'description', 'care', 'offer']),
  validate(plantUpdateSchema),
  updatePlant
);

router.delete('/:id', verifyToken, requireAdmin, validate(idParamSchema), deletePlant);
router.patch('/:id/hide', verifyToken, requireAdmin, validate(idParamSchema), togglePlantVisibility);
router.delete('/:id/images/:imageId', verifyToken, requireAdmin, deletePlantImage);

// --- Public ---
router.get('/', validate(plantListQuerySchema), listPlants);
router.get('/:slug', validate(plantSlugParamsSchema), getPlantBySlug);

export default router;
