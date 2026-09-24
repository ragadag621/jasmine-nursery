import { z } from 'zod';

const localizedTextSchema = z.object({
  he: z.string().trim().min(1, 'Hebrew text is required'),
  ar: z.string().trim().min(1, 'Arabic text is required'),
});

export const galleryCreateSchema = z.object({
  body: z.object({
    title: localizedTextSchema,
    category: z.string().trim().toLowerCase().min(1, 'Category is required'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const galleryUpdateSchema = z.object({
  body: galleryCreateSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid gallery ID'),
  }),
});

export type GalleryCreateInput = z.infer<typeof galleryCreateSchema>['body'];
export type GalleryUpdateInput = z.infer<typeof galleryUpdateSchema>['body'];
