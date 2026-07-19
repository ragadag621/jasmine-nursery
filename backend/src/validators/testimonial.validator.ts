import { z } from 'zod';

const localizedTextSchema = z.object({
  he: z.string().trim().min(1, 'Hebrew text is required'),
  ar: z.string().trim().min(1, 'Arabic text is required'),
});

export const testimonialCreateSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(1, 'Customer name is required'),
    rating: z.coerce.number().int().min(1).max(5),
    text: localizedTextSchema,
    isVisible: z.coerce.boolean().optional().default(true),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const testimonialUpdateSchema = z.object({
  body: testimonialCreateSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().trim().min(1) }),
});

export type TestimonialCreateInput = z.infer<typeof testimonialCreateSchema>['body'];
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>['body'];
