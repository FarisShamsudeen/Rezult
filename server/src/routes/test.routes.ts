import { Router, Response } from 'express';
import { verifyToken, AuthRequest, requireActiveUser } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { sendResponse } from '../utils/responseHandler';
import { UserRole, StatusCode } from '../enums';
import { ENDPOINTS } from '../constants/endpoints';

const router = Router();

// Test generic protected route
router.get(ENDPOINTS.TEST.PROTECTED, verifyToken, requireActiveUser, (req: AuthRequest, res: Response) => {
    sendResponse(res, StatusCode.OK, true, { 
        message: 'You have accessed a protected route!',
        user: req.user
    });
});

// Test RBAC specific route
router.get(ENDPOINTS.TEST.REZULTER_ONLY, verifyToken, requireActiveUser, requireRole(UserRole.REZULTER), (req: AuthRequest, res: Response) => {
    sendResponse(res, StatusCode.OK, true, { 
        message: 'You are an authorized Rezulter!'
    });
});

export default router;
