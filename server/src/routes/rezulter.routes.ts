import { Router } from 'express';
import { RezulterController } from '../controllers/RezulterController';
import { RezulterService } from '../services/RezulterService';
import { RezulterRepository } from '../repositories/RezulterRepository';
import { verifyToken as authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '../enums';

const router = Router();

// Composition Root
const rezulterRepository = new RezulterRepository();
const rezulterService = new RezulterService(rezulterRepository);
const rezulterController = new RezulterController(rezulterService);

// Route: POST /api/rezulters/register (self-registration)
router.post('/register', rezulterController.register);

// Super Admin protected routes
router.get('/', authMiddleware, requireRole(UserRole.SUPER_ADMIN), rezulterController.getAllRezulters);
router.post('/', authMiddleware, requireRole(UserRole.SUPER_ADMIN), rezulterController.createRezulter);
router.patch('/:id/toggle-status', authMiddleware, requireRole(UserRole.SUPER_ADMIN), rezulterController.toggleStatus);

export default router;
