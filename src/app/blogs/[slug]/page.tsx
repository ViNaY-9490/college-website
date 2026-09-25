import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Share2, Tag, BookOpen } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';
import { formatDate } from '@/lib/utils';
import BlogCard from '@/components/cards/BlogCard';

export const revalidate = 60;

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const post = await BlogPost.findOne({ slug }).lean();

  if (!post) {
    return { title: 'Article Not Found | E-Cell VITB' };
  }

  const title = post.seo?.metaTitle || `${post.title} | E-Cell VITB`;
  const description = post.seo?.metaDescription || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author?.name || 'E-Cell VITB'],
      images: [{ url: post.coverImage, alt: post.title }],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  await connectToDatabase();

  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) {
    notFound();
  }

  const related = await BlogPost.find({
    _id: { $ne: (post as any)._id },
    category: (post as any).category,
    status: 'published',
  })
    .limit(2)
    .lean();

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    datePublished: new Date(post.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'E-Cell Contributor',
    },
    publisher: {
      '@type': 'Organization',
      name: 'E-Cell VITB',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ecellvitb.in/brand/ecell-logo.png',
      },
    },
  };

  return (
    <article className="py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-white/10">
                <Image
                  src={post.author?.avatar || '/brand/ecell-logo.png'}
                  alt={post.author?.name || 'Author'}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-white font-semibold block">{post.author?.name}</span>
                <span className="text-slate-400 block text-[11px]">{post.author?.role}</span>
              </div>
            </div>

            {/* Date & Read time */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        {/* Article Excerpt Callout */}
        <div className="p-6 rounded-2xl bg-white/5 border-l-4 border-amber-400 text-slate-200 text-base italic leading-relaxed">
          &ldquo;{post.excerpt}&rdquo;
        </div>

        {/* Content Body */}
        <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500 mr-1" />
            {post.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Related Founder Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((r: any) => (
                <BlogCard key={r._id} post={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
