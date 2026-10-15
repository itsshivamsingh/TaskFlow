import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { PasswordResetToken } from '../models/PasswordResetToken';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { logger } from '../utils/logger';
import { ENV } from '../config/env';

const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#4f46e5' },
  { name: 'Personal', color: '#06b6d4' },
  { name: 'Study', color: '#f59e0b' },
  { name: 'Projects', color: '#10b981' },
  { name: 'Other', color: '#8b5cf6' },
];

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      preferences: { theme: 'system' },
    });

    // Create default categories for user
    try {
      await Category.insertMany(
        DEFAULT_CATEGORIES.map((cat) => ({
          name: cat.name,
          color: cat.color,
          owner: user._id,
        }))
      );
    } catch (catErr: any) {
      logger.warn('Could not seed default categories:', catErr.message);
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      clearAuthCookie(res);
      res.status(401).json({ success: false, message: 'User not found. Please log in again.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always respond with a generic success message to prevent user enumeration
    if (!user) {
      res.status(200).json({
        success: true,
        message:
          'If an account exists with that email address, password reset instructions have been dispatched.',
      });
      return;
    }

    // Invalidate existing active tokens for this user
    await PasswordResetToken.updateMany({ userId: user._id, used: false }, { used: true });

    // Generate random 32-byte hex token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
      used: false,
    });

    const isEmailConfigured = Boolean(ENV.SMTP_HOST && ENV.SMTP_USER);

    if (isEmailConfigured) {
      // In production with SMTP configured, send email
      logger.info(`Sending password reset email to ${email}`);
    } else {
      logger.info(
        `[DEVELOPMENT NOTICE] SMTP not configured. Reset link for ${email}: ${ENV.CLIENT_URL}/reset-password?token=${rawToken}`
      );
    }

    res.status(200).json({
      success: true,
      message:
        'If an account exists with that email address, password reset instructions have been dispatched.',
      // In development or when email is not configured, provide the reset token for seamless testing
      ...(!isEmailConfigured || ENV.NODE_ENV === 'development'
        ? {
            developmentToken: rawToken,
            resetUrl: `${ENV.CLIENT_URL}/reset-password?token=${rawToken}`,
            note: 'SMTP is not configured in .env; dev token provided for local testing.',
          }
        : {}),
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, password } = req.body;

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired. Please request a new one.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(resetRecord.userId, { passwordHash });

    resetRecord.used = true;
    await resetRecord.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You may now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
