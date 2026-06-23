import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/responseHandler';

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error Handler Caught:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  sendResponse(res, statusCode, false, undefined, message);
};
