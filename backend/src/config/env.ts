import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  COOKIE_NAME: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLIENT_URL: string;
}

/**
 * Reads and validates required environment variables at startup.
 * Fails fast with a clear message rather than crashing deep in the app
 * the first time a missing variable is actually used.
 */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadEnv(): EnvConfig {
  const nodeEnv = (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development';

  // In non-production environments we allow placeholder values so the
  // server can boot for local scaffolding/testing before real secrets exist.
  const isProd = nodeEnv === 'production';

  const getRequiredOrPlaceholder = (name: string, placeholder: string): string => {
    const value = process.env[name];
    if (!value || value.trim() === '') {
      if (isProd) {
        return requireEnv(name); // throws
      }
      return placeholder;
    }
    return value;
  };

  return {
    NODE_ENV: nodeEnv,
    PORT: Number(process.env.PORT) || 5000,
    MONGODB_URI: getRequiredOrPlaceholder(
      'MONGODB_URI',
      'mongodb://localhost:27017/alyasmin-nursery-dev'
    ),
    JWT_SECRET: getRequiredOrPlaceholder('JWT_SECRET', 'dev-only-placeholder-secret-change-me'),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    COOKIE_NAME: process.env.COOKIE_NAME || 'alyasmin_admin_token',
    CLOUDINARY_CLOUD_NAME: getRequiredOrPlaceholder('CLOUDINARY_CLOUD_NAME', 'placeholder'),
    CLOUDINARY_API_KEY: getRequiredOrPlaceholder('CLOUDINARY_API_KEY', 'placeholder'),
    CLOUDINARY_API_SECRET: getRequiredOrPlaceholder('CLOUDINARY_API_SECRET', 'placeholder'),
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  };
}

export const env = loadEnv();
