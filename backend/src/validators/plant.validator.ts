import { z } from 'zod';

const localizedTextSchema = z.object({
  he: z.string().trim().min(1, 'Hebrew text is required'),
  ar: z.string().trim().min(1, 'Arabic text is required'),
});

export const plantCreateSchema = z.object({
  body: z.object({
    name: localizedTextSchema,
    scientificName: z.string().trim().optional(),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: localizedTextSchema,
    category: z.string().trim().min(1, 'Category is required'),
    price: z.coerce.number().min(0).optional(),
    availability: z.enum(['in_stock', 'low_stock', 'out_of_stock']).default('in_stock'),
    care: z.object({
      water: z.enum(['low', 'medium', 'high']),
      sunlight: z.enum(['full_sun', 'partial_shade', 'full_shade']),
    }),
    featured: z.coerce.boolean().optional().default(false),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const plantUpdateSchema = z.object({
  body: plantCreateSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().trim().min(1),
  }),
});

export const idParamSchema = z.object({
  params: z.object({ id: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid plant ID')}),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});

export type PlantCreateInput = z.infer<typeof plantCreateSchema>['body'];
export type PlantUpdateInput = z.infer<typeof plantUpdateSchema>['body'];
