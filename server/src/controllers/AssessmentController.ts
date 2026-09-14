import { Request, Response } from 'express';
import { AssessmentService } from '../services/AssessmentService';
import { CreateAssessmentDTO } from '../dtos/assessment.dto';
import { sendResponse } from '../utils/responseHandler';
import { StatusCode } from '../enums';

export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  async create(req: Request, res: Response) {
    try {
      // req.user is set by the auth middleware
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
}
