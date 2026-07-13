import { Schema, model, Document } from 'mongoose';
import { UserRole, OtpPurpose } from '../enums';

export interface IOTP extends Document {
  email: string;
  otp: string;
  role: UserRole.CANDIDATE | UserRole.REZULTER;
  purpose: OtpPurpose;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  role: { type: String, required: true, enum: [UserRole.CANDIDATE, UserRole.REZULTER] },
  purpose: { type: String, required: true, enum: Object.values(OtpPurpose) },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 300 seconds = 5 minutes
});

export const OTP = model<IOTP>('OTP', OTPSchema);
