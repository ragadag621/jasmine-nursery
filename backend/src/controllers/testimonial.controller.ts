import { Request, Response } from 'express';
import { Testimonial } from '../models';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { TestimonialCreateInput, TestimonialUpdateInput } from '../validators/testimonial.validator';

/**
 * GET /api/testimonials
 * Public. Only ever returns testimonials the admin has marked visible —
 * this endpoint has no query param to override that, by design.
 */
export const listTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await Testimonial.find({ isVisible: true }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: testimonials,
  });
});

/** GET /api/testimonials/all — Protected (admin). Includes hidden testimonials. */
export const listAllTestimonials = asyncHandler(async (_req: Request, res: Response) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: testimonials });
});

/** POST /api/testimonials — Protected (admin). */
export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as TestimonialCreateInput;
  const testimonial = await Testimonial.create(input);

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: testimonial,
  });
});

/** PUT /api/testimonials/:id — Protected (admin). */
export const updateTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as TestimonialUpdateInput;

  const testimonial = await Testimonial.findByIdAndUpdate(id, input, { new: true });
  if (!testimonial) {
    throw ApiError.notFound('Testimonial not found');
  }

  res.status(200).json({
    success: true,
    message: 'Testimonial updated successfully',
    data: testimonial,
  });
});

/** DELETE /api/testimonials/:id — Protected (admin). */
export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) {
    throw ApiError.notFound('Testimonial not found');
  }

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully',
  });
});
