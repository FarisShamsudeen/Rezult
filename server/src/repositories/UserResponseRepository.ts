import { BaseRepository } from './BaseRepository';
import { IUserResponse, UserResponse } from '../models/UserResponse';
import { Types } from 'mongoose';

export class UserResponseRepository extends BaseRepository<IUserResponse> {
  constructor() {
    super(UserResponse);
  }

  async insertMany(responses: Partial<IUserResponse>[]): Promise<IUserResponse[]> {
    return await this.model.insertMany(responses) as unknown as IUserResponse[];
  }

  async findByAssessmentAndUser(assessmentId: string, userId: string): Promise<IUserResponse[]> {
    return await this.model.find({
      assessmentId: new Types.ObjectId(assessmentId),
      userId: new Types.ObjectId(userId)
    });
  }

  async deleteByAssessmentAndUser(assessmentId: string, userId: string): Promise<void> {
    await this.model.deleteMany({
      assessmentId: new Types.ObjectId(assessmentId),
      userId: new Types.ObjectId(userId)
    });
  }
}
