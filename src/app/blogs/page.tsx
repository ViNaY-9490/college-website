import type { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';
import BlogCard from '@/components/cards/BlogCard';
import { BookOpen, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Insights & Founder Articles | E-Cell VITB',
  description:
    'Actionable startup playbooks, student founder stories, cap table guides, and venture ecosystem trends from E-Cell VITB.',
};

export const revalidate = 60;

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;
  await connectToDatabase();

  const query: any = { status: 'published' };
  if (category && category !== 'All') query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const posts = await BlogPost.find(query).sort({ publishedAt: -1 }).lean();

  const categories = [
    'All',
    'HealthTech',
    'DeepTech',
    'Enterprise SaaS',
    'Quick Commerce',
    'AI HealthTech',
    'FinTech',
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge & Playbooks</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Founder Insights & Editorial
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Practical playbooks written by student builders, alumni founders, and guest investors to
            help you navigate customer discovery, cap tables, and early-stage scaling.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#0c1017] border border-white/10">
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'All') || category === cat;
            return (
              <Link
                key={cat}
                href={`/blogs?category=${cat}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#0c1017] border border-white/10 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Articles Found</h3>
            <p className="text-sm text-slate-400">Check back soon for new startup guides.</p>
          </div>
        )}
      </div>
    </div>
  );
}
