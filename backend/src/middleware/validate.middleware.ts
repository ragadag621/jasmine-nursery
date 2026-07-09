import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Validates req.body / req.query / req.params against a Zod schema shaped
 * like `z.object({ body: ..., query: ..., params: ... })`. Only the parts
 * present in the schema need to be defined by each validator file.
 *
 * On success, `req.body` etc. are REPLACED with the parsed (and
 * coerced/trimmed) values, so controllers can trust their shape completely.
 */
export function validate(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        next(ApiError.badRequest('Validation failed', messages));
        return;
      }
      next(err);
    }
  };
}
