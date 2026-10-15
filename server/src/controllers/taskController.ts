import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task, TaskPriority } from '../models/Task';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const priorityOrder: Record<TaskPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      search,
      status,
      priority,
      category,
      tag,
      dueDateFilter,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = req.query as any;

    const query: any = { owner: new mongoose.Types.ObjectId(userId) };

    // Search query
    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Tag filter
    if (tag && tag !== 'all') {
      query.tags = tag;
    }

    // Due date filter
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (dueDateFilter === 'today') {
      query.dueDate = { $gte: startOfToday, $lte: endOfToday };
    } else if (dueDateFilter === 'this_week') {
      const endOfWeek = new Date(startOfToday);
      endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      query.dueDate = { $gte: startOfToday, $lte: endOfWeek };
    } else if (dueDateFilter === 'overdue') {
      query.dueDate = { $lt: startOfToday };
      query.status = { $ne: 'completed' };
    } else if (dueDateFilter === 'upcoming') {
      query.dueDate = { $gt: endOfToday };
    }

    const sortOptions: any = {};
    const direction = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'priority') {
      // In MongoDB, standard priority sort
      sortOptions.priority = direction;
    } else if (sortBy === 'dueDate') {
      sortOptions.dueDate = direction;
    } else if (sortBy === 'title') {
      sortOptions.title = direction;
    } else {
      sortOptions.createdAt = direction;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, totalTasks] = await Promise.all([
      Task.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Task.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total: totalTasks,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalTasks / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const task = await Task.findOne({
      _id: id,
      owner: userId,
    });

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {
      title,
      description,
      status = 'todo',
      priority = 'medium',
      dueDate,
      startDate,
      category = 'Work',
      tags = [],
    } = req.body;

    const completedAt = status === 'completed' ? new Date() : undefined;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: new Date(dueDate),
      startDate: startDate ? new Date(startDate) : undefined,
      category,
      tags,
      owner: userId,
      completedAt,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const updates = { ...req.body };

    const task = await Task.findOne({ _id: id, owner: userId });
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
      return;
    }

    if (updates.status) {
      if (updates.status === 'completed' && task.status !== 'completed') {
        task.completedAt = new Date();
      } else if (updates.status !== 'completed') {
        task.completedAt = undefined;
      }
      task.status = updates.status;
    }

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.dueDate !== undefined) task.dueDate = new Date(updates.dueDate);
    if (updates.startDate !== undefined) {
      task.startDate = updates.startDate ? new Date(updates.startDate) : undefined;
    }
    if (updates.category !== undefined) task.category = updates.category;
    if (updates.tags !== undefined) task.tags = updates.tags;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    const task = await Task.findOne({ _id: id, owner: userId });
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
      return;
    }

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date();
    } else {
      task.completedAt = undefined;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task status updated.',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const task = await Task.findOneAndDelete({ _id: id, owner: userId });
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or access denied.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
