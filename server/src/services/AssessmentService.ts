import { IAssessmentRepository, IQuestionRepository } from '../interfaces/repositories';
import { CreateAssessmentDTO } from '../dtos/assessment.dto';
import { IAssessment } from '../models/Assessment';
import { IQuestion } from '../models/Question';
import { Types } from 'mongoose';
import crypto from 'crypto';

export class AssessmentService {
  constructor(
    private assessmentRepository: IAssessmentRepository,
    private questionRepository: IQuestionRepository
  ) {}

  async createAssessment(rezulterId: string, data: CreateAssessmentDTO): Promise<IAssessment> {
    // Generate a unique invite token
    const inviteToken = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Create the assessment
    const assessmentData: Partial<IAssessment> = {
      title: data.title,
      description: data.description,
      rezulterId: new Types.ObjectId(rezulterId) as any,
      inviteToken,
      durationInMinutes: data.durationInMinutes,
      scheduledStartTime: data.scheduledStartTime ? new Date(data.scheduledStartTime) : undefined,
      scheduledEndTime: data.scheduledEndTime ? new Date(data.scheduledEndTime) : undefined,
      isQuestionsInOrder: data.isQuestionsInOrder ?? false,
      isImmediateResult: data.isImmediateResult ?? true,
      isRestrictedOthers: data.isRestrictedOthers ?? true,
      timezone: data.timezone || 'UTC',
      status: 'draft',
    };

    const newAssessment = await this.assessmentRepository.create(assessmentData);

    // If there are questions, add them
    if (data.questions && data.questions.length > 0) {
      const questionsData: Partial<IQuestion>[] = data.questions.map(q => ({
        ...q,
        displayOptions: q.displayOptions?.map(opt => ({
          ...opt,
          optMark: opt.optMark ?? 0
        })),
        assessmentId: newAssessment._id as any,
      }));
      
      await this.questionRepository.insertMany(questionsData);
    }

    return newAssessment;
  }
}
