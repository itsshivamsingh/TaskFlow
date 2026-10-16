import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { validateBody } from '../middleware/validateMiddleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidators';
import { requireAuth } from '../middleware/authMiddleware';
import { requireDatabaseConnection } from '../middleware/dbCheckMiddleware';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), requireDatabaseConnection, register);
router.post('/login', authLimiter, validateBody(loginSchema), requireDatabaseConnection, login);
router.post('/logout', logout);
router.get('/me', requireAuth, requireDatabaseConnection, getMe);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), requireDatabaseConnection, forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), requireDatabaseConnection, resetPassword);

export default router;
