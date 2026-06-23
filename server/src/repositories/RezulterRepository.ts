import { Rezulter, IRezulter } from '../models/Rezulter';
import { Types } from 'mongoose';

export class RezulterRepository {
  /**
   * Creates a new Rezulter (Coordinator/rezulter)
   */
  async createRezulter(userData: Partial<IRezulter>): Promise<IRezulter> {
    const newRezulter = new Rezulter({
      ...userData,
      role: userData.role || 'REZULTER',
    });
    return await newRezulter.save();
  }

  /**
   * Finds any Rezulter by email
   */
  async findByEmail(email: string): Promise<IRezulter | null> {
    return await Rezulter.findOne({ email });
  }

  /**
   * Finds all Rezulters
   */
  async findAll(): Promise<IRezulter[]> {
    return await Rezulter.find({ role: 'REZULTER' }).sort({ createdAt: -1 });
  }

  /**
   * Finds a Rezulter with active sessions (example logic)
   */
  async findWithActiveSessions(rezulterId: string): Promise<IRezulter | null> {
    // For now, simple find. In real-world, might join with sessions collection
    return await Rezulter.findById(rezulterId);
  }

  /**
   * Finds a Rezulter by ID
   */
  async findById(id: string): Promise<IRezulter | null> {
    return await Rezulter.findById(id);
  }

  async toggleStatus(id: string): Promise<IRezulter | null> {
    const rezulter = await Rezulter.findById(id);
    if (!rezulter) return null;
    
    rezulter.isActive = !rezulter.isActive;
    return await rezulter.save();
  }
}

export default new RezulterRepository();
