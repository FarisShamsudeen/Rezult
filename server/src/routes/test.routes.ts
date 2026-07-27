import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { sendResponse } from '../utils/responseHandler';
import { UserRole, StatusCode } from '../enums';

const router = Router();

// Test generic protected route
router.get('/protected', verifyToken, (req: AuthRequest, res: Response) => {
    sendResponse(res, StatusCode.OK, true, { 
        message: 'You have accessed a protected route!',
        user: req.user
    });
});

// Test RBAC specific route
router.get('/rezulter-only', verifyToken, requireRole(UserRole.REZULTER), (req: AuthRequest, res: Response) => {
    sendResponse(res, StatusCode.OK, true, { 
        message: 'You are an authorized Rezulter!'
    });
});

export default router;
