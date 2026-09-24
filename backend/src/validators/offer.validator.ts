import { z } from 'zod';

const localizedTextSchema = z.object({
  he: z.string().trim().min(1, 'Hebrew text is required'),
  ar: z.string().trim().min(1, 'Arabic text is required'),
});

const booleanFromFormData = z.preprocess(
  (value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  },
  z.boolean(),
);

const plantIdsFromFormData = z.preprocess(
  (value) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Let Zod reject the original value below.
      }

      return [value];
    }

    return value;
  },
  z
    .array(
      z
        .string()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid plant ID'),
    )
    .default([]),
);

const offerBodySchema = z.object({
  title: localizedTextSchema,

  description: localizedTextSchema,

  plants: plantIdsFromFormData,

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),

  isActive: booleanFromFormData.optional().default(true),
});

export const offerCreateSchema = z.object({
  body: offerBodySchema,

  query: z.object({}).optional(),

  params: z.object({}).optional(),
});

export const offerUpdateSchema = z.object({
  body: offerBodySchema.partial(),

  query: z.object({}).optional(),

  params: z.object({
    id: z
      .string()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid offer ID'),
  }),
});

export type OfferCreateInput =
  z.infer<typeof offerCreateSchema>['body'];

export type OfferUpdateInput =
  z.infer<typeof offerUpdateSchema>['body'];