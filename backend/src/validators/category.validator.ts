import { z } from 'zod';

const localizedTextSchema = z.object({
  he: z.string().trim().min(1, 'Hebrew text is required'),
  ar: z.string().trim().min(1, 'Arabic text is required'),
});

const optionalLocalizedTextSchema = z
  .object({
    he: z.string().trim().optional(),
    ar: z.string().trim().optional(),
  })
  .optional();

export const categoryCreateSchema = z.object({
  body: z.object({
    name: localizedTextSchema,
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: optionalLocalizedTextSchema,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const categoryUpdateSchema = z.object({
  body: categoryCreateSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().trim().min(1) }),
});

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>['body'];
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>['body'];
