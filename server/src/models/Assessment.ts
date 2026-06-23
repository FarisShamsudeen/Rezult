import { Schema, model, Document, Types } from 'mongoose';

export interface IAssessment extends Document {
  title: string;
  description?: string;
  rezulterId: Types.ObjectId;
  inviteToken: string;
  durationInMinutes: number;
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
  isQuestionsInOrder: boolean;
  isImmediateResult: boolean;
  isRestrictedOthers: boolean;
  timezone: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
}

const AssessmentSchema = new Schema<IAssessment>({
  title: { type: String, required: true },
  description: { type: String },
  rezulterId: { type: Schema.Types.ObjectId, ref: 'Rezulter', required: true },
  inviteToken: { type: String, required: true, unique: true },
  durationInMinutes: { type: Number, required: true },
  scheduledStartTime: { type: Date },
  scheduledEndTime: { type: Date },
  isQuestionsInOrder: { type: Boolean, default: false },
  isImmediateResult: { type: Boolean, default: true },
  isRestrictedOthers: { type: Boolean, default: true },
  timezone: { type: String, default: 'UTC' },
  status: { type: String, enum: ['draft', 'scheduled', 'active', 'completed'], default: 'draft' }
}, { timestamps: true });

export const Assessment = model<IAssessment>('Assessment', AssessmentSchema);
