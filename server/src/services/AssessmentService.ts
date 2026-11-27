import { IAssessmentRepository, IQuestionRepository } from '../interfaces/repositories';
import { UserResponseRepository } from '../repositories/UserResponseRepository';
import { AssessmentResultRepository } from '../repositories/AssessmentResultRepository';
import { RezulterRepository } from '../repositories/RezulterRepository';
import { CreateAssessmentDTO } from '../dtos/assessment.dto';
import { SubmitAssessmentDTO } from '../dtos/submitAssessment.dto';
import { IAssessment } from '../models/Assessment';
import { IQuestion } from '../models/Question';
import { IUserResponse } from '../models/UserResponse';
import { IAssessmentResult } from '../models/AssessmentResult';
import { Types } from 'mongoose';
import crypto from 'crypto';

export class AssessmentService {
  constructor(
    private assessmentRepository: IAssessmentRepository,
    private questionRepository: IQuestionRepository,
    private userResponseRepository: UserResponseRepository = new UserResponseRepository(),
    private assessmentResultRepository: AssessmentResultRepository = new AssessmentResultRepository(),
    private rezulterRepository: RezulterRepository = new RezulterRepository()
  ) {}

  async createAssessment(rezulterId: string, data: CreateAssessmentDTO): Promise<IAssessment> {
    const inviteToken = crypto.randomBytes(4).toString('hex').toUpperCase();

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
      status: 'active', // default active for candidate availability
    };

    const newAssessment = await this.assessmentRepository.create(assessmentData);

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

  async getAllAssessmentsByRezulter(rezulterId: string, options: { page: number; limit: number; search: string }) {
    const { page, limit, search } = options;
    const query: any = { rezulterId: new Types.ObjectId(rezulterId) };
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const [assessments, totalItems] = await Promise.all([
      (this.assessmentRepository as any).model.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      (this.assessmentRepository as any).model.countDocuments(query)
    ]);

    // Gather attendee counts for each assessment
    const assessmentIds = assessments.map((a: any) => a._id);
    const resultsCount = await (this.assessmentResultRepository as any).model.aggregate([
      { $match: { assessmentId: { $in: assessmentIds } } },
      { $group: { _id: '$assessmentId', count: { $sum: 1 } } }
    ]);
    const attendeeCountMap = new Map(resultsCount.map((r: any) => [r._id.toString(), r.count]));

    const data = assessments.map((a: any) => ({
      _id: a._id,
      title: a.title,
      description: a.description,
      durationInMinutes: a.durationInMinutes,
      inviteToken: a.inviteToken,
      status: a.status,
      scheduledStartTime: a.scheduledStartTime,
      scheduledEndTime: a.scheduledEndTime,
      createdAt: a.createdAt,
      attendeesCount: attendeeCountMap.get(a._id.toString()) || 0
    }));

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

  async getAssessmentByIdForRezulter(assessmentId: string, rezulterId: string) {
    const assessment = await this.assessmentRepository.findById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    if (assessment.rezulterId.toString() !== rezulterId) {
      throw new Error('Unauthorized to view this assessment');
    }

    const questions = await this.questionRepository.findByAssessmentId(assessmentId);
    const results = await this.assessmentResultRepository.findByAssessment(assessmentId);

    const totalSubmissions = results.length;
    const passedSubmissions = results.filter(r => r.status === 'PASSED').length;
    const avgScore = totalSubmissions > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalSubmissions)
      : 0;

    return {
      assessment,
      questions,
      stats: {
        totalSubmissions,
        passedSubmissions,
        failedSubmissions: totalSubmissions - passedSubmissions,
        passRate: totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0,
        avgScore
      },
      results: results.map(r => ({
        _id: r._id,
        candidateName: (r.userId as any)?.name || 'Candidate',
        candidateEmail: (r.userId as any)?.email || '',
        score: r.score,
        status: r.status,
        submittedAt: r.submittedAt
      }))
    };
  }

  async deleteAssessment(assessmentId: string, rezulterId: string) {
    const assessment = await this.assessmentRepository.findById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    if (assessment.rezulterId.toString() !== rezulterId) {
      throw new Error('Unauthorized to delete this assessment');
    }

    // Delete questions, results, and assessment
    await (this.questionRepository as any).model.deleteMany({ assessmentId });
    await (this.assessmentResultRepository as any).model.deleteMany({ assessmentId });
    await (this.userResponseRepository as any).model.deleteMany({ assessmentId });
    await (this.assessmentRepository as any).model.findByIdAndDelete(assessmentId);

    return { success: true };
  }

