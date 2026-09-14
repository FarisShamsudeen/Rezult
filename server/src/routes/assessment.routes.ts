import { Router } from 'express';
import { AssessmentController } from '../controllers/AssessmentController';
import { AssessmentService } from '../services/AssessmentService';
import { AssessmentRepository } from '../repositories/AssessmentRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { verifyToken } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '../enums';

const router = Router();

const assessmentRepository = new AssessmentRepository();
const questionRepository = new QuestionRepository();
const assessmentService = new AssessmentService(assessmentRepository, questionRepository);
const assessmentController = new AssessmentController(assessmentService);

// Secure all assessment routes
router.use(verifyToken as any);
router.use(requireRole([UserRole.REZULTER, UserRole.SUPER_ADMIN]) as any);

router.post('/', (req, res) => assessmentController.create(req, res));

export default router;
