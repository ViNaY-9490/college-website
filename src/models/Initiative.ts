import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInitiative extends Document {
  title: string;
  slug: string;
  tag: string;
  shortDescription: string;
  description: string;
  iconName: string;
  coverImage?: string;
  highlights: string[];
  metrics?: {
    value: string;
    label: string;
  }[];
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InitiativeSchema = new Schema<IInitiative>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tag: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, default: 'Lightbulb' },
    coverImage: { type: String, default: '' },
    highlights: [{ type: String }],
    metrics: [
      {
        value: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Initiative: Model<IInitiative> =
  mongoose.models.Initiative || mongoose.model<IInitiative>('Initiative', InitiativeSchema);

export default Initiative;
