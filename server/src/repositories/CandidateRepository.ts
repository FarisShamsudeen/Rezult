import { Candidate, ICandidate } from '../models/Candidate';
import { Rezulter } from '../models/Rezulter';
import { Types } from 'mongoose';
import { ICandidateRepository } from '../interfaces/repositories';

export class CandidateRepository implements ICandidateRepository {
  /**
   * Creates a new Candidate (Entrant)
   */
  async createCandidate(userData: Partial<ICandidate>): Promise<ICandidate> {
    const newCandidate = new Candidate(userData);
    return await newCandidate.save();
  }

  /**
   * Joins a candidate to a Rezulter's workspace (rezulter)
   */
  async joinWorkspace(candidateId: string | Types.ObjectId, rezulterId: string | Types.ObjectId): Promise<void> {
    await Rezulter.findByIdAndUpdate(rezulterId, {
      $addToSet: { candidateIds: candidateId }
    });
  }
  /**
   * Finds any Candidate by email
   */
  async findByEmail(email: string): Promise<ICandidate | null> {
    return await Candidate.findOne({ email });
  }

  /**
   * Finds a Candidate by ID
   */
  async findById(id: string): Promise<ICandidate | null> {
    return await Candidate.findById(id);
  }

  /**
   * Fetch all Candidates with pagination, search, sorting, and filtering
   */
  async findAll(options: { page: number; limit: number; search: string; isActive?: boolean; sortField?: string; sortOrder?: 'asc' | 'desc' }): Promise<{ data: ICandidate[]; pagination: any }> {
    const { page, limit, search, isActive, sortField = 'createdAt', sortOrder = 'desc' } = options;
    const query: any = {};
    
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
      Candidate.find(query).sort(sortParams).skip(skip).limit(limit),
      Candidate.countDocuments(query)
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
   * Toggle Candidate status
   */
  async toggleStatus(id: string): Promise<ICandidate | null> {
    const candidate = await Candidate.findById(id);
    if (!candidate) return null;
    
    candidate.isActive = !candidate.isActive;
    return await candidate.save();
  }

  /**
   * Get Candidate Statistics
   */
  async getStats() {
    const [total, active, suspended] = await Promise.all([
      Candidate.countDocuments(),
      Candidate.countDocuments({ isActive: true }),
      Candidate.countDocuments({ isActive: false })
    ]);
    return { total, active, suspended };
  }
}
