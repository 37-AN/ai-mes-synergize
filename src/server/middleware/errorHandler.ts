
import { Request, Response, NextFunction } from 'express';
import { DatabaseError } from '../utils/errors';

export const handleServerError = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof DatabaseError) {
    return res.status(503).json({
      error: 'Database Error',
      message: err.message
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
}; 
