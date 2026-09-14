import { BaseRepository } from './BaseRepository';
import { IAssessmentRepository } from '../interfaces/repositories';
import { IAssessment, Assessment } from '../models/Assessment';

export class AssessmentRepository extends BaseRepository<IAssessment> implements IAssessmentRepository {
  constructor() {
    super(Assessment);
  }
}
