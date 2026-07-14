import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CandidateService } from '../services/CandidateService';
import { sendResponse } from '../utils/responseHandler';

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export class CandidateController {
  constructor(private candidateService: CandidateService) {}

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

      const result = await this.candidateService.getAllCandidates({ page, limit, search, isActive, sortField, sortOrder });
      sendResponse(res, 200, true, result);
    } catch (error: any) {
      next(error);
    }
  }

  createCandidate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = candidateSchema.parse(req.body);
      const safeUser = await this.candidateService.createCandidateByAdmin(validatedData);
      
      sendResponse(res, 201, true, safeUser);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const zodError = error as any;
        sendResponse(res, 400, false, undefined, zodError.errors.map((e: any) => e.message).join(', '));
      } else {
        next(error);
      }
    }
  }

  toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const candidateId = req.params.id as string;
      const updatedCandidate = await this.candidateService.toggleStatus(candidateId);
      sendResponse(res, 200, true, updatedCandidate, 'Candidate status toggled successfully.');
    } catch (error: any) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.candidateService.getStats();
      sendResponse(res, 200, true, stats, 'Candidate stats fetched successfully.');
    } catch (error: any) {
      next(error);
    }
  };
}
