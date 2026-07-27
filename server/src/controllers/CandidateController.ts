import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ICandidateService } from '../interfaces/services';
import { sendResponse } from '../utils/responseHandler';
import { candidateSchema } from '../validations/candidate.validation';
import { StatusCode } from '../enums';

export class CandidateController {
  #candidateService: ICandidateService;

  constructor(candidateService: ICandidateService) {
    this.#candidateService = candidateService;
  }

  getAllCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const search = (req.query.search as string) || '';
      
      let isActive: boolean | undefined = undefined;
      if (req.query.isActive !== undefined) {
        isActive = req.query.isActive === 'true';
      }

      const sortField = (req.query.sortField as string) || undefined;
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || undefined;

      const result = await this.#candidateService.getAllCandidates({ page, limit, search, isActive, sortField, sortOrder });
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      next(error);
    }
  }

  createCandidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = candidateSchema.parse(req.body);
      const safeUser = await this.#candidateService.createCandidateByAdmin(validatedData);
      
      sendResponse(res, StatusCode.CREATED, true, safeUser);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        next(error);
      }
    }
  }

  toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = req.params.id as string;
      const updatedCandidate = await this.#candidateService.toggleStatus(candidateId);
      sendResponse(res, StatusCode.OK, true, updatedCandidate, 'Candidate status toggled successfully.');
    } catch (error: unknown) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.#candidateService.getStats();
      sendResponse(res, StatusCode.OK, true, stats, 'Candidate stats fetched successfully.');
    } catch (error: unknown) {
      next(error);
    }
  };
}
