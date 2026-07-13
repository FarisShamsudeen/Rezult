import { Schema, model, Document, Types } from 'mongoose';
import { UserRole, AuthProvider } from '../enums';

export type RezulterRole = UserRole.SUPER_ADMIN | UserRole.REZULTER;

export interface IRezulter extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: RezulterRole;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  authProvider: AuthProvider;
  profileImage?: string;
  subscriptionId?: Types.ObjectId;
  candidateIds?: Types.ObjectId[];
}

const RezulterSchema = new Schema<IRezulter>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  role: { type: String, enum: [UserRole.SUPER_ADMIN, UserRole.REZULTER], default: UserRole.REZULTER },
  phoneNumber: { type: String },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  authProvider: { type: String, enum: Object.values(AuthProvider), default: AuthProvider.LOCAL },
  profileImage: { type: String },
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  candidateIds: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }]
}, { timestamps: true });

export const Rezulter = model<IRezulter>('Rezulter', RezulterSchema);
