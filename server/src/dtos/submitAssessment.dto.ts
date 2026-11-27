export interface SubmitAnswerDTO {
  questionId: string;
  questionType: 'mcq' | 'one_word' | 'descriptive';
  userMCQAnswer?: string[];
  userOneWordAnswer?: string;
  userDescriptiveAnswer?: string;
}

export interface SubmitAssessmentDTO {
  answers: SubmitAnswerDTO[];
  timeSpentSeconds?: number;
}
