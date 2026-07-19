import { z } from 'zod';

export const contactCreateSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    phone: z
      .string()
      .trim()
      .min(7, 'Phone number looks too short')
      .max(20, 'Phone number looks too long'),
    email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
    message: z
      .string()
      .trim()
      .min(5, 'Message must be at least 5 characters')
      .max(2000, 'Message must be at most 2000 characters'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type ContactCreateInput = z.infer<typeof contactCreateSchema>['body'];

export const contactListQuerySchema = z.object({
  query: z.object({
    status: z.enum(['new', 'read', 'resolved']).optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const contactStatusUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['new', 'read', 'resolved']),
  }),
  query: z.object({}).optional(),
  params: z.object({ id: z.string().trim().min(1) }),
});

export const contactIdParamSchema = z.object({
  params: z.object({ id: z.string().trim().min(1) }),
  query: z.object({}).optional(),
  body: z.object({}).optional(),
});
