import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/responseHandler';
import { StatusCode, UserRole } from '../enums';
import { Candidate } from '../models/Candidate';
import { Rezulter } from '../models/Rezulter';

export interface AuthRequest extends Request {
  user?: Record<string, unknown> | jwt.JwtPayload | string;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, 'Access denied. No token provided.');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'fallback_access_secret';
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, 'Invalid or expired token.');
    return;
  }
};

export const requireActiveUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user || typeof req.user === 'string' || !('id' in req.user) || !('role' in req.user)) {
    sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, 'Access denied. Not authenticated.');
    return;
  }

  try {
    const { id, role } = req.user as { id: string, role: string };
    
    if (role === UserRole.CANDIDATE) {
      const candidate = await Candidate.findById(id);
      if (candidate && candidate.isActive === false) {
        sendResponse(res, StatusCode.FORBIDDEN, false, undefined, 'ACCOUNT_BLOCKED');
        return;
      }
    } else if (role === UserRole.REZULTER) {
      const rezulter = await Rezulter.findById(id);
      if (rezulter && rezulter.isActive === false) {
        sendResponse(res, StatusCode.FORBIDDEN, false, undefined, 'ACCOUNT_BLOCKED');
        return;
      }
    }
    
    next();
  } catch (error) {
    sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, undefined, 'Failed to verify user status.');
  }
};
