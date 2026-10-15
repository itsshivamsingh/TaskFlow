import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';
import dashboardRoutes from './dashboardRoutes';
import categoryRoutes from './categoryRoutes';
import mongoose from 'mongoose';
import { requireDatabaseConnection } from '../middleware/dbCheckMiddleware';

const router = Router();

// Health check endpoint (always responds even if DB is disconnected)
router.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  });
});

// Protect database routes from buffering hangs when database is offline
router.use('/auth', requireDatabaseConnection, authRoutes);
router.use('/users', requireDatabaseConnection, userRoutes);
router.use('/tasks', requireDatabaseConnection, taskRoutes);
router.use('/dashboard', requireDatabaseConnection, dashboardRoutes);
router.use('/categories', requireDatabaseConnection, categoryRoutes);

export default router;
