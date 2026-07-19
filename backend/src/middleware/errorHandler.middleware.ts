import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
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
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image file is too large (max 5MB)'
        : err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE'
          ? 'Too many images in this upload'
          : `Upload error: ${err.message}`;
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
