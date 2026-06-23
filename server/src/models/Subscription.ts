import { Schema, model, Document } from 'mongoose';

export interface ISubscription extends Document {
  startedAt: Date;
  renewsAt: Date;
  isPaid: boolean;
  type: 'perAssessment' | 'perMonth';
}

const SubscriptionSchema = new Schema<ISubscription>({
  startedAt: { type: Date, default: Date.now },
  renewsAt: { type: Date, required: true },
  isPaid: { type: Boolean, default: false },
  type: { type: String, enum: ['perAssessment', 'perMonth'], required: true }
}, { timestamps: true });

export const Subscription = model<ISubscription>('Subscription', SubscriptionSchema);
