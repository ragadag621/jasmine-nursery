import { z } from 'zod';

const localizedTextSchema = z.object({
  he: z.string().trim().min(1, 'Hebrew text is required'),
  ar: z.string().trim().min(1, 'Arabic text is required'),
});

const openingHourSchema = z.object({
  day: z.string().trim().min(1),
  open: z.string().trim().min(1),
  close: z.string().trim().min(1),
});

export const contentUpdateSchema = z.object({
  body: z
    .object({
      heroTitle: localizedTextSchema,
      heroSubtitle: localizedTextSchema,
      aboutText: localizedTextSchema,
      phone: z.string().trim().min(1),
      whatsapp: z.string().trim().min(1),
      address: z.string().trim().min(1),
      openingHours: z.array(openingHourSchema).optional(),
      socialLinks: z
        .object({
          instagram: z.string().trim().optional(),
          facebook: z.string().trim().optional(),
          tiktok: z.string().trim().optional(),
        })
        .optional(),
      googleRating: z.coerce.number().min(0).max(5).optional(),
      googleReviewCount: z.coerce.number().min(0).optional(),
      mapEmbedUrl: z.string().trim().optional(),
    })
    .partial(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>['body'];
