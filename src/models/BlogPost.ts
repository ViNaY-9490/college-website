import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: IBlogAuthor;
  category: 'Founder Stories' | 'Ecosystem' | 'Tech Trends' | 'Workshops' | 'Guides' | 'Interviews';
  tags: string[];
  readTime: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  publishedAt: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IBlogAuthor>({
  name: { type: String, required: true },
  role: { type: String, default: 'E-Cell Contributor' },
  avatar: { type: String, default: '/brand/ecell-logo.png' },
});

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: { type: AuthorSchema, required: true },
    category: {
      type: String,
      enum: ['Founder Stories', 'Ecosystem', 'Tech Trends', 'Workshops', 'Guides', 'Interviews'],
      default: 'Ecosystem',
      index: true,
    },
    tags: [{ type: String, trim: true }],
    readTime: { type: String, default: '5 min read' },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now, index: true },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPost;
