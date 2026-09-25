import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEventSpeaker {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  bio?: string;
}

export interface IEventAgenda {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface IEventFAQ {
  question: string;
  answer: string;
}

export interface IEvent extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  gallery?: string[];
  category: 'Hackathon' | 'Workshop' | 'Speaker Session' | 'Competition' | 'Bootcamp' | 'Networking';
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  capacity?: number;
  speakers?: IEventSpeaker[];
  agenda?: IEventAgenda[];
  faqs?: IEventFAQ[];
  status: 'upcoming' | 'registration_open' | 'registration_closed' | 'completed' | 'draft';
  registrationLink?: string;
  featured: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const SpeakerSchema = new Schema<IEventSpeaker>({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
});

const AgendaSchema = new Schema<IEventAgenda>({
  time: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  speaker: { type: String, default: '' },
});

const FAQSchema = new Schema<IEventFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    category: {
      type: String,
      enum: ['Hackathon', 'Workshop', 'Speaker Session', 'Competition', 'Bootcamp', 'Networking'],
      required: true,
      index: true,
    },
    location: { type: String, required: true },
    isVirtual: { type: Boolean, default: false },
    virtualLink: { type: String },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    capacity: { type: Number, default: 200 },
    speakers: [SpeakerSchema],
    agenda: [AgendaSchema],
    faqs: [FAQSchema],
    status: {
      type: String,
      enum: ['upcoming', 'registration_open', 'registration_closed', 'completed', 'draft'],
      default: 'upcoming',
      index: true,
    },
    registrationLink: { type: String, default: '' },
    featured: { type: Boolean, default: false, index: true },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
