import { Candidate, ICandidate } from '../models/Candidate';
import { Rezulter } from '../models/Rezulter';
import { Types } from 'mongoose';
import { ICandidateRepository } from '../interfaces/repositories';
import { BaseRepository } from './BaseRepository';

export class CandidateRepository extends BaseRepository<ICandidate> implements ICandidateRepository {
  constructor() {
    super(Candidate);
  }

  /**
   * Joins a candidate to a Rezulter's workspace (rezulter)
   */
  async joinWorkspace(candidateId: string | Types.ObjectId, rezulterId: string | Types.ObjectId): Promise<void> {
    await Rezulter.findByIdAndUpdate(rezulterId, {
      $addToSet: { candidateIds: candidateId }
    });
  }
}

