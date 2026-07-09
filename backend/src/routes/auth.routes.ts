import { Router } from 'express';
import { login, logout, getCurrentAdmin } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', verifyToken, getCurrentAdmin);

export default router;
