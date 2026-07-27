import { UserRole, OtpPurpose } from '../enums';

export interface IAuthResponse {
  token?: string;
  refreshToken?: string;
  user?: Record<string, unknown>;
  message?: string;
}

export interface IAuthService {
  register(role: UserRole, data: Record<string, unknown>): Promise<IAuthResponse>;
  verifyOTP(role: UserRole, email: string, otp: string, purpose: OtpPurpose): Promise<IAuthResponse>;
  login(role: UserRole, email: string, password: string): Promise<IAuthResponse>;
  googleAuth(role: UserRole, credential: string): Promise<IAuthResponse>;
  forgotPassword(role: UserRole, email: string): Promise<IAuthResponse>;
  resetPassword(role: UserRole, email: string, newPassword: string): Promise<IAuthResponse>;
  refreshAccessToken(refreshToken: string): Promise<IAuthResponse>;
}

export interface ICandidateService {
  getAllCandidates(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: unknown[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }>;
  createCandidateByAdmin(data: Record<string, unknown>): Promise<unknown>;
  toggleStatus(id: string): Promise<unknown>;
  getStats(): Promise<{ total: number; active: number; suspended: number }>;
}

export interface IRezulterService {
  registerRezulter(data: Record<string, unknown>): Promise<{ user: unknown; inviteToken?: string; message?: string }>;
  getAllRezulters(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: unknown[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }>;
  createRezulterByAdmin(data: Record<string, unknown>): Promise<unknown>;
  toggleStatus(id: string): Promise<unknown>;
  getStats(): Promise<{ total: number; active: number; suspended: number }>;
}
