import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';
import dashboardRoutes from './dashboardRoutes';
import categoryRoutes from './categoryRoutes';
import mongoose from 'mongoose';

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

// Mount sub-routers (database check is applied per route after auth and validation)
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/categories', categoryRoutes);

export default router;
