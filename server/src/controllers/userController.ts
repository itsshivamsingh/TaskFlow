import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Category } from '../models/Category';
import { PasswordResetToken } from '../models/PasswordResetToken';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { clearAuthCookie } from '../utils/jwt';

export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
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

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (preferences) {
      if (preferences.theme) {
        user.preferences = {
          ...user.preferences,
          theme: preferences.theme,
        };
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.userId).select('+passwordHash');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Cascade delete all tasks, categories, reset tokens
    await Task.deleteMany({ owner: userId });
    await Category.deleteMany({ owner: userId });
    await PasswordResetToken.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    clearAuthCookie(res);

    res.status(200).json({
      success: true,
      message: 'Your account and all associated tasks have been permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
};
