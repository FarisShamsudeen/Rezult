import { api } from './api';

export interface CreateQuestionDTO {
  questionType: 'mcq' | 'one_word' | 'descriptive';
  questionText: string;
  maxMarks: number;
  displayOptions?: {
    optText: string;
    isAnswer: boolean;
    optMark?: number;
  }[];
  correctOneWordAnswer?: string;
  referenceAnswer?: string;
  ragContext?: string;
  similarityThreshold?: number;
}

export interface CreateAssessmentDTO {
  title: string;
  description?: string;
  durationInMinutes: number;
  passingThreshold?: number;
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
  isQuestionsInOrder?: boolean;
  isImmediateResult?: boolean;
  isRestrictedOthers?: boolean;
  lockdownBrowser?: boolean;
  timezone?: string;
  questions: CreateQuestionDTO[];
}

export interface CandidateAssessmentItem {
  _id: string;
  title: string;
  description?: string;
  durationInMinutes: number;
  inviteToken: string;
  rezulter: string;
  status: string;
  hasAttempted: boolean;
  score: number | null;
  resultStatus: 'PASSED' | 'FAILED' | 'PENDING' | null;
  submittedAt: string | null;
  createdAt: string;
}

export interface QuestionForTaking {
  _id: string;
  questionType: 'mcq' | 'one_word' | 'descriptive';
  questionText: string;
  maxMarks: number;
  displayOptions?: {
    _id: string;
    optText: string;
  }[];
}

export interface AssessmentForTakingResponse {
  alreadySubmitted: boolean;
  assessment: {
    _id: string;
    title: string;
    description?: string;
    durationInMinutes: number;
    isQuestionsInOrder: boolean;
    isImmediateResult: boolean;
  };
  questions: QuestionForTaking[];
  result?: any;
}

export interface SubmitAnswerPayload {
  questionId: string;
  questionType: 'mcq' | 'one_word' | 'descriptive';
  userMCQAnswer?: string[];
  userOneWordAnswer?: string;
  userDescriptiveAnswer?: string;
}

export interface SubmitAssessmentPayload {
  answers: SubmitAnswerPayload[];
  timeSpentSeconds?: number;
}

export interface AssessmentResultBreakdown {
  assessmentTitle: string;
  durationInMinutes: number;
  isImmediateResult?: boolean;
  score: number | null;
  totalPossibleMarks: number | null;
  percentage: number | null;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  submittedAt: string;
  review: {
    questionId: string;
    questionText: string;
    questionType: string;
    maxMarks: number;
    earnedMarks: number;
    options?: {
      optText: string;
      isCorrect: boolean;
    }[];
    correctOneWordAnswer?: string;
    referenceAnswer?: string;
    userMCQAnswer?: string[];
    userOneWordAnswer?: string;
    userDescriptiveAnswer?: string;
    feedback?: string;
  }[];
}

export const assessmentService = {
  // Rezulter / Admin APIs
  createAssessment: async (data: CreateAssessmentDTO) => {
    const response = await api.post('/assessments', data);
    return response.data;
  },
  getAllAssessments: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/assessments', { params });
    return response.data;
  },
  getAssessmentDetailsForRezulter: async (id: string) => {
    const response = await api.get(`/assessments/details/${id}`);
    return response.data;
  },
  deleteAssessment: async (id: string) => {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  },

  // Candidate APIs
  getCandidateAssessments: async (): Promise<{ success: boolean; data: CandidateAssessmentItem[] }> => {
    const response = await api.get('/assessments/candidate');
    return response.data;
  },

  joinByToken: async (token: string) => {
    const response = await api.get(`/assessments/join/${token}`);
    return response.data;
  },

  getForTaking: async (id: string): Promise<{ success: boolean; data: AssessmentForTakingResponse }> => {
    const response = await api.get(`/assessments/${id}/take`);
    return response.data;
  },

  submitAssessment: async (id: string, payload: SubmitAssessmentPayload) => {
    const response = await api.post(`/assessments/${id}/submit`, payload);
    return response.data;
  },

  getResult: async (id: string): Promise<{ success: boolean; data: AssessmentResultBreakdown }> => {
    const response = await api.get(`/assessments/${id}/result`);
    return response.data;
  }
};
