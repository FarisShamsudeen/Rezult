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
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
  isQuestionsInOrder?: boolean;
  isImmediateResult?: boolean;
  isRestrictedOthers?: boolean;
  timezone?: string;
  questions: CreateQuestionDTO[];
}
