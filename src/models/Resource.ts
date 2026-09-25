import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'PDF' | 'Template' | 'Guide' | 'Deck' | 'Tool' | 'Cheatsheet';
  category: 'Pitch Deck' | 'Legal & Compliance' | 'Business Model' | 'Fundraising' | 'Tech Stack' | 'Marketing';
  fileUrl: string;
  downloadCount: number;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['PDF', 'Template', 'Guide', 'Deck', 'Tool', 'Cheatsheet'],
      default: 'Guide',
    },
    category: {
      type: String,
      enum: ['Pitch Deck', 'Legal & Compliance', 'Business Model', 'Fundraising', 'Tech Stack', 'Marketing'],
      default: 'Pitch Deck',
      index: true,
    },
    fileUrl: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;
