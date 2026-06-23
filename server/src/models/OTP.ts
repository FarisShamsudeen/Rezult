import { Schema, model, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  role: 'candidate' | 'rezulter';
  purpose: 'registration' | 'forgot_password';
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  role: { type: String, required: true, enum: ['candidate', 'rezulter'] },
  purpose: { type: String, required: true, enum: ['registration', 'forgot_password'] },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 300 seconds = 5 minutes
});

export const OTP = model<IOTP>('OTP', OTPSchema);
