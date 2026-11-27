import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/responseHandler';
import { StatusCode } from '../enums';
import { IAuthService } from '../interfaces/services';
import { CandidateRepository } from '../repositories/CandidateRepository';
import { RezulterRepository } from '../repositories/RezulterRepository';
import { OtpRepository } from '../repositories/OtpRepository';
import { OtpService } from '../services/OtpService';
import { AuthService } from '../services/AuthService';

export interface AuthRequest extends Request {
  user?: Record<string, unknown> | jwt.JwtPayload | string;
}

const getJwtAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not configured');
  }
  return secret;
};

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, 'Access denied. No token provided.');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, getJwtAccessSecret());
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, 'Invalid or expired token.');
    return;
  }
};

export const requireActiveUser = (authService: Pick<IAuthService, 'checkUserActiveStatus'>) => async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user || typeof req.user === 'string' || !('id' in req.user) || !('role' in req.user)) {
    sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, 'Access denied. Not authenticated.');
    return;
  }

  try {
    const { id, role } = req.user as { id: string, role: string };
    
    const isActive = await authService.checkUserActiveStatus(id, role);
    if (!isActive) {
      sendResponse(res, StatusCode.FORBIDDEN, false, undefined, 'ACCOUNT_BLOCKED');
      return;
    }
    
    next();
  } catch (error) {
    sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, undefined, 'Failed to verify user status.');
  }
};

// Pre-wired active-user middleware for routes that do not construct their own AuthService
const defaultAuthService = new AuthService(
  new CandidateRepository(),
  new RezulterRepository(),
  new OtpService(new OtpRepository())
);

export const ensureActiveUser = requireActiveUser(defaultAuthService);
