import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env';

export interface JwtPayload {
  id: string;
  role: 'admin';
}

/**
 * Signs a JWT for a given admin user. Kept as a pure function (no cookie
 * side-effects) so it's independently testable.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

/**
 * Attaches the JWT to the response as an httpOnly, secure cookie.
 * This is the ONLY place the token is meant to be persisted client-side —
 * it is never returned in the JSON response body, and the frontend never
 * touches localStorage for auth (per architecture decision, Phase updates).
 */
export function setAuthCookie(res: Response, token: string): void {
  const isProd = env.NODE_ENV === 'production';

  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd, // HTTPS only in production; allows local http dev
    sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-site Vercel <-> Render in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, mirrors JWT_EXPIRES_IN default
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  const isProd = env.NODE_ENV === 'production';

  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
}
