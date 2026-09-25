import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  eventSlug: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  year: string;
  teamName?: string;
  remarks?: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled' | 'attended';
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    eventSlug: { type: String, required: true, index: true },
    eventTitle: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    teamName: { type: String, default: '' },
    remarks: { type: String, default: '' },
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'cancelled', 'attended'],
      default: 'confirmed',
    },
  },
  { timestamps: true }
);

// Prevent duplicate registration for the same event with same email
EventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export const EventRegistration: Model<IEventRegistration> =
  mongoose.models.EventRegistration ||
  mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);

export default EventRegistration;
