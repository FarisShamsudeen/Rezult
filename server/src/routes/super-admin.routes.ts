import { Router } from 'express';
import { SuperAdminController } from '../controllers/SuperAdminController';
import { SuperAdminService } from '../services/SuperAdminService';
import { verifyToken as authMiddleware, ensureActiveUser } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '../enums';
import { ENDPOINTS } from '../constants/endpoints';

const router = Router();

// Composition Root
const superAdminService = new SuperAdminService();
const superAdminController = new SuperAdminController(superAdminService);

// Super Admin protected routes
router.use(authMiddleware);
router.use(ensureActiveUser);
router.use(requireRole(UserRole.SUPER_ADMIN));

router.get(ENDPOINTS.SUPER_ADMIN.DASHBOARD, superAdminController.getDashboardStats);

export default router;
