import { Schema, model, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  fromId: Types.ObjectId;
  fromModel: 'Candidate' | 'Rezulter';
  toId: Types.ObjectId;
  toModel: 'Candidate' | 'Rezulter';
  message: string;
  msgConnectType: string;
  isEdited: boolean;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  fromId: { type: Schema.Types.ObjectId, refPath: 'fromModel', required: true },
  fromModel: { type: String, required: true, enum: ['Candidate', 'Rezulter'] },
  toId: { type: Schema.Types.ObjectId, refPath: 'toModel', required: true },
  toModel: { type: String, required: true, enum: ['Candidate', 'Rezulter'] },
  message: { type: String, required: true },
  msgConnectType: { type: String, required: true }, // e.g., 'c-i', 's-i'
  isEdited: { type: Boolean, default: false }
}, { timestamps: true });

export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema);
