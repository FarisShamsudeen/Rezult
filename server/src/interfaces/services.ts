import { UserRole, OtpPurpose } from '../enums';
import { CandidateResponseDTO, RezulterResponseDTO } from '../dtos/user.dto';

export interface IAuthResponse {
  token?: string;
  refreshToken?: string;
  user?: CandidateResponseDTO | RezulterResponseDTO;
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
  getAllCandidates(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: CandidateResponseDTO[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }>;
  createCandidateByAdmin(data: Record<string, unknown>): Promise<{ user: CandidateResponseDTO }>;
  toggleStatus(id: string): Promise<CandidateResponseDTO>;
  getStats(): Promise<{ total: number; active: number; suspended: number }>;
}

export interface IRezulterService {
  registerRezulter(data: Record<string, unknown>): Promise<{ user: RezulterResponseDTO; inviteToken?: string; message?: string }>;
  getAllRezulters(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: RezulterResponseDTO[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }>;
  createRezulterByAdmin(data: Record<string, unknown>): Promise<{ user: RezulterResponseDTO }>;
  toggleStatus(id: string): Promise<RezulterResponseDTO>;
  getStats(): Promise<{ total: number; active: number; suspended: number }>;
}
