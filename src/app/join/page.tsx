import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import DepartmentRecruitmentSection from '@/components/recruitment/DepartmentRecruitmentSection';

export const metadata: Metadata = {
  title: 'Join E-Cell VITB | Campus Recruitment & Student Leadership',
  description:
    'Apply to join the student leadership team across 12 departments at E-Cell, Vishnu Institute of Technology. Lead hackathons, mentor ventures, and build high-impact products.',
};

export default function JoinPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>✨ Innovate – Create – Lead ✨</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Join the Leadership Driving Campus Innovation
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Apply to join the student-driven leadership team at Vishnu Institute of Technology.
            Click on <strong className="text-amber-300">Event Management</strong>, <strong className="text-amber-300">R&D</strong>, or any department below to open and submit your tailored candidate application.
          </p>
        </div>

        {/* Interactive 12-Department Recruitment Experience */}
        <Suspense
          fallback={
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <span className="text-xs text-slate-400 font-mono">Loading recruitment portal...</span>
            </div>
          }
        >
          <DepartmentRecruitmentSection />
        </Suspense>

        {/* Why Join Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10">
          <div className="p-7 rounded-3xl bg-[#0c1017] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Direct Founder & VC Network</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Work directly alongside seasoned startup founders, angel investors, and industry executives who judge competitions and mentor campus cohorts.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0c1017] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Real-World Execution</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Manage operational budgets, coordinate enterprise brand sponsorships, and run large-scale hackathons and summits attended by hundreds of students.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[#0c1017] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Incubation Priority</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Members building their own venture ideas receive priority access to our incubation resources, prototyping credits, and 1-on-1 faculty guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
