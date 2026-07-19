import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { verifyToken, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', verifyToken, requireAdmin, getDashboardStats);

export default router;
