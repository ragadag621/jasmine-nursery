import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * multipart/form-data (used for any request carrying file uploads) can only
 * transport flat string fields — nested objects like `name: { he, ar }` or
 * `care: { water, sunlight }` arrive as JSON-stringified strings. This
 * middleware parses the given field names back into objects/numbers/booleans
 * BEFORE the Zod validator runs, so validators never need to know whether
 * the request was JSON or multipart.
 */
export function parseJsonFields(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const field of fields) {
      const value = req.body?.[field];
      if (typeof value === 'string') {
        try {
          req.body[field] = JSON.parse(value);
        } catch {
          next(ApiError.badRequest(`Field "${field}" must be valid JSON`));
          return;
        }
      }
    }
    next();
  };
}
