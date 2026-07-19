import { z } from 'zod';

const localizedTextSchema = z.object({
  he: z.string().trim().min(1, 'Hebrew text is required'),
  ar: z.string().trim().min(1, 'Arabic text is required'),
});

export const offerCreateSchema = z.object({
  body: z.object({
    title: localizedTextSchema,
    description: localizedTextSchema,
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    isActive: z.coerce.boolean().optional().default(true),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const offerUpdateSchema = z.object({
  body: offerCreateSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().trim().min(1) }),
});

export type OfferCreateInput = z.infer<typeof offerCreateSchema>['body'];
export type OfferUpdateInput = z.infer<typeof offerUpdateSchema>['body'];
