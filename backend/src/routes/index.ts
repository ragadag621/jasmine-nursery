import { Router } from 'express';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import plantRoutes from './plant.routes';
import galleryRoutes from './gallery.routes';
import testimonialRoutes from './testimonial.routes';
import offerRoutes from './offer.routes';
import contentRoutes from './content.routes';
import contactRoutes from './contact.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

/**
 * Full API surface as of Phase 4 (final): every resource has its public
 * GET endpoints plus protected admin CRUD, per architecture.md.
 */
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/plants', plantRoutes);
router.use('/gallery', galleryRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/offers', offerRoutes);
router.use('/content', contentRoutes);
router.use('/contact', contactRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Al-Yasmin Nursery API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
