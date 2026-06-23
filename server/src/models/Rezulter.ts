import { Schema, model, Document, Types } from 'mongoose';

export type RezulterRole = 'SUPER_ADMIN' | 'REZULTER';

export interface IRezulter extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: RezulterRole;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  authProvider: 'local' | 'google';
  profileImage?: string;
  subscriptionId?: Types.ObjectId;
  candidateIds?: Types.ObjectId[];
}

const RezulterSchema = new Schema<IRezulter>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['SUPER_ADMIN', 'REZULTER'], default: 'REZULTER' },
  phoneNumber: { type: String },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  profileImage: { type: String },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  candidateIds: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }]
}, { timestamps: true });

export const Rezulter = model<IRezulter>('Rezulter', RezulterSchema);
