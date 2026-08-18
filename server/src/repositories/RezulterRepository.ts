import { Rezulter, IRezulter } from '../models/Rezulter';
import { UserRole } from '../enums';
import { Types } from 'mongoose';
import { IRezulterRepository } from '../interfaces/repositories';
import { BaseRepository } from './BaseRepository';

export class RezulterRepository extends BaseRepository<IRezulter> implements IRezulterRepository {
  constructor() {
    super(Rezulter);
  }

  /**
   * Creates a new Rezulter (Coordinator/rezulter)
   */
  async create(userData: Partial<IRezulter>): Promise<IRezulter> {
    return await super.create({
      ...userData,
      role: userData.role || UserRole.REZULTER,
    });
  }

  /**
   * Finds all Rezulters with pagination, search, sorting, and filtering
   */
  async findAll(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: IRezulter[]; pagination: { totalItems: number; totalPages: number; currentPage: number; pageSize: number } }> {
    return await super.findAll(options, { role: UserRole.REZULTER });
  }

  /**
   * Get Rezulter Statistics
   */
  async getStats() {
    return await super.getStats({ role: UserRole.REZULTER });
  }

  /**
   * Finds a Rezulter with active sessions (example logic)
   */
  async findWithActiveSessions(rezulterId: string): Promise<IRezulter | null> {
    // For now, simple find. In real-world, might join with sessions collection
    return await Rezulter.findById(rezulterId);
  }

  /**
   * Adds a candidate to a Rezulter's workspace
   */
  async addCandidateToWorkspace(rezulterId: string | Types.ObjectId, candidateId: string | Types.ObjectId): Promise<void> {
    await Rezulter.findByIdAndUpdate(rezulterId, {
      $addToSet: { candidateIds: candidateId }
    });
  }
}

