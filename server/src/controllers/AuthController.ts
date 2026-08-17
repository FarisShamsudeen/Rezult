import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { IAuthService } from '../interfaces/services';
import { sendResponse } from '../utils/responseHandler';
import {
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
  loginSchema,
  googleAuthSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validations/auth.validation';
import { StatusCode, OtpPurpose } from '../enums';

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
      maxAge: parseInt(process.env.COOKIE_MAX_AGE as string, 10)
    });
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await this.#authService.register(data.role, data);
      sendResponse(res, StatusCode.CREATED, true, result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = verifyOTPSchema.parse(req.body);
      const result = await this.#authService.verifyOTP(data.role, (data.email as string), (data.otp as string), (data.purpose as unknown as OtpPurpose));

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  resendOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = resendOTPSchema.parse(req.body);
      const result = await this.#authService.resendOTP(data.role, (data.email as string), data.purpose);
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.#authService.login(data.role, (data.email as string), (data.password as string));

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = googleAuthSchema.parse(req.body);
      const result = await this.#authService.googleAuth(data.role, data.credential);

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      const result = await this.#authService.forgotPassword(data.role, (data.email as string));
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = resetPasswordSchema.parse(req.body);
      const result = await this.#authService.resetPassword(data.role, (data.email as string), data.newPassword);
      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error.issues.map(e => e.message).join(', '));
      } else {
        sendResponse(res, StatusCode.BAD_REQUEST, false, undefined, error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      const result = await this.#authService.refreshAccessToken(token);

      if (result.refreshToken) {
        this.#setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }

      sendResponse(res, StatusCode.OK, true, result);
    } catch (error: unknown) {
      sendResponse(res, StatusCode.UNAUTHORIZED, false, undefined, error instanceof Error ? error.message : 'Unknown error');
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

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, StatusCode.OK, true, { user: (req as any).user });
  }
}

