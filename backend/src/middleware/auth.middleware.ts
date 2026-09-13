import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

// Runtime validation for decoded JWT payload.
// TypeScript types alone cannot validate data coming from a JWT at runtime.
const jwtPayloadSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user id'),
  role: z.literal('admin'),
  exp: z.number().int().positive(),
});

// Augment Express's Request type so `req.user` is typed wherever this
// middleware has run, instead of using `any` in every downstream controller.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: z.infer<typeof jwtPayloadSchema>;
    }
  }
}

/**
 * Verifies the JWT stored in the httpOnly auth cookie (see utils/token.ts).
 * The token is never read from an Authorization header — cookies are the
 * single auth transport for this app, which is what makes httpOnly
 * protection meaningful (no token ever touches client-side JS/localStorage).
 */
export const verifyToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.[env.COOKIE_NAME];

    if (!token) {
      throw ApiError.unauthorized('Authentication required');
    }

    try {
      // jwt.verify() verifies the signature and also enforces the JWT
      // expiration (`exp`) when present.
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Zod validates the decoded payload at runtime before we trust it.
      const result = jwtPayloadSchema.safeParse(decoded);

      if (!result.success) {
        throw ApiError.unauthorized('Invalid authentication token');
      }

      req.user = result.data;
      next();
    } catch (error) {
      // Preserve our explicit authentication error instead of replacing it.
      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.unauthorized('Invalid or expired session');
    }
  }
);

/**
 * Runs after verifyToken. Separated out so future roles (e.g. 'staff')
 * can be added without touching the token-verification logic itself.
 */
export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    throw ApiError.forbidden('Admin access required');
  }

  next();
};