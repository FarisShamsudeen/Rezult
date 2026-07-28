import { Router } from 'express';
import { RezulterController } from '../controllers/RezulterController';
import { RezulterService } from '../services/RezulterService';
import { RezulterRepository } from '../repositories/RezulterRepository';
import { verifyToken as authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '../enums';
import { ENDPOINTS } from '../constants/endpoints';

const router = Router();

// Composition Root
const rezulterRepository = new RezulterRepository();
const rezulterService = new RezulterService(rezulterRepository);
const rezulterController = new RezulterController(rezulterService);

// Route: POST /api/rezulters/register (self-registration)
router.post(ENDPOINTS.REZULTERS.REGISTER, rezulterController.register);

// Super Admin protected routes
router.get(ENDPOINTS.REZULTERS.STATS, authMiddleware, requireRole(UserRole.SUPER_ADMIN), rezulterController.getStats);
router.get(ENDPOINTS.REZULTERS.ROOT, authMiddleware, requireRole(UserRole.SUPER_ADMIN), rezulterController.getAllRezulters);
router.post(ENDPOINTS.REZULTERS.ROOT, authMiddleware, requireRole(UserRole.SUPER_ADMIN), rezulterController.createRezulter);
router.patch(ENDPOINTS.REZULTERS.TOGGLE_STATUS, authMiddleware, requireRole(UserRole.SUPER_ADMIN), rezulterController.toggleStatus);

export default router;
