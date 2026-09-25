import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Rocket, Zap, Users, Compass, ArrowRight, CheckCircle2, Award, Sparkles } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import { Initiative } from '@/models/Initiative';
import InitiativeCard from '@/components/cards/InitiativeCard';

export const metadata: Metadata = {
  title: 'Flagship Initiatives | E-Cell VITB',
  description:
    'Discover incubation programs, sprint hackathons, founder masterclasses, and co-working facilities at Vishnu Institute of Technology.',
};

export const revalidate = 60;

export default async function InitiativesPage() {
  await connectToDatabase();
  const initiatives = await Initiative.find({ active: true }).sort({ order: 1 }).lean();

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
            <Rocket className="w-3.5 h-3.5" />
            <span>Incubation & Venture Acceleration</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Flagship Initiatives & Programs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Every semester, E-Cell VITB runs structured programs designed to turn engineering curiosity
            into high-traction technology startups. Explore our signature incubation cohorts,
            hackathons, and founder networks.
          </p>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {initiatives.map((init: any) => (
            <div
              key={init._id}
              className="p-8 sm:p-10 rounded-3xl bg-[#0c1017] border border-white/10 space-y-6 flex flex-col justify-between hover:border-white/20 transition-all hover:shadow-2xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {init.tag}
                  </span>
                  <span className="text-xs font-mono text-slate-500">Cohort 2026</span>
                </div>

                <h2 className="text-2xl font-bold text-white">{init.title}</h2>
                <p className="text-sm text-slate-300 leading-relaxed">{init.description}</p>

                {init.highlights && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Program Highlights
                    </span>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {init.highlights.map((h: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {init.metrics && (
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                    {init.metrics.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 text-center"
                      >
                        <span className="block text-xl font-bold text-white">{m.value}</span>
                        <span className="block text-xs text-slate-400">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/5">
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-colors"
                >
                  <span>Apply for Incubation Support</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Co-working lab callout */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Have a Prototype You Want to Incubate?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Our campus innovation lab offers IoT benches, cloud credits, and direct investor office
              hours. Apply to our rolling cohort today.
            </p>
          </div>
          <Link
            href="/join"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shrink-0 shadow-lg shadow-amber-400/20"
          >
            Submit Venture for Review
          </Link>
        </div>
      </div>
    </div>
  );
}
