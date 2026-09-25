import type { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import { Startup } from '@/models/Startup';
import StartupCard from '@/components/cards/StartupCard';
import { Rocket, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Startup Showcase | E-Cell VITB',
  description:
    'Discover startups founded and incubated by student builders at Vishnu Institute of Technology, Bhimavaram.',
};

export const revalidate = 60;

export default async function StartupsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; stage?: string }>;
}) {
  const { category, stage } = await searchParams;
  await connectToDatabase();

  const query: any = { active: true };
  if (category && category !== 'All') query.category = category;
  if (stage && stage !== 'All') query.stage = stage;

  const startups = await Startup.find(query).sort({ order: 1, createdAt: -1 }).lean();

  const categories = ['All', 'AgriTech', 'EdTech', 'AI / DeepTech', 'HealthTech', 'SaaS'];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-sky-400">
            <Rocket className="w-3.5 h-3.5" />
            <span>Campus Venture Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Startups Built at Vishnu Institute of Technology
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Witness how student founders at VITB are solving pressing regional and national challenges
            in agriculture, developer tools, healthcare, and education through high-tech ventures.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#0c1017] border border-white/10">
          {categories.map((cat) => {
            const isSelected = (!category && cat === 'All') || category === cat;
            return (
              <Link
                key={cat}
                href={`/startups?category=${cat}${stage ? `&stage=${stage}` : ''}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Startups Grid */}
        {startups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {startups.map((st: any) => (
              <StartupCard key={st._id} startup={st} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
            <Rocket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Startups in this Category</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Are you building a venture on campus? Apply to get your startup listed in our directory.
            </p>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              <span>Submit Your Startup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Pitch Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0c1017] via-[#0f1420] to-[#080a0f] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Are You a Student Founder at VITB?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Get access to seed grants, legal incorporation assistance, cloud infrastructure
              credits, and investor introductions.
            </p>
          </div>
          <Link
            href="/join"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 transition-all shrink-0 shadow-lg shadow-amber-400/20"
          >
            Apply for Ecosystem Incubation
          </Link>
        </div>
      </div>
    </div>
  );
}
