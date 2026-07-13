import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { CandidateRepository } from '../repositories/CandidateRepository';
import { RezulterRepository } from '../repositories/RezulterRepository';

const router = Router();

// Composition Root
const candidateRepository = new CandidateRepository();
const rezulterRepository = new RezulterRepository();
const authService = new AuthService(candidateRepository, rezulterRepository);
const authController = new AuthController(authService);

router.post('/signup', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

export default router;
