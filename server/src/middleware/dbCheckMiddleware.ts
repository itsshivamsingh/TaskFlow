import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const requireDatabaseConnection = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
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
