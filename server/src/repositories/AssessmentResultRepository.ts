import { BaseRepository } from './BaseRepository';
import { IAssessmentResult, AssessmentResult } from '../models/AssessmentResult';
import { Types } from 'mongoose';

export class AssessmentResultRepository extends BaseRepository<IAssessmentResult> {
  constructor() {
    super(AssessmentResult);
  }

  async findByAssessmentAndUser(assessmentId: string, userId: string): Promise<IAssessmentResult | null> {
    return await this.model.findOne({
      assessmentId: new Types.ObjectId(assessmentId),
      userId: new Types.ObjectId(userId)
    });
  }

  async findByUser(userId: string): Promise<IAssessmentResult[]> {
    return await this.model.find({
      userId: new Types.ObjectId(userId)
    }).populate('assessmentId').sort({ submittedAt: -1 });
  }

  async findByAssessment(assessmentId: string): Promise<IAssessmentResult[]> {
    return await this.model.find({
      assessmentId: new Types.ObjectId(assessmentId)
    }).populate('userId').sort({ score: -1 });
  }
}
