import { z } from 'zod';
import { UserRole, OtpPurpose } from '../enums';

const roleSchema = z.enum([UserRole.CANDIDATE, UserRole.REZULTER]);

export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: roleSchema
});

export const verifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  role: roleSchema,
  purpose: z.enum([OtpPurpose.REGISTRATION, OtpPurpose.FORGOT_PASSWORD])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: roleSchema
});

export const googleAuthSchema = z.object({
  credential: z.string(),
  role: roleSchema
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
  role: roleSchema
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
  role: roleSchema
});
