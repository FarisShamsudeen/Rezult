import { Types } from 'mongoose';
import { ICandidate } from '../models/Candidate';
import { IRezulter } from '../models/Rezulter';

export interface ICandidateRepository {
  createCandidate(userData: Partial<ICandidate>): Promise<ICandidate>;
  joinWorkspace(candidateId: string | Types.ObjectId, rezulterId: string | Types.ObjectId): Promise<void>;
  findByEmail(email: string): Promise<ICandidate | null>;
  findById(id: string): Promise<ICandidate | null>;
  findAll(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: ICandidate[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }>;
  toggleStatus(id: string): Promise<ICandidate | null>;
  getStats(): Promise<{ total: number; active: number; suspended: number }>;
}

export interface IRezulterRepository {
  createRezulter(userData: Partial<IRezulter>): Promise<IRezulter>;
  findByEmail(email: string): Promise<IRezulter | null>;
  getAllRezulters(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: IRezulter[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }>;
  findWithActiveSessions(rezulterId: string): Promise<IRezulter | null>;
  findById(id: string): Promise<IRezulter | null>;
  toggleStatus(id: string): Promise<IRezulter | null>;
  getStats(): Promise<{ total: number; active: number; suspended: number }>;
}
