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

const optionalHttpsUrl = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .refine((value) => value.startsWith('https://'), 'Only HTTPS URLs are allowed')
  .optional();

export const contentUpdateSchema = z.object({
  body: z
    .object({
      heroTitle: localizedTextSchema,
      siteName: localizedTextSchema,
      heroSubtitle: localizedTextSchema,
      aboutText: localizedTextSchema,
      phone: z.string().trim().min(1),
      whatsapp: z.string().trim().min(1),
      address: z.string().trim().min(1),
      openingHours: z.array(openingHourSchema).optional(),
      socialLinks: z
        .object({
          instagram: optionalHttpsUrl,
          facebook: optionalHttpsUrl,
          tiktok: optionalHttpsUrl,
        })
        .optional(),
      googleRating: z.coerce.number().min(0).max(5).optional(),
      googleReviewCount: z.coerce.number().min(0).optional(),
      mapEmbedUrl: optionalHttpsUrl,
    })
    .partial(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>['body'];
