'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Rocket, Users, Calendar, Award, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  upcomingEventTitle?: string;
  upcomingEventSlug?: string;
}

export default function HeroSection({
  upcomingEventTitle = 'Ideathon 2026: Campus Venture Pitch',
  upcomingEventSlug = 'ideathon-2026-campus-venture-pitch',
}: HeroSectionProps) {
  return (
    <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-28 overflow-hidden bg-grid-pattern">
      {/* Dynamic ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-amber-500/10 via-sky-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Verified Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>Official Entrepreneurship Cell • Vishnu Institute of Technology</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Where Ideas Become{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-300 to-emerald-400">
                Ventures.
              </span>
            </h1>

            {/* Factual Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A student-driven community at Vishnu Institute of Technology promoting innovation, mentorship, and startup creation. Through ideathons, hackathons, and corporate alliances, we help aspiring entrepreneurs build impactful solutions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/join"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Join E-Cell VITB</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all"
              >
                <span>Explore Ecosystem</span>
              </Link>

              {upcomingEventSlug && (
                <Link
                  href={`/events/${upcomingEventSlug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 border border-sky-500/20 transition-all"
                >
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Flagship: Ideathon 2026</span>
                </Link>
              )}
            </div>

            {/* Trust Markers with Verified Institutional Facts */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>12 Active Recruitment Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-sky-400" />
                <span>Dr. R.V.D. Rama Rao • Convenor</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Annual Ideathon & E-Summit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Factual Innovation Console */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="relative rounded-3xl bg-[#0c1017]/90 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5">
                      <Image
                        src="/ecell-assets/icons/Icon-192.png"
                        alt="E-Cell VITB"
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">E-CELL ECOSYSTEM</h4>
                      <p className="text-[11px] text-slate-400">Vishnu Institute of Technology</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CAMPUS HUB
                  </span>
                </div>

                {/* Verified Core Sections */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-amber-400/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <Image
                          src="/ecell-assets/images/innovate.png"
                          alt="Innovate"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Ideathon 2026: Campus Pitch
                        </span>
                        <span className="text-[10px] text-slate-400">Flagship Ideation Challenge</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-400">Registering</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-sky-400/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <Image
                          src="/ecell-assets/images/create.png"
                          alt="Create"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Startup Expo & Demo Days
                        </span>
                        <span className="text-[10px] text-slate-400">Hardware & SaaS Prototypes</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-sky-400">Showcase</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-emerald-400/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1 flex items-center justify-center overflow-hidden shrink-0">
                        <Image
                          src="/ecell-assets/images/lead.png"
                          alt="Lead"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">
                          Campus Recruitment 2026
                        </span>
                        <span className="text-[10px] text-slate-400">12 Specialized Departments</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400">Open</span>
                  </div>
                </div>

                {/* Official Motto Banner & Action */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-extrabold text-xs tracking-wider shadow-sm shadow-amber-400/10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>INNOVATE – CREATE – LEAD</span>
                  </div>
                  <Link
                    href="/join"
                    className="w-full sm:w-auto text-amber-400 font-bold hover:text-amber-300 inline-flex items-center justify-center gap-1.5 transition-colors text-xs py-1"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Verified Community Marker - placed cleanly beneath the console with zero overlap */}
              <div className="mt-3 flex items-center justify-between px-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-200">Student Led Community</span>
                  <span className="text-slate-600">•</span>
                  <span>Vishnu Institute of Technology</span>
                </div>
              </div>

              {/* Floating Verified Badge (Top Right) */}
              <div className="absolute -top-3.5 -right-2 sm:-right-3.5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c1017] border border-amber-400/40 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-300">Recruitment Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
