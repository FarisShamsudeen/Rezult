import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IRezulterRepository } from '../interfaces/repositories';
import { IRezulterService } from '../interfaces/services';
import { IRezulter } from '../models/Rezulter';
import { UserRole, AuthProvider } from '../enums';
import { mapToRezulterDTO } from '../dtos/user.dto';

export class RezulterService implements IRezulterService {
  #rezulterRepository: IRezulterRepository;

  constructor(rezulterRepository: IRezulterRepository) {
    this.#rezulterRepository = rezulterRepository;
  }



  /**
   * Handles registering a new Coordinator/Rezulter workspace.
   */
  async registerRezulter(data: Record<string, unknown>) {
    const existingUser = await this.#rezulterRepository.findByEmail((data.email as string));
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    // Hash the master password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash((data.password as string), salt);

    // Create the Rezulter
    const newUser = await this.#rezulterRepository.create({
      name: (data.name as string),
      email: (data.email as string),
      passwordHash,
      role: UserRole.REZULTER,
      candidateIds: [],
    });

    // Generate a unique Secret Join Code (for Entrants/Candidates)
    const inviteToken = crypto.randomBytes(4).toString('hex').toUpperCase();

    return { user: mapToRezulterDTO(newUser), inviteToken };
  }

  /**
   * Fetch all rezulters (for Super Admin)
   */
  async getAllRezulters(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }) {
    const result = await this.#rezulterRepository.findAll(options);
    return {
      data: result.data.map((rezulter) => mapToRezulterDTO(rezulter as IRezulter)),
      pagination: result.pagination
    };
  }

  /**
   * Create a verified Rezulter directly (for Super Admin)
   */
  async createRezulterByAdmin(data: Record<string, unknown>) {
    const existingUser = await this.#rezulterRepository.findByEmail((data.email as string));
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash((data.password as string), salt);

    const newUser = await this.#rezulterRepository.create({
      name: (data.name as string),
      email: (data.email as string),
      passwordHash,
      role: UserRole.REZULTER,
      isEmailVerified: true, // Auto-verified since admin created
      authProvider: AuthProvider.LOCAL,
      candidateIds: [],
    });

    return { user: mapToRezulterDTO(newUser) };
  }

  async toggleStatus(id: string) {
    const updatedUser = await this.#rezulterRepository.toggleStatus(id);
    if (!updatedUser) {
      throw new Error('Rezulter not found.');
    }
    return mapToRezulterDTO(updatedUser);
  }

  async getStats() {
    return await this.#rezulterRepository.getStats();
  }
}
