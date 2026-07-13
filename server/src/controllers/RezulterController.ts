import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { RezulterService } from '../services/RezulterService';
import { sendResponse } from '../utils/responseHandler';

// Zod schema for registration validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export class RezulterController {
  constructor(private rezulterService: RezulterService) {}

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
      const rezulters = await this.rezulterService.getAllRezulters()
      sendResponse(res, 200, true, rezulters);
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
      const id = req.params.id as string;
      const updatedUser = await this.rezulterService.toggleStatus(id);
      sendResponse(res, 200, true, updatedUser);
    } catch (error: any) {
      next(error);
    }
  }
}
