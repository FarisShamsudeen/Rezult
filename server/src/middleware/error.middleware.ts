import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/responseHandler';
import { StatusCode } from '../enums';

// Global error handler
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Error Handler Caught:', err);

  const statusCode = (err && typeof err === 'object' && 'statusCode' in err) ? (err as Record<string, unknown>).statusCode as number : StatusCode.INTERNAL_SERVER_ERROR;
  const message = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err) ? String((err as Record<string, unknown>).message) : 'Internal Server Error';

  sendResponse(res, statusCode, false, undefined, message);
};
