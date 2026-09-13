import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    PORT: z.coerce
      .number()
      .int()
      .min(1)
      .max(65535)
      .default(5000),

    MONGODB_URI: z
      .string()
      .trim()
      .min(1, 'MONGODB_URI is required'),

    JWT_SECRET: z
      .string()
      .trim()
      .min(1, 'JWT_SECRET is required'),

    JWT_EXPIRES_IN: z
      .string()
      .trim()
      .min(1, 'JWT_EXPIRES_IN is required'),

    COOKIE_NAME: z
      .string()
      .trim()
      .min(1, 'COOKIE_NAME is required'),

    CLOUDINARY_CLOUD_NAME: z
      .string()
      .trim()
      .min(1, 'CLOUDINARY_CLOUD_NAME is required'),

    CLOUDINARY_API_KEY: z
      .string()
      .trim()
      .min(1, 'CLOUDINARY_API_KEY is required'),

    CLOUDINARY_API_SECRET: z
      .string()
      .trim()
      .min(1, 'CLOUDINARY_API_SECRET is required'),

    CLIENT_URL: z
      .string()
      .trim()
      .url('CLIENT_URL must be a valid URL'),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'production') {
      return;
    }

    let clientUrl: URL;

    try {
      clientUrl = new URL(data.CLIENT_URL);
    } catch {
      return;
    }

    if (clientUrl.protocol !== 'https:') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CLIENT_URL'],
        message: 'CLIENT_URL must use HTTPS in production',
      });
    }

    const hostname = clientUrl.hostname.toLowerCase();

    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1'
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CLIENT_URL'],
        message:
          'Development/local origins are not allowed in production',
      });
    }
  });

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('[env] Environment validation failed:');

  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  }

  process.exit(1);
}

export const env = result.data;