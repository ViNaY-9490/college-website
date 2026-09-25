import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJoinApplication extends Document {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  department: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'PG / Other';
  roleApplied: 'Lead' | 'Co-Lead' | 'Associate';
  primaryDomain: string;
  secondaryDomain?: string;
  whyJoin: string;
  priorExperience?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  weeklyCommitment?: string;
  roleSpecificAnswers?: Record<string, string>;
  status: 'pending' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected';
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JoinApplicationSchema = new Schema<IJoinApplication>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG / Other'],
      required: true,
    },
    roleApplied: {
      type: String,
      enum: ['Lead', 'Co-Lead', 'Associate'],
      default: 'Associate',
      index: true,
    },
    primaryDomain: {
      type: String,
      required: true,
      index: true,
    },
    secondaryDomain: { type: String, default: '' },
    whyJoin: { type: String, required: true },
    priorExperience: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    weeklyCommitment: { type: String, default: '5-10 hrs/week' },
    roleSpecificAnswers: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'interviewed', 'selected', 'rejected'],
      default: 'pending',
      index: true,
    },
    internalNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent same student applying multiple times with same email
JoinApplicationSchema.index({ email: 1 }, { unique: true });

export const JoinApplication: Model<IJoinApplication> =
  mongoose.models.JoinApplication ||
  mongoose.model<IJoinApplication>('JoinApplication', JoinApplicationSchema);

export default JoinApplication;
