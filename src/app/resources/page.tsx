import type { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import { Resource } from '@/models/Resource';
import { FileText, Download, ExternalLink, Sparkles, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Founder Resources & Pitch Decks | E-Cell VITB',
  description:
    'Curated templates, pitch deck outlines, cap table sheets, and DPIIT startup registration guides for student entrepreneurs.',
};

export const revalidate = 60;

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  await connectToDatabase();

  const query: any = { active: true };
  if (category && category !== 'All') query.category = category;

  const resources = await Resource.find(query).sort({ order: 1, createdAt: -1 }).lean();

  const categories = [
    'All',
    'Pitch Deck',
    'Legal & Compliance',
    'Business Model',
    'Fundraising',
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-400">
            <FileText className="w-3.5 h-3.5" />
            <span>Curated Founder Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Startup Toolkits & Resources
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Download proven pitch deck frameworks, DPIIT compliance checklists, and customer discovery
            playbooks vetted by investors and faculty mentors.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#0c1017] border border-white/10">
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'All') || category === cat;
            return (
              <Link
                key={cat}
                href={`/resources?category=${cat}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res: any) => (
            <div
              key={res._id}
              className="p-6 sm:p-7 rounded-3xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-purple-300">
                    {res.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{res.type}</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{res.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500">{res.downloadCount || 0}+ views</span>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                >
                  <span>Access Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
