import { Request, Response } from 'express';
import { AssessmentService } from '../services/AssessmentService';
import { CreateAssessmentDTO } from '../dtos/assessment.dto';
import { SubmitAssessmentDTO } from '../dtos/submitAssessment.dto';
import { sendResponse } from '../utils/responseHandler';
import { StatusCode } from '../enums';

export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }

      const dto: CreateAssessmentDTO = req.body;
      const newAssessment = await this.assessmentService.createAssessment(user.id, dto);
      return sendResponse(res, StatusCode.CREATED, true, newAssessment);
    } catch (error: any) {
      console.error('Assessment creation error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to create assessment');
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = (req.query.search as string) || '';
      
      const result = await this.assessmentService.getAllAssessmentsByRezulter(user.id, { page, limit, search });
      return sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      console.error('Fetch assessments error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to fetch assessments');
    }
  }

  /**
   * Rezulter: View single assessment with questions, stats, and submissions
   */
  async getByIdForRezulter(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const id = req.params.id as string;

      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }

      const result = await this.assessmentService.getAssessmentByIdForRezulter(id, user.id);
      return sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      console.error('Fetch assessment details error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to load assessment details');
    }
  }

  /**
   * Rezulter: Delete assessment
   */
  async deleteAssessment(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const id = req.params.id as string;

      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }

      await this.assessmentService.deleteAssessment(id, user.id);
      return sendResponse(res, StatusCode.OK, true, null, 'Assessment deleted successfully');
    } catch (error: any) {
      console.error('Delete assessment error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to delete assessment');
    }
  }

  /**
   * Candidate: Get all available/assigned assessments
   */
  async getCandidateAssessments(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }

      const assessments = await this.assessmentService.getAvailableAssessmentsForCandidate(user.id);
      return sendResponse(res, StatusCode.OK, true, assessments);
    } catch (error: any) {
      console.error('Get candidate assessments error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to fetch candidate assessments');
    }
  }

  /**
   * Candidate: Join assessment by token
   */
  async joinByToken(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const token = req.params.token as string;
      if (!token) {
        return sendResponse(res, StatusCode.BAD_REQUEST, false, null, 'Token is required');
      }

      const assessment = await this.assessmentService.getAssessmentByInviteToken(token, user?.id);
      if (!assessment) {
        return sendResponse(res, StatusCode.NOT_FOUND, false, null, 'Assessment not found with this code');
      }

      return sendResponse(res, StatusCode.OK, true, assessment);
    } catch (error: any) {
      return sendResponse(res, StatusCode.BAD_REQUEST, false, null, error.message || 'Failed to join assessment');
    }
  }

  /**
   * Candidate: Load assessment for taking (strips correct answers)
   */
  async getForTaking(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const id = req.params.id as string;

      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }

      const data = await this.assessmentService.getAssessmentForTaking(id, user.id);
      return sendResponse(res, StatusCode.OK, true, data);
    } catch (error: any) {
      console.error('Get assessment for taking error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to load assessment');
    }
  }

  /**
   * Candidate: Submit answers
   */
  async submitAssessment(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const id = req.params.id as string;
      const submission: SubmitAssessmentDTO = req.body;

      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }

      const result = await this.assessmentService.submitAssessment(id, user.id, submission);
      return sendResponse(res, StatusCode.OK, true, result, 'Assessment submitted successfully');
    } catch (error: any) {
      console.error('Assessment submission error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to submit assessment');
    }
  }

  /**
   * Candidate: Get Result
   */
  async getResult(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const id = req.params.id as string;

      if (!user || !user.id) {
        return sendResponse(res, StatusCode.UNAUTHORIZED, false, null, 'Unauthorized');
      }

      const result = await this.assessmentService.getCandidateAssessmentResult(id, user.id);
      return sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      console.error('Fetch result error:', error);
      return sendResponse(res, StatusCode.INTERNAL_SERVER_ERROR, false, null, error.message || 'Failed to load assessment result');
    }
  }
}
