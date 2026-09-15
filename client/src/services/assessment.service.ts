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

export const assessmentService = {
  createAssessment: async (data: CreateAssessmentDTO) => {
    const response = await api.post('/assessments', data);
    return response.data;
  },
};