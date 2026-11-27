import { Router } from 'express';
import { AssessmentController } from '../controllers/AssessmentController';
import { AssessmentService } from '../services/AssessmentService';
import { AssessmentRepository } from '../repositories/AssessmentRepository';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { verifyToken, ensureActiveUser } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '../enums';

const router = Router();

const assessmentRepository = new AssessmentRepository();
const questionRepository = new QuestionRepository();
const assessmentService = new AssessmentService(assessmentRepository, questionRepository);
const assessmentController = new AssessmentController(assessmentService);

// Secure all assessment routes with JWT verification and active user check
router.use(verifyToken);
router.use(ensureActiveUser);

// --- Candidate Routes ---
router.get('/candidate', requireRole(UserRole.CANDIDATE), (req, res) => 
  assessmentController.getCandidateAssessments(req, res)
);

router.get('/join/:token', requireRole(UserRole.CANDIDATE), (req, res) => 
  assessmentController.joinByToken(req, res)
);

router.get('/:id/take', requireRole(UserRole.CANDIDATE), (req, res) => 
  assessmentController.getForTaking(req, res)
);

router.post('/:id/submit', requireRole(UserRole.CANDIDATE), (req, res) => 
  assessmentController.submitAssessment(req, res)
);

router.get('/:id/result', requireRole(UserRole.CANDIDATE), (req, res) => 
  assessmentController.getResult(req, res)
);

// --- Rezulter / Admin Routes ---
router.post('/', requireRole([UserRole.REZULTER, UserRole.SUPER_ADMIN]), (req, res) => 
  assessmentController.create(req, res)
);

router.get('/', requireRole([UserRole.REZULTER, UserRole.SUPER_ADMIN]), (req, res) => 
  assessmentController.getAll(req, res)
);

router.get('/details/:id', requireRole([UserRole.REZULTER, UserRole.SUPER_ADMIN]), (req, res) => 
  assessmentController.getByIdForRezulter(req, res)
);

router.delete('/:id', requireRole([UserRole.REZULTER, UserRole.SUPER_ADMIN]), (req, res) => 
  assessmentController.deleteAssessment(req, res)
);

export default router;
