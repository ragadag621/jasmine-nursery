import { Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

/**
 * Phase 2 scope: auth routes are live (login/logout/me). Other resources
 * still pending their own model+controller+route trio in later phases:
 *
 *   router.use('/plants', plantRoutes);
 *   router.use('/categories', categoryRoutes);
 *   router.use('/gallery', galleryRoutes);
 *   router.use('/contact', contactRoutes);
 *   router.use('/content', contentRoutes);
 *   router.use('/testimonials', testimonialRoutes);
 *   router.use('/offers', offerRoutes);
 *   router.use('/dashboard', dashboardRoutes);
 */
router.use('/auth', authRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Al-Yasmin Nursery API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
