import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { IAuthService } from '../interfaces/services';
import { sendResponse } from '../utils/responseHandler';
import {
  registerSchema,
  verifyOTPSchema,
  loginSchema,
  googleAuthSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/auth.validation';
import { StatusCode } from '../enums';

export class AuthController {
  #authService: IAuthService;

  constructor(authService: IAuthService) {
    this.#authService = authService;
  }

  #setRefreshCookie = (res: Response, token: string) => {
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
      const result = await this.#authService.register(data.role, data);
      sendResponse(res, StatusCode.CREATED, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.message);
      }
    }
  }

  verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = verifyOTPSchema.parse(req.body);
      const result: any = await this.#authService.verifyOTP(data.role, data.email, data.otp, data.purpose);

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.message);
      }
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = loginSchema.parse(req.body);
      const result: any = await this.#authService.login(data.role, data.email, data.password);

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, error.message);
      }
    }
  }

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = googleAuthSchema.parse(req.body);
      const result: any = await this.#authService.googleAuth(data.role, data.credential);

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, error.message);
      }
    }
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      const result = await this.#authService.forgotPassword(data.role, data.email);
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.message);
      }
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = resetPasswordSchema.parse(req.body);
      const result = await this.#authService.resetPassword(data.role, data.email, data.newPassword);
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, (error as any).errors.map((e: any) => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.message);
      }
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      const result: any = await this.#authService.refreshAccessToken(token);

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }

      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: any) {
      sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, error.message);
    }
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    sendResponse(res, StatusCode.OK, true, { message: 'Logged out successfully' });
  }
}

