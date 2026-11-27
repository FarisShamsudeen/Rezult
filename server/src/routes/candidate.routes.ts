
import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import { CandidateService } from '../services/CandidateService';
import { CandidateRepository } from '../repositories/CandidateRepository';
import { verifyToken as authMiddleware, ensureActiveUser } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '../enums';
import { ENDPOINTS } from '../constants/endpoints';

const router = Router();

// Composition Root
const candidateRepository = new CandidateRepository();
const candidateService = new CandidateService(candidateRepository);
const candidateController = new CandidateController(candidateService);

// Super Admin protected routes
router.get(ENDPOINTS.CANDIDATES.STATS, authMiddleware, ensureActiveUser, requireRole(UserRole.SUPER_ADMIN), candidateController.getStats);
router.get(ENDPOINTS.CANDIDATES.ROOT, authMiddleware, ensureActiveUser, requireRole(UserRole.SUPER_ADMIN), candidateController.getAllCandidates);
router.post(ENDPOINTS.CANDIDATES.ROOT, authMiddleware, ensureActiveUser, requireRole(UserRole.SUPER_ADMIN), candidateController.createCandidate);
router.patch(ENDPOINTS.CANDIDATES.TOGGLE_STATUS, authMiddleware, ensureActiveUser, requireRole(UserRole.SUPER_ADMIN), candidateController.toggleStatus);

export default router;
