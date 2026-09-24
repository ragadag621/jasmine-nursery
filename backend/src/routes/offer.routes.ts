import { Router } from 'express';
import { listOffers, getOfferById, createOffer, updateOffer, deleteOffer } from '../controllers/offer.controller';
import { validate } from '../middleware/validate.middleware';
import { offerQuerySchema } from '../validators/catalog.validator';
import { offerCreateSchema, offerUpdateSchema } from '../validators/offer.validator';
import { idParamSchema } from '../validators/plant.validator';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import { uploadSingleImage } from '../middleware/upload.middleware';
import { parseJsonFields } from '../middleware/parseJsonFields.middleware';

const router = Router();

router.get('/', validate(offerQuerySchema), listOffers);
router.get('/:id', validate(idParamSchema), getOfferById);

router.post(
  '/',
  verifyToken,
  requireAdmin,
  uploadSingleImage,
  parseJsonFields(['title', 'description']),
  validate(offerCreateSchema),
  createOffer
);

router.put(
  '/:id',
  verifyToken,
  requireAdmin,
  uploadSingleImage,
  parseJsonFields(['title', 'description']),
  validate(offerUpdateSchema),
  updateOffer
);

router.delete('/:id', verifyToken, requireAdmin, validate(idParamSchema), deleteOffer);

export default router;
