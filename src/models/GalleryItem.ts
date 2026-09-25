import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  image: string;
  category: string;
  subCategory?: string;
  description?: string;
  date?: Date;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      default: 'Events',
      trim: true,
      index: true,
    },
    subCategory: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    description: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

GalleryItemSchema.index({ category: 1, subCategory: 1 });

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export default GalleryItem;
