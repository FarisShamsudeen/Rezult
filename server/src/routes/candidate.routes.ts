import { Router } from 'express';
import CandidateController from '../controllers/CandidateController';
import { verifyToken as authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Super Admin protected routes
router.get('/', authMiddleware, requireRole('super_admin'), CandidateController.getAllCandidates);
router.post('/', authMiddleware, requireRole('super_admin'), CandidateController.createCandidate);
router.patch('/:id/toggle-status', authMiddleware, requireRole('super_admin'), CandidateController.toggleStatus);

export default router;
