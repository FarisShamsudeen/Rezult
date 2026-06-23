import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: string; // e.g., EXAM_STARTING, RESULT_RELEASED
  recipientType: 'CANDIDATE' | 'REZULTER' | 'SUPER_ADMIN';
  isActionRequired: boolean;
  relatedType?: string; // e.g., EXAM, CHAT
  relatedId?: Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  recipientType: { type: String, enum: ['CANDIDATE', 'REZULTER', 'SUPER_ADMIN'], required: true },
  isActionRequired: { type: Boolean, default: false },
  relatedType: { type: String },
  relatedId: { type: Schema.Types.ObjectId }
}, { timestamps: true });

export const Notification = model<INotification>('Notification', NotificationSchema);
