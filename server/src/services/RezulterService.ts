import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { RezulterRepository } from '../repositories/RezulterRepository';
import { IRezulter } from '../models/Rezulter';
import { UserRole, AuthProvider } from '../enums';

export class RezulterService {
  constructor(private rezulterRepository: RezulterRepository) {}

  private shapeRezulter(rezulter: IRezulter) {
    return {
      _id: rezulter._id,
      name: rezulter.name,
      email: rezulter.email,
      role: rezulter.role,
      isActive: rezulter.isActive,
      createdAt: (rezulter as any).createdAt,
    };
  }

  /**
   * Handles registering a new Coordinator/Rezulter workspace.
   */
  async registerRezulter(data: any) {
    const existingUser = await this.rezulterRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    // Hash the master password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Create the Rezulter
    const newUser = await this.rezulterRepository.createRezulter({
      name: data.name,
      email: data.email,
      passwordHash,
      role: UserRole.REZULTER,
      candidateIds: [],
    });

    // Generate a unique Secret Join Code (for Entrants/Candidates)
    const inviteToken = crypto.randomBytes(4).toString('hex').toUpperCase();

    return { user: this.shapeRezulter(newUser), inviteToken };
  }

  /**
   * Fetch all rezulters (for Super Admin)
   */
  async getAllRezulters(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }) {
    const result = await this.rezulterRepository.getAllRezulters(options);
    return {
      data: result.data.map((rezulter) => this.shapeRezulter(rezulter as IRezulter)),
      pagination: result.pagination
    };
  }

  /**
   * Create a verified Rezulter directly (for Super Admin)
   */
  async createRezulterByAdmin(data: any) {
    const existingUser = await this.rezulterRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await this.rezulterRepository.createRezulter({
      name: data.name,
      email: data.email,
      passwordHash,
      role: UserRole.REZULTER,
      isEmailVerified: true, // Auto-verified since admin created
      authProvider: AuthProvider.LOCAL,
      candidateIds: [],
    });

    return this.shapeRezulter(newUser);
  }

  async toggleStatus(id: string) {
    const updatedUser = await this.rezulterRepository.toggleStatus(id);
    if (!updatedUser) {
      throw new Error('Rezulter not found.');
    }
    return this.shapeRezulter(updatedUser);
  }

  async getStats() {
    return await this.rezulterRepository.getStats();
  }
}
