import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  category: 'General' | 'Collaboration' | 'Sponsorship' | 'Mentorship' | 'Press' | 'Student Query';
  subject: string;
  message: string;
  status: 'new' | 'in_review' | 'responded' | 'archived';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    organization: { type: String, default: '' },
    category: {
      type: String,
      enum: ['General', 'Collaboration', 'Sponsorship', 'Mentorship', 'Press', 'Student Query'],
      default: 'General',
      index: true,
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'in_review', 'responded', 'archived'],
      default: 'new',
      index: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ContactInquiry: Model<IContactInquiry> =
  mongoose.models.ContactInquiry ||
  mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);

export default ContactInquiry;
