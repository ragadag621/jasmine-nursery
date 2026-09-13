import { z } from 'zod';

/**
 * GET /api/plants query params. All optional — an empty query returns the
 * first page of all non-hidden plants in default order.
 */
export const plantListQuerySchema = z.object({
  query: z.object({
    category: z.string().trim().optional(),
    search: z.string().trim().max(100).optional(),
    sort: z.enum(['newest', 'name_asc', 'name_desc', 'price_asc', 'price_desc']).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(12),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type PlantListQuery = z.infer<typeof plantListQuerySchema>['query'];

export const plantSlugParamsSchema = z.object({
  params: z.object({
   slug: z
   .string()
   .trim()
   .toLowerCase()
   .regex(/^[a-z0-9-]+$/, 'Invalid plant slug'),
  }),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});

export const galleryQuerySchema = z.object({
  query: z.object({
    category: z.string().trim().optional(),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const offerQuerySchema = z.object({
  query: z.object({
    active: z
      .enum(['true', 'false'])
      .optional()
      .transform((v) => (v === undefined ? undefined : v === 'true')),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});
