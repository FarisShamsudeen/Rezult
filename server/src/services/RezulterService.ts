import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import RezulterRepository from '../repositories/RezulterRepository';
import { IRezulter } from '../models/Rezulter';

export class RezulterService {
  /**
   * Handles registering a new Coordinator/Rezulter workspace.
   */
  async registerRezulter(data: any): Promise<{ user: Partial<IRezulter>, inviteToken: string }> {
    const existingUser = await RezulterRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    // Hash the master password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Create the Rezulter
    const newUser = await RezulterRepository.createRezulter({
      name: data.name,
      email: data.email,
      passwordHash,
      // They are a REZULTER, so they can have candidateIds etc.
      candidateIds: [],
    });

    // Generate a unique Secret Join Code (for Entrants/Candidates)
    // Could also store this in a Workspace model or directly on the User if there was a field for it.
    // We will just generate it here to demonstrate the service logic.
    const inviteToken = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Prepare safe user object (omit password)
    const safeUser = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return { user: safeUser, inviteToken };
  }

  /**
   * Fetch all rezulters (for Super Admin)
   */
  async getAllRezulters(): Promise<IRezulter[]> {
    return await RezulterRepository.findAll();
  }

  /**
   * Create a verified Rezulter directly (for Super Admin)
   */
  async createRezulterByAdmin(data: any): Promise<IRezulter> {
    const existingUser = await RezulterRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const newUser = await RezulterRepository.createRezulter({
      name: data.name,
      email: data.email,
      passwordHash,
      role: 'REZULTER',
      isEmailVerified: true, // Auto-verified since admin created
      authProvider: 'local',
      candidateIds: [],
    });

    return newUser;
  }

  async toggleStatus(id: string): Promise<IRezulter> {
    const updatedUser = await RezulterRepository.toggleStatus(id);
    if (!updatedUser) {
      throw new Error('Rezulter not found.');
    }
    return updatedUser;
  }
}

export default new RezulterService();
