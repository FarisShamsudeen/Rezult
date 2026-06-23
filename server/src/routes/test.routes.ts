import { Router, Response } from 'express';
import { verifyToken, AuthRequest } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { sendResponse } from '../utils/responseHandler';

const router = Router();

// Test generic protected route
router.get('/protected', verifyToken, (req: AuthRequest, res: Response) => {
    sendResponse(res, 200, true, { 
        message: 'You have accessed a protected route!',
        user: req.user
    });
});

// Test RBAC specific route
router.get('/rezulter-only', verifyToken, requireRole('rezulter'), (req: AuthRequest, res: Response) => {
    sendResponse(res, 200, true, { 
        message: 'You are an authorized Rezulter!'
    });
});

export default router;
