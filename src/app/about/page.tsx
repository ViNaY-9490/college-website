import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Compass, Lightbulb, Code2, Trophy, Users, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import MottoSection from '@/components/sections/MottoSection';

export const metadata: Metadata = {
  title: 'About E-Cell VITB | Mission, Vision & Ecosystem',
  description:
    'Learn about the Entrepreneurship Cell of Vishnu Institute of Technology, our student-driven mission, vision, motto, and innovation ecosystem.',
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
            <Compass className="w-3.5 h-3.5" />
            <span>Organization Overview</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Igniting the Spirit of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Campus Entrepreneurship
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            E-Cell, Vishnu Institute of Technology, is a student-driven community committed to
            transforming engineering intellect and business acumen into sustainable, high-growth
            startups.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0c1017] border border-white/10 relative overflow-hidden space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              To empower students with an entrepreneurial mindset, actionable technical skills, and
              industry mentorship, turning groundbreaking ideas into sustainable, impactful ventures.
              We bridge academic rigor with commercial viability through immersive competitions,
              incubation support, and venture capital interactions.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0c1017] border border-white/10 relative overflow-hidden space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              To build a thriving entrepreneurial ecosystem where students innovate, collaborate, and
              transform ideas into impactful startups. We aim to empower future leaders with the
              skills, resources, and mindset needed to drive regional economic growth and technological
              leadership.
            </p>
          </div>
        </div>

        {/* The Motto: Innovate, Create, Lead */}
        <MottoSection />

        {/* Faculty Convenors from ecellvitb.in */}
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Institutional Leadership
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Faculty Advisory & Convenorship
            </h2>
            <p className="text-sm text-slate-400">
              Guiding student visionaries with academic rigor, intellectual property guidance, and institutional backing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-white/10 flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-amber-500/20 shrink-0 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                <Image
                  src="/ecell-assets/icons/team_member.png"
                  alt="Dr. R. V. D. Rama Rao"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-bold uppercase tracking-wider">
                  Convenor
                </span>
                <h3 className="text-xl font-bold text-white">Dr. R. V. D. Rama Rao</h3>
                <p className="text-xs text-amber-300 font-medium">Faculty Coordinator / Convenor, E-Cell VITB</p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Championing student innovation and institutionalizing venture creation at Vishnu Institute of Technology, bridging engineering prototypes with commercial enterprise.
                </p>
                <div className="pt-2">
                  <a href="mailto:e-cell@vishnu.edu.in" className="text-xs text-slate-400 hover:text-white transition-colors">
                    e-cell@vishnu.edu.in
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-white/10 flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 border border-sky-500/20 shrink-0 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                <Image
                  src="/ecell-assets/icons/team_member.png"
                  alt="Dr. B. V. S. T. Sai"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-400/10 text-sky-400 font-bold uppercase tracking-wider">
                  Co-Convenor
                </span>
                <h3 className="text-xl font-bold text-white">Dr. B. V. S. T. Sai</h3>
                <p className="text-xs text-sky-300 font-medium">Co-Convenor, E-Cell VITB</p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Mentoring student cohorts across research translation, patent strategies, and institutional linkages with state and national innovation missions.
                </p>
                <div className="pt-2">
                  <a href="mailto:Info.ecell@vishnu.edu.in" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Info.ecell@vishnu.edu.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Partner with E-Cell Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c1017] via-[#0f1420] to-[#080a0f] border border-white/10 p-8 sm:p-12 lg:p-16 space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Collaborative Synergy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Partner with E-Cell VITB?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Connecting enterprises, investors, and startup networks directly with high-caliber
              student innovators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 hover:border-amber-400/30 transition-colors">
              <div className="relative w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2 overflow-hidden flex items-center justify-center">
                <Image
                  src="/ecell-assets/images/partner/innovate.png"
                  alt="Access to Young Innovators"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h3 className="text-base font-bold text-white">Access to Young Innovators</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with passionate student teams and fresh perspectives solving modern technical
                and societal challenges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 hover:border-sky-400/30 transition-colors">
              <div className="relative w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 p-2 overflow-hidden flex items-center justify-center">
                <Image
                  src="/ecell-assets/images/partner/collaborate.png"
                  alt="Industry-Academia Collaboration"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h3 className="text-base font-bold text-white">Industry-Academia Bridge</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bridge classroom curricula with enterprise problem statements, research grants, and
                sponsored innovation challenges.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 hover:border-emerald-400/30 transition-colors">
              <div className="relative w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2 overflow-hidden flex items-center justify-center">
                <Image
                  src="/ecell-assets/images/partner/network.png"
                  alt="Networking & Branding"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h3 className="text-base font-bold text-white">Networking & Branding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gain premier visibility among upcoming tech graduates, early-stage founders, and
                regional angel syndicates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 hover:border-purple-400/30 transition-colors">
              <div className="relative w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 p-2 overflow-hidden flex items-center justify-center">
                <Image
                  src="/ecell-assets/images/partner/growth.png"
                  alt="Mutual Growth"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <h3 className="text-base font-bold text-white">Mutual Sustainable Growth</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Co-develop pilot solutions, mentor budding talent, and recruit the sharpest product
                builders on campus.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-colors"
            >
              <span>Initiate a Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>Meet Our Faculty & Leadership</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
