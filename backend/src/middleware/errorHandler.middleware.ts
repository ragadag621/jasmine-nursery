import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

/**
 * Single place where every thrown/forwarded error becomes a JSON response.
 * Must be registered LAST in app.ts, after all routes.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: string[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (env.NODE_ENV !== 'production') {
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
