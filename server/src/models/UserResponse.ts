import { Schema, model, Document, Types } from 'mongoose';

export interface IUserResponse extends Document {
  assessmentId: Types.ObjectId;
  userId: Types.ObjectId;
  questionId: Types.ObjectId;
  questionType: 'mcq' | 'one_word' | 'descriptive';
  startedAt: Date;
  submittedAt?: Date;
  userMCQAnswer?: string[];
  userOneWordAnswer?: string;
  userDescriptiveAnswer?: string;
  ragEvaluation?: {
    isEvaluated: boolean;
    earnedMarks: number;
    similarityScore: number;
    feedback: string;
    evaluatedAt: Date;
  };
}

const UserResponseSchema = new Schema<IUserResponse>({
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  questionType: { type: String, enum: ['mcq', 'one_word', 'descriptive'], required: true },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  userMCQAnswer: [{ type: String }],
  userOneWordAnswer: { type: String },
  userDescriptiveAnswer: { type: String },
  ragEvaluation: {
    isEvaluated: { type: Boolean, default: false },
    earnedMarks: { type: Number, default: 0 },
    similarityScore: { type: Number, default: 0 },
    feedback: { type: String },
    evaluatedAt: { type: Date }
  }
}, { timestamps: true });

export const UserResponse = model<IUserResponse>('UserResponse', UserResponseSchema);
