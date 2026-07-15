import { Rezulter, IRezulter, RezulterRole } from '../models/Rezulter';
import { UserRole } from '../enums';
import { Types } from 'mongoose';
import { IRezulterRepository } from '../interfaces/repositories';

export class RezulterRepository implements IRezulterRepository {
  /**
   * Creates a new Rezulter (Coordinator/rezulter)
   */
  async createRezulter(userData: Partial<IRezulter>): Promise<IRezulter> {
    const newRezulter = new Rezulter({
      ...userData,
      role: userData.role || UserRole.REZULTER,
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
   * Finds all Rezulters with pagination, search, sorting, and filtering
   */
  async getAllRezulters(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }) {
    const { page, limit, search, isActive, sortField = 'createdAt', sortOrder = 'desc' } = options;
    const query: any = { role: UserRole.REZULTER };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const skip = (page - 1) * limit;
    
    const sortParams: any = {};
    sortParams[sortField] = sortOrder === 'asc' ? 1 : -1;

    const [data, totalItems] = await Promise.all([
      Rezulter.find(query).sort(sortParams).skip(skip).limit(limit),
      Rezulter.countDocuments(query)
    ]);

    return {
      data,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit
      }
    };
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

  /**
   * Get Rezulter Statistics
   */
  async getStats() {
    const query = { role: UserRole.REZULTER as RezulterRole };
    const [total, active, suspended] = await Promise.all([
      Rezulter.countDocuments(query),
      Rezulter.countDocuments({ ...query, isActive: true }),
      Rezulter.countDocuments({ ...query, isActive: false })
    ]);
    return { total, active, suspended };
  }
}
