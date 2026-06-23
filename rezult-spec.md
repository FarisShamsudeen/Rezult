# Rezult - Project Architecture and AI Context Specification

## 1. The Tech Stack
* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js, in TypeScript
* **Database:** MongoDB (using Mongoose for Object Data Modeling)
* **Authentication:** JSON Web Tokens (JWT) for Role-Based Access Control (RBAC)

## 2. Role Definitions (RBAC)
The platform operates on a single backend and frontend, conditionally rendering UI and guarding API routes based on three distinct roles:

* **Super Admin:** * Can view all activity across the platform.
    * Can perform high-level CRUD operations on any entity.
    * Can view global analytics.
    * Can create, modify, or remove subscription plans for Rezulters.
* **Rezulter:** * Can create, edit, and delete their own assessments.
    * Can trigger notifications and send assessment links to Candidates.
    * Can view and export the results/analytics of Candidates who took their assessments.
* **Candidate:** * Can receive notifications and links to pending assessments.
    * Can attend active assessments through the portal.
    * Can view their own historical results and scores.

## 3. Database Schema (MongoDB / Mongoose)
Here are the core collections and their relational structures using `ObjectId` references:


### 1. User & Subscription Models

By merging the `Rezulter` and `Users` collections, we handle authentication in one place and use conditional fields (like `candidate_ids` and `subscriptionId`) based on the user's role.

```typescript
// src/models/Subscription.ts
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


// src/models/User.ts
import { Schema, model, Document, Types } from 'mongoose';

export type UserRole = 'SUPER_ADMIN' | 'REZULTER' | 'USER'; // USER = Candidate

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string; // Storing hashed passwords, never plain text
  role: UserRole;
  dob?: Date;
  phoneNumber?: string;
  isActive: boolean;
  profileImage?: string;
  
  // Rezulter Specific Fields
  subscriptionId?: Types.ObjectId;
  candidateIds?: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['SUPER_ADMIN', 'REZULTER', 'USER'], default: 'USER' },
  dob: { type: Date },
  phoneNumber: { type: String },
  isActive: { type: Boolean, default: true },
  profileImage: { type: String },
  
  // Conditionally used if role === 'REZULTER'
  subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
  candidateIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);

```

### 2. Assessment & Question Models

This implements your RAG logic fields and handles the complex question structures.

```typescript
// src/models/Assessment.ts
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
  rezulterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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


// src/models/Question.ts
import { Schema, model, Document, Types } from 'mongoose';

export type QuestionType = 'mcq' | 'one_word' | 'descriptive';

export interface IQuestion extends Document {
  assessmentId: Types.ObjectId;
  questionType: QuestionType;
  questionText: string;
  maxMarks: number;
  
  // MCQ Specific
  displayOptions?: { optText: string; isAnswer: boolean; optMark: number }[];
  
  // AI/RAG Grading Specific
  correctOneWordAnswer?: string;
  referenceAnswer?: string; // Ideal descriptive answer
  ragContext?: string; // Text fed to the LLM for grading context
  similarityThreshold: number; // Default 70
}

const QuestionSchema = new Schema<IQuestion>({
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  questionType: { type: String, enum: ['mcq', 'one_word', 'descriptive'], required: true },
  questionText: { type: String, required: true },
  maxMarks: { type: Number, required: true },
  
  displayOptions: [{
    optText: { type: String, required: true },
    isAnswer: { type: Boolean, required: true },
    optMark: { type: Number, default: 0 }
  }],
  
  correctOneWordAnswer: { type: String },
  referenceAnswer: { type: String },
  ragContext: { type: String },
  similarityThreshold: { type: Number, default: 70 }
}, { timestamps: true });

export const Question = model<IQuestion>('Question', QuestionSchema);

```

### 3. Responses & Results Models

Notice the `RagEvaluation` sub-document in `UserResponses`. This creates a clean structure for saving your AI grading output.

```typescript
// src/models/UserResponse.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IUserResponse extends Document {
  assessmentId: Types.ObjectId;
  userId: Types.ObjectId;
  questionId: Types.ObjectId;
  questionType: 'mcq' | 'one_word' | 'descriptive';
  startedAt: Date;
  submittedAt?: Date;
  
  // The actual answers
  userMCQAnswer?: string[]; // Storing exact string values or IDs instead of booleans
  userOneWordAnswer?: string;
  userDescriptiveAnswer?: string;
  
  // AI Grading Output
  ragEvaluation?: {
    isEvaluated: boolean;
    earnedMarks: number;
    similarityScore: number;
    feedback: string;
    evaluatedAt: Date;
  };
}

const UserResponseSchema = new Schema<IUserResponse>({
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  questionType: { type: String, enum: ['mcq', 'one_word', 'descriptive'], required: true },
  
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date },
  
  userMCQAnswer: [{ type: String }],
  userOneWordAnswer: { type: String },
  userDescriptiveAnswer: { type: String },
  
  ragEvaluation: {
    isEvaluated: { type: Boolean, default: false },
    earnedMarks: { type: Number, default: 0 },
    similarityScore: { type: Number, default: 0 },
    feedback: { type: String },
    evaluatedAt: { type: Date }
  }
}, { timestamps: true }); // Automatically handles createdAt and updatedAt

export const UserResponse = model<IUserResponse>('UserResponse', UserResponseSchema);


// src/models/AssessmentResult.ts
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
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['PASSED', 'FAILED', 'PENDING'], default: 'PENDING' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const AssessmentResult = model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema);

```

### 4. Communication & Logging (Chat, Notifications, Reports)

```typescript
// src/models/ChatMessage.ts (Fixed spelling from ChatMassages)
import { Schema, model, Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  fromId: Types.ObjectId;
  toId: Types.ObjectId;
  message: string;
  msgConnectType: string;
  isEdited: boolean;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  fromId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  msgConnectType: { type: String, required: true }, // e.g., 'c-i', 's-i'
  isEdited: { type: Boolean, default: false }
}, { timestamps: true });

export const ChatMessage = model<IChatMessage>('ChatMessage', ChatMessageSchema);


// src/models/Notification.ts
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

```

## 4. Design System Tokens (Tailwind CSS)
The UI follows a minimalist, high-contrast dark theme utilizing glassmorphism. Use the following utility classes and hex codes for all component generation:

**Color Palette:**
* **Background:** `#0A0A0A` (Deep dark for the main app background)
* **Surface:** `#171717` (Slightly lighter dark for solid cards/modals)
* **Primary Accent:** `#FFFFFF` (High contrast white for primary buttons and active states)
* **Text Primary:** `#F3F4F6` (Gray-100 for maximum readability)
* **Text Secondary:** `#9CA3AF` (Gray-400 for subtext and placeholders)

**Border Radius Standards:**
* **Buttons & Inputs:** `rounded-lg` (8px)
* **Cards & Modals:** `rounded-2xl` (16px)

**Glassmorphism CSS Rules (Tailwind Utilities):**
Whenever creating layered elements, floating navbars, or modern cards over the background, strictly apply this combination:
* `backdrop-blur-md` (Provides the frosted glass effect)
* `bg-white/5` (Subtle transparent white fill)
* `border border-white/10` (Thin, faint border to define the edge)
* *Example Glass Card Class:* `className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6"`
