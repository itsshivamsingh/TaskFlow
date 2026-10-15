import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const requireDatabaseConnection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Allow health check and root endpoints even when database is disconnected
  if (req.path === '/health' || req.path === '/' || req.path === '') {
    return next();
  }

  // If MongoDB is not connected (readyState 1 = connected)
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message:
        'MongoDB Atlas is not connected yet. Please update server/.env with your valid database username and password in MONGODB_URI.',
      databaseStatus: 'disconnected',
    });
    return;
  }

  next();
};
