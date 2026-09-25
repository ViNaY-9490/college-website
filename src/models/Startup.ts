import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStartupFounder {
  name: string;
  role: string;
  avatar?: string;
  linkedin?: string;
}

export interface IStartup extends Document {
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  category: 'EdTech' | 'AgriTech' | 'HealthTech' | 'FinTech' | 'AI / DeepTech' | 'SaaS' | 'CleanTech' | 'Consumer';
  founders: IStartupFounder[];
  stage: 'Ideation' | 'Prototype' | 'Validation' | 'Early Traction' | 'Scaling';
  problem: string;
  solution: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  achievements?: string[];
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FounderSchema = new Schema<IStartupFounder>({
  name: { type: String, required: true },
  role: { type: String, default: 'Co-founder' },
  avatar: { type: String, default: '' },
  linkedin: { type: String, default: '' },
});

const StartupSchema = new Schema<IStartup>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, required: true },
    logo: { type: String, required: true },
    category: {
      type: String,
      enum: ['EdTech', 'AgriTech', 'HealthTech', 'FinTech', 'AI / DeepTech', 'SaaS', 'CleanTech', 'Consumer'],
      required: true,
      index: true,
    },
    founders: [FounderSchema],
    stage: {
      type: String,
      enum: ['Ideation', 'Prototype', 'Validation', 'Early Traction', 'Scaling'],
      default: 'Prototype',
      index: true,
    },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    website: { type: String, default: '' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    achievements: [{ type: String }],
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Startup: Model<IStartup> =
  mongoose.models.Startup || mongoose.model<IStartup>('Startup', StartupSchema);

export default Startup;