  /**
   * For Candidates: List assessments visible to this candidate
   * (public active assessments, active assessments from linked rezulters, or already attempted assessments)
   */
  async getAvailableAssessmentsForCandidate(userId: string) {
    const candidateObjectId = new Types.ObjectId(userId);
    const [results, linkedRezulters] = await Promise.all([
      this.assessmentResultRepository.findByUser(userId),
      this.rezulterRepository.findByCandidateId(candidateObjectId)
    ]);

    const resultMap = new Map(results.map(r => [r.assessmentId?._id?.toString() || (r.assessmentId as any)?.toString(), r]));
    const linkedRezulterIds = linkedRezulters.map(r => r._id);
    const attemptedAssessmentIds = results
      .map(r => r.assessmentId?._id || r.assessmentId)
      .filter(Boolean);

    const activeAccessConditions: Record<string, unknown>[] = [{ isRestrictedOthers: false }];
    if (linkedRezulterIds.length > 0) {
      activeAccessConditions.push({ rezulterId: { $in: linkedRezulterIds } });
    }

    const visibilityConditions: Record<string, unknown>[] = [
      { status: 'active', $or: activeAccessConditions }
    ];
    if (attemptedAssessmentIds.length > 0) {
      visibilityConditions.push({ _id: { $in: attemptedAssessmentIds } });
    }

    const assessments = await (this.assessmentRepository as any).model.find({
      $or: visibilityConditions
    }).populate('rezulterId', 'name email').sort({ createdAt: -1 });

    return assessments.map((assessment: any) => {
      const result = resultMap.get(assessment._id.toString());
      const showResult = assessment.isImmediateResult ?? true;
      return {
        _id: assessment._id,
        title: assessment.title,
        description: assessment.description,
        durationInMinutes: assessment.durationInMinutes,
        inviteToken: assessment.inviteToken,
        rezulter: assessment.rezulterId ? assessment.rezulterId.name : 'Rezult Admin',
        status: assessment.status,
        hasAttempted: !!result,
        score: result && showResult ? result.score : null,
        resultStatus: result ? (showResult ? result.status : 'PENDING') : null,
        submittedAt: result ? result.submittedAt : null,
        createdAt: assessment.createdAt
      };
    });
  }

  /**
   * Join assessment by invite token and link candidate to the assessment's Rezulter
   */
  async getAssessmentByInviteToken(token: string, userId?: string) {
    const assessment = await (this.assessmentRepository as any).model.findOne({
      inviteToken: token.trim().toUpperCase()
    });
    if (!assessment) {
      return null;
    }

    if (assessment.status !== 'active') {
      throw new Error('This assessment is not currently active');
    }

    if (userId && assessment.rezulterId) {
      await this.rezulterRepository.addCandidateToWorkspace(
        assessment.rezulterId,
        new Types.ObjectId(userId)
      );
    }

    return assessment;
  }

