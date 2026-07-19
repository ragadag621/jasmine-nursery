import { Router } from 'express';
import {
  listTestimonials,
  listAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonial.controller';
import { validate } from '../middleware/validate.middleware';
import { testimonialCreateSchema, testimonialUpdateSchema } from '../validators/testimonial.validator';
import { idParamSchema } from '../validators/plant.validator';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', listTestimonials);
router.get('/all', verifyToken, requireAdmin, listAllTestimonials);
router.post('/', verifyToken, requireAdmin, validate(testimonialCreateSchema), createTestimonial);
router.put('/:id', verifyToken, requireAdmin, validate(testimonialUpdateSchema), updateTestimonial);
router.delete('/:id', verifyToken, requireAdmin, validate(idParamSchema), deleteTestimonial);

export default router;
