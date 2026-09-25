import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledgeItem extends Document {
  title: string;
  category: 'Leadership' | 'Recruitment' | 'Events' | 'Startups' | 'About & Vision' | 'Contact & Campus' | 'Custom' | 'General';
  content: string;
  source: string;
  tags: string[];
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeItemSchema = new Schema<IKnowledgeItem>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Leadership', 'Recruitment', 'Events', 'Startups', 'About & Vision', 'Contact & Campus', 'Custom', 'General'],
      default: 'General',
      index: true,
    },
    content: { type: String, required: true },
    source: { type: String, default: 'https://ecellvitb.in/' },
    tags: [{ type: String, trim: true }],
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

KnowledgeItemSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const KnowledgeItem: Model<IKnowledgeItem> =
  mongoose.models.KnowledgeItem ||
  mongoose.model<IKnowledgeItem>('KnowledgeItem', KnowledgeItemSchema);

export default KnowledgeItem;
