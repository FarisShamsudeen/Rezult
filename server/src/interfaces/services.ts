import { UserRole, OtpPurpose } from '../enums';

export interface IAuthService {
  register(role: UserRole, data: any): Promise<any>;
  verifyOTP(role: UserRole, email: string, otp: string, purpose: OtpPurpose): Promise<any>;
  login(role: UserRole, email: string, password: string): Promise<any>;
  googleAuth(role: UserRole, credential: string): Promise<any>;
  forgotPassword(role: UserRole, email: string): Promise<any>;
  resetPassword(role: UserRole, email: string, newPassword: string): Promise<any>;
  refreshAccessToken(refreshToken: string): Promise<any>;
}

export interface ICandidateService {
  getAllCandidates(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<any>;
  createCandidateByAdmin(data: any): Promise<any>;
  toggleStatus(id: string): Promise<any>;
  getStats(): Promise<any>;
}

export interface IRezulterService {
  registerRezulter(data: any): Promise<any>;
  getAllRezulters(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<any>;
  createRezulterByAdmin(data: any): Promise<any>;
  toggleStatus(id: string): Promise<any>;
  getStats(): Promise<any>;
}
