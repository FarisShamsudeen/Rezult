import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/AuthService';

const roleSchema = z.enum(['candidate', 'rezulter']);

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
  purpose: z.enum(['registration', 'forgot_password'])
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
  private setRefreshCookie = (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  register = async (req: Request, res: Response) => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data.role, data);
      console.log(result);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const data = verifyOTPSchema.parse(req.body);
      const result: any = await authService.verifyOTP(data.role, data.email, data.otp, data.purpose);
      console.log(result);
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const data = loginSchema.parse(req.body);
      const result: any = await authService.login(data.role, data.email, data.password);
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  googleAuth = async (req: Request, res: Response) => {
    try {
      const data = googleAuthSchema.parse(req.body);
      const result: any = await authService.googleAuth(data.role, data.credential);
      console.log(result);
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(data.role, data.email);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  resetPassword = async (req: Request, res: Response) => {
    try {
      const data = resetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(data.role, data.email, data.newPassword);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  refreshToken = async (req: Request, res: Response) => {
    try {
      const token = req.cookies.refreshToken;
      const result: any = await authService.refreshAccessToken(token);
      
      if (result.refreshToken) {
        this.setRefreshCookie(res, result.refreshToken);
        delete result.refreshToken;
      }

      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  }

  logout = async (req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ success: true, message: 'Logged out successfully' });
  }
}

export default new AuthController();
