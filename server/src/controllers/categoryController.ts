import { Response, NextFunction } from 'express';
import { Category } from '../models/Category';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getCategories = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const categories = await Category.find({ owner: userId }).sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, color = '#6366f1' } = req.body;

    if (!name || typeof name !== 'string') {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const category = await Category.create({
      name: name.trim(),
      color,
      owner: userId,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'Category with this name already exists.' });
      return;
    }
    next(error);
  }
};

export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const category = await Category.findOneAndDelete({ _id: id, owner: userId });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted.',
    });
  } catch (error) {
    next(error);
  }
};
