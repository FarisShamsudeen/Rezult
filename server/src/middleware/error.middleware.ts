import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/responseHandler';
import { StatusCode } from '../enums';

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error Handler Caught:', err);

  const statusCode = err.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  sendResponse(res, statusCode, false, undefined, message);
};
