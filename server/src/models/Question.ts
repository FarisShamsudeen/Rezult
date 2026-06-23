import { Schema, model, Document, Types } from 'mongoose';

export type QuestionType = 'mcq' | 'one_word' | 'descriptive';

export interface IQuestion extends Document {
  assessmentId: Types.ObjectId;
  questionType: QuestionType;
  questionText: string;
  maxMarks: number;
  displayOptions?: { optText: string; isAnswer: boolean; optMark: number }[];
  correctOneWordAnswer?: string;
  referenceAnswer?: string;
  ragContext?: string;
  similarityThreshold: number;
}

const QuestionSchema = new Schema<IQuestion>({
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  questionType: { type: String, enum: ['mcq', 'one_word', 'descriptive'], required: true },
  questionText: { type: String, required: true },
  maxMarks: { type: Number, required: true },
  displayOptions: [{
    optText: { type: String, required: true },
    isAnswer: { type: Boolean, required: true },
    optMark: { type: Number, default: 0 }
  }],
  correctOneWordAnswer: { type: String },
  referenceAnswer: { type: String },
  ragContext: { type: String },
  similarityThreshold: { type: Number, default: 70 }
}, { timestamps: true });

export const Question = model<IQuestion>('Question', QuestionSchema);
