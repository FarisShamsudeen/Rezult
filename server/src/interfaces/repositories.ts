import { Types } from 'mongoose';
import { ICandidate } from '../models/Candidate';
import { IRezulter } from '../models/Rezulter';

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findByEmail(email: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findAll(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: T[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }>;
  toggleStatus(id: string): Promise<T | null>;
  getStats(): Promise<{ total: number; active: number; suspended: number }>;
}

export interface ICandidateRepository extends IBaseRepository<ICandidate> {
  joinWorkspace(candidateId: string | Types.ObjectId, rezulterId: string | Types.ObjectId): Promise<void>;
}

export interface IRezulterRepository extends IBaseRepository<IRezulter> {
  findWithActiveSessions(rezulterId: string): Promise<IRezulter | null>;
}
