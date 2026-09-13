import { Router } from 'express';
import {
  submitContactMessage,
  listContactMessages,
  updateContactStatus,
  deleteContactMessage,
} from '../controllers/contact.controller';
import { validate } from '../middleware/validate.middleware';
import {
  contactCreateSchema,
  contactListQuerySchema,
  contactStatusUpdateSchema,
  contactIdParamSchema,
} from '../validators/contact.validator';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';
import { contactRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/',contactRateLimiter, validate(contactCreateSchema), submitContactMessage);
router.get('/', verifyToken, requireAdmin, validate(contactListQuerySchema), listContactMessages);
router.patch('/:id/status', verifyToken, requireAdmin, validate(contactStatusUpdateSchema), updateContactStatus);
router.delete('/:id', verifyToken, requireAdmin, validate(contactIdParamSchema), deleteContactMessage);

export default router;
