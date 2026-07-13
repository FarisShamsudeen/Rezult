import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import { CandidateService } from '../services/CandidateService';
import { CandidateRepository } from '../repositories/CandidateRepository';
import { verifyToken as authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '../enums';

const router = Router();

// Composition Root
const candidateRepository = new CandidateRepository();
const candidateService = new CandidateService(candidateRepository);
const candidateController = new CandidateController(candidateService);

// Super Admin protected routes
router.get('/', authMiddleware, requireRole(UserRole.SUPER_ADMIN), candidateController.getAllCandidates);
router.post('/', authMiddleware, requireRole(UserRole.SUPER_ADMIN), candidateController.createCandidate);
router.patch('/:id/toggle-status', authMiddleware, requireRole(UserRole.SUPER_ADMIN), candidateController.toggleStatus);

export default router;
