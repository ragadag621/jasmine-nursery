import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

import { errorHandler } from '../middleware/errorHandler.middleware';
import { ApiError } from '../utils/ApiError';

describe('Error Handler API', () => {
  const app = express();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a generic 500 response for unexpected errors', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new Error('Sensitive internal database error');
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(500)
      .expect('Content-Type', /json/);

    expect(response.body).toEqual({
      success: false,
      message: 'Internal server error',
      errors: [],
    });

    expect(JSON.stringify(response.body)).not.toContain(
      'Sensitive internal database error'
    );
  });

  it('should not expose stack traces in the response', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new Error('Internal implementation detail');
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');

    expect(response.body.stack).toBeUndefined();
    expect(JSON.stringify(response.body)).not.toContain('Error:');
    expect(JSON.stringify(response.body)).not.toContain('at ');
  });

  it('should not expose MongoDB or database error details', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new Error(
        'MongoServerError: E11000 duplicate key error collection: users index: email_1 dup key'
      );
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');

    const responseBody = JSON.stringify(response.body);

    expect(responseBody).not.toContain('MongoServerError');
    expect(responseBody).not.toContain('E11000');
    expect(responseBody).not.toContain('duplicate key');
    expect(responseBody).not.toContain('users');
    expect(responseBody).not.toContain('email_1');
  });

  it('should not expose Cloudinary error details', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new Error(
        'Cloudinary upload failed: Invalid API Secret or authentication failed'
      );
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');

    const responseBody = JSON.stringify(response.body);

    expect(responseBody).not.toContain('Cloudinary');
    expect(responseBody).not.toContain('API Secret');
    expect(responseBody).not.toContain('authentication failed');
  });

  it('should not expose internal file paths', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new Error(
        'ENOENT: no such file or directory, open /app/src/services/upload.service.ts'
      );
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');

    const responseBody = JSON.stringify(response.body);

    expect(responseBody).not.toContain('/app/');
    expect(responseBody).not.toContain('/src/');
    expect(responseBody).not.toContain('upload.service.ts');
    expect(responseBody).not.toContain('ENOENT');
  });

  it('should log unexpected errors server-side', async () => {
    const testApp = express();

    const error = new Error('Sensitive internal error');

    testApp.get('/test-error', () => {
      throw error;
    });

    testApp.use(errorHandler);

    await request(testApp)
      .get('/test-error')
      .expect(500);

    expect(console.error).toHaveBeenCalledWith('[error]', error);
  });

  it('should preserve ApiError status and message', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new ApiError(400, 'Validation failed', [
        'Name is required',
      ]);
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(400);

    expect(response.body).toEqual({
      success: false,
      message: 'Validation failed',
      errors: ['Name is required'],
    });
  });

  it('should preserve expected 404 ApiError responses', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new ApiError(404, 'Resource not found');
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(404);

    expect(response.body).toEqual({
      success: false,
      message: 'Resource not found',
      errors: [],
    });
  });

  it('should not expose internal error details through errors array', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new Error(
        'MongoDB connection string mongodb+srv://admin:password@cluster.mongodb.net'
      );
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(500);

    const responseBody = JSON.stringify(response.body);

    expect(responseBody).not.toContain('mongodb+srv://');
    expect(responseBody).not.toContain('admin');
    expect(responseBody).not.toContain('password');
    expect(responseBody).not.toContain('cluster.mongodb.net');

    expect(response.body.errors).toEqual([]);
  });

  it('should always return the standard error response structure', async () => {
    const testApp = express();

    testApp.get('/test-error', () => {
      throw new Error('Unexpected internal failure');
    });

    testApp.use(errorHandler);

    const response = await request(testApp)
      .get('/test-error')
      .expect(500);

    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('errors');

    expect(response.body.success).toBe(false);
    expect(typeof response.body.message).toBe('string');
    expect(Array.isArray(response.body.errors)).toBe(true);
  });
});