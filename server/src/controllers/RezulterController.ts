import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { IRezulterService } from '../interfaces/services';
import { sendResponse } from '../utils/responseHandler';
import { registerSchema } from '../validations/rezulter.validation';

export class RezulterController {
  constructor(private rezulterService: IRezulterService) {}

  /**
   * Registers a new Rezulter/Coordinator
   */
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Validate incoming request body
      const validatedData = registerSchema.parse(req.body);

      // 2. Pass to Service (Business Logic)
      const { user, inviteToken } = await this.rezulterService.registerRezulter(validatedData);

      // 3. Return Predictable JSON Structure
      sendResponse(res, 201, true, {
        user,
        inviteToken
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const zodError = error as any;
        sendResponse(res, 400, false, undefined, zodError.errors.map((e: any) => e.message).join(', '));
      } else {
        // Pass to global error handler
        next(error);
      }
    }
  }

  /**
   * Fetch all rezulters (Admin only)
   */
  getAllRezulters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const result = await this.rezulterService.getAllRezulters({ page, limit, search, isActive, sortField, sortOrder });
      sendResponse(res, 200, true, result);
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Create a new rezulter (Admin only)
   */
  createRezulter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const safeUser = await this.rezulterService.createRezulterByAdmin(validatedData);
      
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

  /**
   * Toggle rezulter status (Admin only)
   */
  toggleStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rezulterId = req.params.id as string;
      const updatedRezulter = await this.rezulterService.toggleStatus(rezulterId);
      sendResponse(res, 200, true, updatedRezulter, 'Rezulter status toggled successfully.');
    } catch (error: any) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.rezulterService.getStats();
      sendResponse(res, 200, true, stats, 'Rezulter stats fetched successfully.');
    } catch (error: any) {
      next(error);
    }
  };
}
