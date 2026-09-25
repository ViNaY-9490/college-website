import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPartner extends Document {
  name: string;
  logo: string;
  website?: string;
  description?: string;
  category: 'Incubation & Accelerator' | 'Corporate & Industry' | 'Ecosystem Partner' | 'Academic' | 'Media & Community';
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    website: { type: String, default: '' },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Incubation & Accelerator', 'Corporate & Industry', 'Ecosystem Partner', 'Academic', 'Media & Community'],
      default: 'Ecosystem Partner',
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Partner: Model<IPartner> =
  mongoose.models.Partner || mongoose.model<IPartner>('Partner', PartnerSchema);

export default Partner;
