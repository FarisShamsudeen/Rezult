import { Schema, model, Document } from 'mongoose';

export interface ICandidate extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  authProvider: 'local' | 'google';
  profileImage?: string;
}

const CandidateSchema = new Schema<ICandidate>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  phoneNumber: { type: String },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  profileImage: { type: String }
}, { timestamps: true });

export const Candidate = model<ICandidate>('Candidate', CandidateSchema);
