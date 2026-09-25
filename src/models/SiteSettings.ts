import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteSettings extends Document {
  organizationName: string;
  tagline: string;
  mission: string;
  vision: string;
  motto: {
    innovate: string;
    create: string;
    lead: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    locationMapUrl: string;
  };
  socialLinks: {
    linkedin: string;
    instagram: string;
    youtube: string;
    twitter: string;
    github: string;
  };
  stats: {
    activeMembers: string;
    eventsHosted: string;
    startupsSupported: string;
    mentorsConnected: string;
  };
  seoDefaults: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    organizationName: { type: String, default: 'E-Cell VITB' },
    tagline: {
      type: String,
      default: 'Entrepreneurship Cell of Vishnu Institute of Technology',
    },
    mission: {
      type: String,
      default:
        'To empower students with entrepreneurial mindsets, technical acumen, and startup mentorship to build impactful ventures.',
    },
    vision: {
      type: String,
      default:
        'To build a thriving entrepreneurial ecosystem where students innovate, collaborate, and transform ideas into impactful startups.',
    },
    motto: {
      innovate: {
        type: String,
        default: 'Think beyond boundaries and develop groundbreaking ideas.',
      },
      create: {
        type: String,
        default: 'Transform ideas into real-world solutions with creativity and technology.',
      },
      lead: {
        type: String,
        default: 'Inspire change, take initiative, and drive the future of entrepreneurship.',
      },
    },
    announcementBar: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: 'Innovate – Create – Lead: Registrations open for upcoming Flagship Hackathon & Startup Bootcamp!',
      },
      linkText: { type: String, default: 'Explore Events' },
      linkUrl: { type: String, default: '/events' },
    },
    contact: {
      email: { type: String, default: 'ecell@vishnu.edu.in' },
      phone: { type: String, default: '+91 8816 251333' },
      address: {
        type: String,
        default: 'Vishnu Institute of Technology, Vishnupur, Bhimavaram, Andhra Pradesh - 534202',
      },
      locationMapUrl: {
        type: String,
        default: 'https://maps.google.com/?q=Vishnu+Institute+of+Technology+Bhimavaram',
      },
    },
    socialLinks: {
      linkedin: { type: String, default: 'https://linkedin.com/company/ecell-vitb' },
      instagram: { type: String, default: 'https://instagram.com/ecell_vitb' },
      youtube: { type: String, default: 'https://youtube.com/@ecellvitb' },
      twitter: { type: String, default: 'https://twitter.com/ecell_vitb' },
      github: { type: String, default: 'https://github.com/ecell-vitb' },
    },
    stats: {
      activeMembers: { type: String, default: '150+' },
      eventsHosted: { type: String, default: '35+' },
      startupsSupported: { type: String, default: '12+' },
      mentorsConnected: { type: String, default: '40+' },
    },
    seoDefaults: {
      title: { type: String, default: 'E-Cell VITB | Entrepreneurship Cell of Vishnu Institute of Technology' },
      description: {
        type: String,
        default:
          'Student-driven entrepreneurship community at Vishnu Institute of Technology. Transform your ideas into successful startups.',
      },
      keywords: [
        { type: String, default: 'E-Cell VITB' },
        { type: String, default: 'Entrepreneurship Cell' },
        { type: String, default: 'Vishnu Institute of Technology' },
        { type: String, default: 'Bhimavaram' },
        { type: String, default: 'Startups' },
        { type: String, default: 'Hackathons' },
      ],
      ogImage: { type: String, default: '/brand/ecell-logo.png' },
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
