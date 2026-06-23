import { Candidate, ICandidate } from '../models/Candidate';
import { Rezulter } from '../models/Rezulter';
import { Types } from 'mongoose';

export class CandidateRepository {
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
   * Fetch all Candidates
   */
  async findAll(): Promise<ICandidate[]> {
    return await Candidate.find().sort({ createdAt: -1 });
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
}

export default new CandidateRepository();
