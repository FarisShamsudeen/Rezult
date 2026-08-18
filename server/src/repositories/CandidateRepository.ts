import { Candidate, ICandidate } from '../models/Candidate';
import { ICandidateRepository } from '../interfaces/repositories';
import { BaseRepository } from './BaseRepository';

export class CandidateRepository extends BaseRepository<ICandidate> implements ICandidateRepository {
  constructor() {
    super(Candidate);
  }
}

