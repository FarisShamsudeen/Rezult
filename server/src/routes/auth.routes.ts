import { Router } from 'express';
import { verifyToken, requireActiveUser } from '../middleware/auth.middleware';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { CandidateRepository } from '../repositories/CandidateRepository';
import { RezulterRepository } from '../repositories/RezulterRepository';
import { ENDPOINTS } from '../constants/endpoints';

const router = Router();

// Composition Root
const candidateRepository = new CandidateRepository();
const rezulterRepository = new RezulterRepository();
const authService = new AuthService(candidateRepository, rezulterRepository);
const authController = new AuthController(authService);

router.post(ENDPOINTS.AUTH.SIGNUP, authController.register);
router.post(ENDPOINTS.AUTH.VERIFY_OTP, authController.verifyOTP);
router.post(ENDPOINTS.AUTH.LOGIN, authController.login);
router.post(ENDPOINTS.AUTH.GOOGLE, authController.googleAuth);
router.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, authController.forgotPassword);
router.post(ENDPOINTS.AUTH.RESET_PASSWORD, authController.resetPassword);
router.post(ENDPOINTS.AUTH.REFRESH_TOKEN, authController.refreshToken);
router.post(ENDPOINTS.AUTH.LOGOUT, authController.logout);
router.get(ENDPOINTS.AUTH.ME, verifyToken, requireActiveUser, authController.getMe);

export default router;
