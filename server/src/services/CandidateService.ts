import bcrypt from 'bcryptjs';
import CandidateRepository from '../repositories/CandidateRepository';
import { ICandidate } from '../models/Candidate';

export class CandidateService {
  async getAllCandidates(): Promise<ICandidate[]> {
    return await CandidateRepository.findAll();
  }

  async createCandidateByAdmin(data: any): Promise<ICandidate> {
    const existingUser = await CandidateRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);
    
    // Add default dummy logic or actual candidate registration details
    return await CandidateRepository.createCandidate({
      name: data.name,
      email: data.email,
      passwordHash,
      isEmailVerified: true, // Auto-verified by Admin
      authProvider: 'local'
    });
  }

  async toggleStatus(id: string): Promise<ICandidate> {
    const updatedUser = await CandidateRepository.toggleStatus(id);
    if (!updatedUser) {
      throw new Error('Candidate not found.');
    }
    return updatedUser;
  }
}

export default new CandidateService();
