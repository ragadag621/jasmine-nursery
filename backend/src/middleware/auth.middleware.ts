import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { JwtPayload } from '../utils/token';

// Augment Express's Request type so `req.user` is typed wherever this
// middleware has run, instead of using `any` in every downstream controller.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
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
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next();
    } catch {
      throw ApiError.unauthorized('Invalid or expired session');
    }
  }
);

/**
 * Runs after verifyToken. Separated out so future roles (e.g. 'staff')
 * can be added without touching the token-verification logic itself.
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    throw ApiError.forbidden('Admin access required');
  }
  next();
};
