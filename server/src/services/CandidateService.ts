import bcrypt from 'bcryptjs';
import { ICandidateRepository } from '../interfaces/repositories';
import { ICandidateService } from '../interfaces/services';
import { ICandidate } from '../models/Candidate';
import { AuthProvider } from '../enums';

export class CandidateService implements ICandidateService {
  #candidateRepository: ICandidateRepository;

  constructor(candidateRepository: ICandidateRepository) {
    this.#candidateRepository = candidateRepository;
  }

  #shapeCandidate(candidate: ICandidate) {
    return {
      _id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      isActive: candidate.isActive,
      createdAt: (candidate as any).createdAt,
    };
  }

  async getAllCandidates(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }) {
    const result = await this.#candidateRepository.findAll(options);
    return {
      data: result.data.map((candidate) => this.#shapeCandidate(candidate)),
      pagination: result.pagination
    };
  }

  async createCandidateByAdmin(data: any) {
    const existingUser = await this.#candidateRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);
    
    const newCandidate = await this.#candidateRepository.createCandidate({
      name: data.name,
      email: data.email,
      passwordHash,
      isEmailVerified: true, // Auto-verified by Admin
      authProvider: AuthProvider.LOCAL
    });
    
    return this.#shapeCandidate(newCandidate);
  }

  async toggleStatus(id: string) {
    const updatedUser = await this.#candidateRepository.toggleStatus(id);
    if (!updatedUser) {
      throw new Error('Candidate not found.');
    }
    return this.#shapeCandidate(updatedUser);
  }

  async getStats() {
    return await this.#candidateRepository.getStats();
  }
}