  /**
   * For Candidates: Get assessment details & sanitized questions for taking the test
   * (Strips correct answer flags and correct values so student cannot inspect payload)
   */
  async getAssessmentForTaking(assessmentId: string, userId: string) {
    const assessment = await this.assessmentRepository.findById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // Check if already submitted
    const existingResult = await this.assessmentResultRepository.findByAssessmentAndUser(assessmentId, userId);
    if (existingResult) {
      return {
        alreadySubmitted: true,
        result: existingResult
      };
    }

    const rawQuestions = await this.questionRepository.findByAssessmentId(assessmentId);

    // Sanitize questions - DO NOT send `isAnswer`, `correctOneWordAnswer`, or `referenceAnswer`
    const sanitizedQuestions = rawQuestions.map(q => ({
      _id: q._id,
      questionType: q.questionType,
      questionText: q.questionText,
      maxMarks: q.maxMarks,
      displayOptions: q.displayOptions?.map(opt => ({
        _id: (opt as any)._id,
        optText: opt.optText
      }))
    }));

    return {
      alreadySubmitted: false,
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        description: assessment.description,
        durationInMinutes: assessment.durationInMinutes,
        isQuestionsInOrder: assessment.isQuestionsInOrder,
        isImmediateResult: assessment.isImmediateResult
      },
      questions: sanitizedQuestions
    };
  }

  /**
   * Candidate submits their assessment answers
   * Automatically evaluates MCQ & One-Word questions and calculates total score
   */
  async submitAssessment(assessmentId: string, userId: string, submission: SubmitAssessmentDTO) {
    const assessment = await this.assessmentRepository.findById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // Check if already submitted
    const existingResult = await this.assessmentResultRepository.findByAssessmentAndUser(assessmentId, userId);
    if (existingResult) {
      return existingResult;
    }

    const questions = await this.questionRepository.findByAssessmentId(assessmentId);
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    let totalScore = 0;
    let totalPossibleScore = 0;
    const userResponsesData: Partial<IUserResponse>[] = [];

    const now = new Date();

    for (const answer of submission.answers) {
      const q = questionMap.get(answer.questionId);
      if (!q) continue;

      totalPossibleScore += q.maxMarks;
      let earnedMarks = 0;

      if (q.questionType === 'mcq') {
        const correctOptions = (q.displayOptions || []).filter(opt => opt.isAnswer).map(opt => opt.optText.trim());
        const userSelected = (answer.userMCQAnswer || []).map(a => a.trim());

        // Check if user selections exactly match correct options
        const isCorrect = correctOptions.length === userSelected.length &&
          correctOptions.every(opt => userSelected.includes(opt));

        if (isCorrect) {
          earnedMarks = q.maxMarks;
        }
      } else if (q.questionType === 'one_word') {
        const correctAnswer = (q.correctOneWordAnswer || '').trim().toLowerCase();
        const userAns = (answer.userOneWordAnswer || '').trim().toLowerCase();

        if (correctAnswer && userAns && correctAnswer === userAns) {
          earnedMarks = q.maxMarks;
        }
      }

      totalScore += earnedMarks;

      userResponsesData.push({
        assessmentId: new Types.ObjectId(assessmentId),
        userId: new Types.ObjectId(userId),
        questionId: q._id as any,
        questionType: q.questionType,
        startedAt: now,
        submittedAt: now,
        userMCQAnswer: answer.userMCQAnswer || [],
        userOneWordAnswer: answer.userOneWordAnswer,
        userDescriptiveAnswer: answer.userDescriptiveAnswer,
        ragEvaluation: {
          isEvaluated: q.questionType !== 'descriptive',
          earnedMarks,
          similarityScore: earnedMarks > 0 ? 100 : 0,
          feedback: earnedMarks > 0 ? 'Correct answer' : 'Incorrect answer',
          evaluatedAt: now
        }
      });
    }

    // Save individual user responses
    await this.userResponseRepository.insertMany(userResponsesData);

    // Determine pass / fail status (default pass threshold 40% if not specified)
    const percentage = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;
    const status = percentage >= 40 ? 'PASSED' : 'FAILED';

    // Save AssessmentResult
    const resultData: Partial<IAssessmentResult> = {
      assessmentId: new Types.ObjectId(assessmentId),
      userId: new Types.ObjectId(userId),
      score: totalScore,
      status,
      submittedAt: now
    };

    const savedResult = await this.assessmentResultRepository.create(resultData);

    // Ensure the candidate is linked to the assessment's Rezulter workspace
    if (assessment.rezulterId) {
      await this.rezulterRepository.addCandidateToWorkspace(
        assessment.rezulterId,
        new Types.ObjectId(userId)
      );
    }

    const isImmediateResult = assessment.isImmediateResult ?? true;

    return {
      resultId: savedResult._id,
      isImmediateResult,
      score: isImmediateResult ? totalScore : null,
      totalPossibleMarks: isImmediateResult ? totalPossibleScore : null,
      percentage: isImmediateResult ? percentage : null,
      status: isImmediateResult ? status : 'PENDING',
      submittedAt: now
    };
  }

  /**
   * Get Candidate Assessment Result with detailed Question Breakdown
   */
  async getCandidateAssessmentResult(assessmentId: string, userId: string) {
    const result = await this.assessmentResultRepository.findByAssessmentAndUser(assessmentId, userId);
    if (!result) {
      throw new Error('Result not found for this assessment');
    }

    const assessment = await this.assessmentRepository.findById(assessmentId);
    const isImmediateResult = assessment?.isImmediateResult ?? true;

    if (!isImmediateResult) {
      return {
        assessmentTitle: assessment?.title || 'Assessment',
        durationInMinutes: assessment?.durationInMinutes,
        isImmediateResult: false,
        score: null,
        totalPossibleMarks: null,
        percentage: null,
        status: 'PENDING' as const,
        submittedAt: result.submittedAt,
        review: []
      };
    }

    const questions = await this.questionRepository.findByAssessmentId(assessmentId);
    const responses = await this.userResponseRepository.findByAssessmentAndUser(assessmentId, userId);
    const responseMap = new Map(responses.map(r => [r.questionId.toString(), r]));

    const totalPossibleMarks = questions.reduce((sum, q) => sum + (q.maxMarks || 0), 0);
    const percentage = totalPossibleMarks > 0 ? Math.round((result.score / totalPossibleMarks) * 100) : 0;

    const review = questions.map(q => {
      const resp = responseMap.get(q._id.toString());
      return {
        questionId: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        maxMarks: q.maxMarks,
        earnedMarks: resp?.ragEvaluation?.earnedMarks ?? 0,
        options: q.displayOptions?.map(opt => ({
          optText: opt.optText,
          isCorrect: opt.isAnswer
        })),
        correctOneWordAnswer: q.correctOneWordAnswer,
        referenceAnswer: q.referenceAnswer,
        userMCQAnswer: resp?.userMCQAnswer || [],
        userOneWordAnswer: resp?.userOneWordAnswer || '',
        userDescriptiveAnswer: resp?.userDescriptiveAnswer || '',
        feedback: resp?.ragEvaluation?.feedback || ''
      };
    });

    return {
      assessmentTitle: assessment?.title || 'Assessment',
      durationInMinutes: assessment?.durationInMinutes,
      isImmediateResult: true,
      score: result.score,
      totalPossibleMarks,
      percentage,
      status: result.status,
      submittedAt: result.submittedAt,
      review
    };
  }
}
