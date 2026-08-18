import { Router } from 'express';
import { verifyToken, requireActiveUser } from '../middleware/auth.middleware';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { CandidateRepository } from '../repositories/CandidateRepository';
import { RezulterRepository } from '../repositories/RezulterRepository';
import { OtpRepository } from '../repositories/OtpRepository';
import { OtpService } from '../services/OtpService';
import { ENDPOINTS } from '../constants/endpoints';

import { authLimiter, otpLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

const candidateRepository = new CandidateRepository();
const rezulterRepository = new RezulterRepository();
const otpRepository = new OtpRepository();
const otpService = new OtpService(otpRepository);
const authService = new AuthService(candidateRepository, rezulterRepository, otpService);
const authController = new AuthController(authService);

router.post(ENDPOINTS.AUTH.SIGNUP, authLimiter, authController.register);
router.post(ENDPOINTS.AUTH.VERIFY_OTP, otpLimiter, authController.verifyOTP);
router.post(ENDPOINTS.AUTH.RESEND_OTP, otpLimiter, authController.resendOTP);
router.post(ENDPOINTS.AUTH.LOGIN, authLimiter, authController.login);
router.post(ENDPOINTS.AUTH.GOOGLE, authLimiter, authController.googleAuth);
router.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, authLimiter, authController.forgotPassword);
router.post(ENDPOINTS.AUTH.RESET_PASSWORD, authLimiter, authController.resetPassword);
router.post(ENDPOINTS.AUTH.REFRESH_TOKEN, authController.refreshToken);
router.post(ENDPOINTS.AUTH.LOGOUT, authController.logout);
router.get(ENDPOINTS.AUTH.ME, verifyToken, requireActiveUser(authService), authController.getMe);

export default router;
