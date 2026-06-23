import { Schema, model, Document, Types } from 'mongoose';

export interface IAssessmentResult extends Document {
  assessmentId: Types.ObjectId;
  userId: Types.ObjectId;
  score: number;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  submittedAt: Date;
}

const AssessmentResultSchema = new Schema<IAssessmentResult>({
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['PASSED', 'FAILED', 'PENDING'], default: 'PENDING' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const AssessmentResult = model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);
