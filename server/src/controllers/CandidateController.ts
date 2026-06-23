import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import CandidateService from '../services/CandidateService';
import { sendResponse } from '../utils/responseHandler';

const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export class CandidateController {
  async getAllCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const candidates = await CandidateService.getAllCandidates();
      const safeCandidates = candidates.map(c => ({
        _id: c._id,
        name: c.name,
        email: c.email,
        isActive: c.isActive,
        createdAt: (c as any).createdAt
      }));
      sendResponse(res, 200, true, safeCandidates);
    } catch (error: any) {
      next(error);
    }
  }

  async createCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = candidateSchema.parse(req.body);
      const newUser = await CandidateService.createCandidateByAdmin(validatedData);
      
      const safeUser = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isActive: newUser.isActive,
        createdAt: (newUser as any).createdAt
      };

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

  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updatedUser = await CandidateService.toggleStatus(id);
      sendResponse(res, 200, true, updatedUser);
    } catch (error: any) {
      next(error);
    }
  }
}

export default new CandidateController();
