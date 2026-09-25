import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  slug: string;
  role: string;
  category: 'Faculty Advisors' | 'Executive Board' | 'Core Team' | 'Leads' | 'Coordinators' | 'Members';
  department: string;
  photo: string;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Faculty Advisors', 'Executive Board', 'Core Team', 'Leads', 'Coordinators', 'Members'],
      required: true,
      index: true,
    },
    department: { type: String, default: '' },
    photo: { type: String, required: true },
    bio: { type: String, default: '' },
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      twitter: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
