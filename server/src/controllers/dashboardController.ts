import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.userId);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      totalTasks,
      completedTasks,
      todoTasks,
      inProgressTasks,
      overdueTasks,
      dueTodayTasksCount,
      upcomingDeadlines,
      recentTasks,
      dueTodayTasks,
    ] = await Promise.all([
      Task.countDocuments({ owner: userId }),
      Task.countDocuments({ owner: userId, status: 'completed' }),
      Task.countDocuments({ owner: userId, status: 'todo' }),
      Task.countDocuments({ owner: userId, status: 'in_progress' }),
      Task.countDocuments({
        owner: userId,
        dueDate: { $lt: startOfToday },
        status: { $ne: 'completed' },
      }),
      Task.countDocuments({
        owner: userId,
        dueDate: { $gte: startOfToday, $lte: endOfToday },
        status: { $ne: 'completed' },
      }),
      Task.find({
        owner: userId,
        status: { $ne: 'completed' },
        dueDate: { $gte: startOfToday },
      })
        .sort({ dueDate: 1 })
        .limit(5)
        .lean(),
      Task.find({ owner: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean(),
      Task.find({
        owner: userId,
        dueDate: { $gte: startOfToday, $lte: endOfToday },
      })
        .sort({ priority: -1 })
        .limit(5)
        .lean(),
    ]);

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const statusDistribution = [
      { name: 'To Do', value: todoTasks, key: 'todo', color: '#94a3b8' },
      { name: 'In Progress', value: inProgressTasks, key: 'in_progress', color: '#6366f1' },
      { name: 'Completed', value: completedTasks, key: 'completed', color: '#10b981' },
    ];

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total: totalTasks,
          completed: completedTasks,
          todo: todoTasks,
          inProgress: inProgressTasks,
          overdue: overdueTasks,
          dueToday: dueTodayTasksCount,
          completionRate,
        },
        statusDistribution,
        upcomingDeadlines,
        recentTasks,
        dueTodayTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyProductivity = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.userId);

    // Build the past 7 days array
    const days: { dateStr: string; label: string; count: number; createdCount: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const [completedCount, createdCount] = await Promise.all([
        Task.countDocuments({
          owner: userId,
          completedAt: { $gte: startOfDay, $lte: endOfDay },
        }),
        Task.countDocuments({
          owner: userId,
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        }),
      ]);

      days.push({
        dateStr: startOfDay.toISOString().split('T')[0],
        label: dayNames[startOfDay.getDay()],
        count: completedCount,
        createdCount,
      });
    }

    res.status(200).json({
      success: true,
      data: days,
    });
  } catch (error) {
    next(error);
  }
};
