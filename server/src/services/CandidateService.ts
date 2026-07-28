import bcrypt from 'bcryptjs';
import { ICandidateRepository } from '../interfaces/repositories';
import { ICandidateService } from '../interfaces/services';
import { ICandidate } from '../models/Candidate';
import { AuthProvider } from '../enums';
import { mapToCandidateDTO } from '../dtos/user.dto';

export class CandidateService implements ICandidateService {
  #candidateRepository: ICandidateRepository;

  constructor(candidateRepository: ICandidateRepository) {
    this.#candidateRepository = candidateRepository;
  }



  async getAllCandidates(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }) {
    const result = await this.#candidateRepository.findAll(options);
    return {
      data: result.data.map((candidate) => mapToCandidateDTO(candidate)),
      pagination: result.pagination
    };
  }

  async createCandidateByAdmin(data: Record<string, unknown>) {
    const existingUser = await this.#candidateRepository.findByEmail((data.email as string));
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash((data.password as string), salt);
    
    const newCandidate = await this.#candidateRepository.create({
      name: (data.name as string),
      email: (data.email as string),
      passwordHash,
      isEmailVerified: true, // Auto-verified by Admin
      authProvider: AuthProvider.LOCAL
    });
    
    return { user: mapToCandidateDTO(newCandidate) };
  }

  async toggleStatus(id: string) {
    const updatedUser = await this.#candidateRepository.toggleStatus(id);
    if (!updatedUser) {
      throw new Error('Candidate not found.');
    }
    return mapToCandidateDTO(updatedUser);
  }

  async getStats() {
    return await this.#candidateRepository.getStats();
  }
}
