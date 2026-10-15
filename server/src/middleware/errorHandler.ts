import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ENV } from '../config/env';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Unhandled API Error:', err.message || err);

  // Mongoose invalid ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    res.status(400).json({
      success: false,
      message: `Invalid ID format for resource: ${err.value}`,
    });
    return;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      success: false,
      message: `An entry with this ${field} already exists.`,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: messages[0] || 'Database validation error',
      errors: messages,
    });
    return;
  }

  // JSON syntax error in request body
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    res.status(400).json({
      success: false,
      message: 'Malformed JSON payload in request body.',
    });
    return;
  }

  // Default server error
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
