import { BaseRepository } from './BaseRepository';
import { IQuestionRepository } from '../interfaces/repositories';
import { IQuestion, Question } from '../models/Question';

export class QuestionRepository extends BaseRepository<IQuestion> implements IQuestionRepository {
  constructor() {
    super(Question);
  }

  async insertMany(questions: Partial<IQuestion>[]): Promise<IQuestion[]> {
    return await this.model.insertMany(questions) as unknown as IQuestion[];
  }
}
