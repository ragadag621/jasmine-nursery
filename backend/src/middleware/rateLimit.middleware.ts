import rateLimit from 'express-rate-limit';

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === 'test',

  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === 'test',

  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

export const contactRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === 'test',

  message: {
    success: false,
    message: 'Too many messages submitted. Please try again later.',
  },
});