import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken, getCookieOptions } from '../src/utils/jwt';
import { registerSchema, loginSchema } from '../src/validators/authValidators';
import { createTaskSchema } from '../src/validators/taskValidators';
import { ENV } from '../src/config/env';

describe('TaskFlow API & Security Test Suite', () => {
  const app = createApp();

  describe('Password Hashing & Token Verification', () => {
    it('should securely hash passwords and verify bcrypt match', async () => {
      const password = 'StrongPassword123!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      expect(hash).not.toBe(password);
      expect(await bcrypt.compare(password, hash)).toBe(true);
      expect(await bcrypt.compare('WrongPassword999', hash)).toBe(false);
    });

    it('should correctly sign and verify JWT tokens', () => {
      const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@example.com' };
      const token = signToken(payload);
      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });

    it('should return secure cross-site cookie options in production', () => {
      const originalEnv = ENV.NODE_ENV;
      try {
        (ENV as any).NODE_ENV = 'production';
        const prodOptions = getCookieOptions();
        expect(prodOptions.httpOnly).toBe(true);
        expect(prodOptions.secure).toBe(true);
        expect(prodOptions.sameSite).toBe('none');
        expect(prodOptions.path).toBe('/');
      } finally {
        (ENV as any).NODE_ENV = originalEnv;
      }
    });

    it('should return lax cookie options in development', () => {
      const originalEnv = ENV.NODE_ENV;
      try {
        (ENV as any).NODE_ENV = 'development';
        const devOptions = getCookieOptions();
        expect(devOptions.httpOnly).toBe(true);
        expect(devOptions.secure).toBe(false);
        expect(devOptions.sameSite).toBe('lax');
      } finally {
        (ENV as any).NODE_ENV = originalEnv;
      }
    });
  });

  describe('Zod Input Validation', () => {
    it('should validate registration password requirements', () => {
      // Missing uppercase letter
      const weakResult = registerSchema.safeParse({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(weakResult.success).toBe(false);

      // Passwords do not match
      const mismatchResult = registerSchema.safeParse({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password456',
      });
      expect(mismatchResult.success).toBe(false);

      // Valid credentials
      const validResult = registerSchema.safeParse({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(validResult.success).toBe(true);
    });

    it('should validate login credentials', () => {
      const invalidEmail = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'Password123!',
      });
      expect(invalidEmail.success).toBe(false);

      const validLogin = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'Password123!',
      });
      expect(validLogin.success).toBe(true);
    });

    it('should validate task creation fields', () => {
      // Missing required title and due date
      const invalidTask = createTaskSchema.safeParse({
        description: 'No title or due date',
      });
      expect(invalidTask.success).toBe(false);

      // Valid task
      const validTask = createTaskSchema.safeParse({
        title: 'Complete Project Roadmap',
        dueDate: new Date().toISOString(),
        status: 'todo',
        priority: 'high',
        category: 'Work',
      });
      expect(validTask.success).toBe(true);
    });
  });

  describe('Public & Protected Route Authorization', () => {
    it('GET /api/health should return ok status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /api/tasks without auth should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Authentication required');
    });

    it('GET /api/dashboard/stats without auth should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/dashboard/productivity without auth should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/dashboard/productivity');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/users/me without auth should return 401 Unauthorized', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
    });

    it('POST /api/auth/register should reject empty payload with 400', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/logout should return 200 and clear cookie', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Bearer Token & Cookie Authentication Handling', () => {
    it('should reject invalid Bearer token with 401', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', 'Bearer invalid-token-string');
      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid or expired');
    });

    it('should reject invalid cookie token with 401', async () => {
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Cookie', [`${ENV.COOKIE_NAME}=invalid-token-string`]);
      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Invalid or expired');
    });

    it('should allow valid Bearer token to pass authentication middleware', async () => {
      const validToken = signToken({
        userId: '507f1f77bcf86cd799439011',
        email: 'auth_test@example.com',
      });

      // When valid token is provided, requireAuth succeeds.
      // Next middleware is requireDatabaseConnection. Since DB is offline during tests, it returns 503 instead of 401!
      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${validToken}`);

      // Crucially, it did NOT return 401! It successfully passed auth!
      expect(res.status).not.toBe(401);
    });

    it('should allow valid Cookie token to pass authentication middleware', async () => {
      const validToken = signToken({
        userId: '507f1f77bcf86cd799439011',
        email: 'auth_test@example.com',
      });

      const res = await request(app)
        .get('/api/dashboard/stats')
        .set('Cookie', [`${ENV.COOKIE_NAME}=${validToken}`]);

      // Crucially, it did NOT return 401! It successfully passed auth!
      expect(res.status).not.toBe(401);
    });
  });

  describe('CORS and Route handling', () => {
    it('should allow production Vercel origin with CORS credentials', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'https://task-flow-wine-iota-25.vercel.app');
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe(
        'https://task-flow-wine-iota-25.vercel.app'
      );
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should return 404 for nonexistent API routes', async () => {
      const res = await request(app).get('/api/nonexistent-route-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
