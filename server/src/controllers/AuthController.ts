import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/AuthService';
import { sendResponse } from '../utils/responseHandler';
import { UserRole, OtpPurpose } from '../enums';

const roleSchema = z.enum([UserRole.CANDIDATE, UserRole.REZULTER]);

const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: roleSchema
});

const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  role: roleSchema,
  purpose: z.enum([OtpPurpose.REGISTRATION, OtpPurpose.FORGOT_PASSWORD])
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: roleSchema
});

const googleAuthSchema = z.object({
  credential: z.string(),
  role: roleSchema
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
  role: roleSchema
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
  role: roleSchema
});

export class AuthController {
  constructor(private authService: AuthService) {}

  private setRefreshCookie = (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await this.authService.register(data.role, data);
      sendResponse(res, 201, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, 400, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, 400, false, undefined, error.message);
      }
    }
  }

  verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = verifyOTPSchema.parse(req.body);
      const result: any = await this.authService.verifyOTP(data.role, data.email, data.otp, data.purpose);
      
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, 200, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, 400, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, 400, false, undefined, error.message);
      }
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = loginSchema.parse(req.body);
      const result: any = await this.authService.login(data.role, data.email, data.password);
      
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, 200, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, 400, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, 401, false, undefined, error.message);
      }
    }
  }

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = googleAuthSchema.parse(req.body);
      const result: any = await this.authService.googleAuth(data.role, data.credential);
      
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, 200, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, 400, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, 401, false, undefined, error.message);
      }
    }
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      const result = await this.authService.forgotPassword(data.role, data.email);
      sendResponse(res, 200, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, 400, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, 400, false, undefined, error.message);
      }
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = resetPasswordSchema.parse(req.body);
      const result = await this.authService.resetPassword(data.role, data.email, data.newPassword);
      sendResponse(res, 200, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, 400, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, 400, false, undefined, error.message);
      }
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      const result: any = await this.authService.refreshAccessToken(token);
      
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }

      sendResponse(res, 200, true, result);
    } catch (error: any) {
      sendResponse(res, 401, false, undefined, error.message);
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    sendResponse(res, 200, true, { message: 'Logged out successfully' });
  }
}

