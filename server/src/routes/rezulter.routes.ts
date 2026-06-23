import { Router } from 'express';
import RezulterController from '../controllers/RezulterController';
import { verifyToken as authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

// Route: POST /api/rezulters/register (self-registration)
router.post('/register', RezulterController.register);

// Super Admin protected routes
router.get('/', authMiddleware, requireRole('super_admin'), RezulterController.getAllRezulters);
router.post('/', authMiddleware, requireRole('super_admin'), RezulterController.createRezulter);
router.patch('/:id/toggle-status', authMiddleware, requireRole('super_admin'), RezulterController.toggleStatus);

export default router;
