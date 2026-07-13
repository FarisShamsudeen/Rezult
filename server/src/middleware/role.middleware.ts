import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { sendResponse } from '../utils/responseHandler';
import { UserRole } from '../enums';

export const requireRole = (requiredRoles: UserRole | UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      sendResponse(res, 401, false, undefined, 'Access denied. Not authenticated or missing role.');
      return;
    }

    const rolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRole = req.user.role.toLowerCase();
    
    // Check if the user's role (lowercase) matches any of the required roles (lowercase)
    const hasRole = rolesArray.some(role => role.toLowerCase() === userRole);

    if (!hasRole) {
      sendResponse(res, 403, false, undefined, 'Access denied. Insufficient permissions.');
      return;
    }

    next();
  };
};
