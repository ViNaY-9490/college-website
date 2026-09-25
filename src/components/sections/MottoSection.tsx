'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Lightbulb, Code2, Trophy, ArrowRight, Sparkles, Target, Compass } from 'lucide-react';
import Link from 'next/link';

const mottoPillars = [
  {
    id: 'innovate',
    title: 'INNOVATE',
    subtitle: 'Think beyond boundaries and develop groundbreaking ideas.',
    icon: Lightbulb,
    image: '/ecell-assets/images/innovate.png',
    badge: 'Ideation & Discovery',
    accentColor: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-500/30',
    glowColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    description:
      'Entrepreneurship begins with questioning the default. At E-Cell VITB, we nurture early-stage curiosity into structured problem discovery, patent exploration, and cross-disciplinary innovation challenges.',
    actions: [
      'Problem validation sprints with real customer interviews',
      'Design thinking & empathy mapping masterclasses',
      'Intellectual Property (IP) and patent guidance with faculty mentors',
    ],
    metric: '100+ Ideas Validated Annually',
    ctaLink: '/initiatives',
    ctaText: 'Explore Innovation Programs',
  },
  {
    id: 'create',
    title: 'CREATE',
    subtitle: 'Transform ideas into real-world solutions with creativity and technology.',
    icon: Code2,
    image: '/ecell-assets/images/create.png',
    badge: 'Prototyping & Engineering',
    accentColor: 'from-sky-400 to-indigo-500',
    borderColor: 'border-sky-500/30',
    glowColor: 'bg-sky-500/10',
    textColor: 'text-sky-400',
    description:
      'Ideas remain hypotheses until they are built. We provide the physical lab spaces, hardware development kits, software server credits, and engineer-designer synergy necessary to ship working MVPs that users love.',
    actions: [
      '36-hour sprint hackathons with 24/7 on-floor engineering mentors',
      'Rapid prototype funding grants through the Venture Ignition Program',
      'Full-stack architecture reviews and UI/UX design workshops',
    ],
    metric: '35+ Hackathons & Prototyping Sprints',
    ctaLink: '/events',
    ctaText: 'View Upcoming Hackathons',
  },
  {
    id: 'lead',
    title: 'LEAD',
    subtitle: 'Inspire change, take initiative, and drive the future of entrepreneurship.',
    icon: Trophy,
    image: '/ecell-assets/images/lead.png',
    badge: 'Venture & Leadership',
    accentColor: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-500/30',
    glowColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    description:
      'True leadership is measured by long-term impact. We connect student founders with angel syndicates, industry accelerators, and state government innovation grants to launch sustainable, venture-backed companies.',
    actions: [
      'Demo Day pitches to active angel investors & venture capital syndicates',
      'DPIIT Startup India registration and corporate compliance support',
      'Direct pipeline to institutional incubation and regional accelerators',
    ],
    metric: '14+ Student Startups Supported',
    ctaLink: '/startups',
    ctaText: 'Explore Student Startups',
  },
];

export default function MottoSection() {
  const [activeTab, setActiveTab] = useState(0);
  const current = mottoPillars[activeTab];
  const CurrentIcon = current.icon;

  return (
    <section className="relative py-20 sm:py-28 bg-[#07080b] border-t border-white/10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/5 via-sky-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Guiding Philosophy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Our Motto:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400">
              Innovate • Create • Lead
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The core mantra that anchors every event, cohort, and startup launched from the halls
            of Vishnu Institute of Technology.
          </p>
        </div>

        {/* Interactive Pillar Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0c1017] border border-white/10 shadow-lg">
            {mottoPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/15 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? pillar.textColor : 'text-slate-500'
                    }`}
                  />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Feature Display Card */}
        <div
          className={`rounded-3xl bg-[#0c1017] border ${current.borderColor} p-6 sm:p-10 lg:p-12 relative overflow-hidden transition-all duration-500 shadow-2xl`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>{current.badge}</span>
              </div>

              <div>
                <h3
                  className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${current.accentColor}`}
                >
                  {current.title}
                </h3>
                <p className="text-base sm:text-lg text-slate-200 font-medium mt-1">
                  &ldquo;{current.subtitle}&rdquo;
                </p>
              </div>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {current.description}
              </p>

              {/* Action items list */}
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 pt-2 border-t border-white/5">
                {current.actions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>

              {/* CTA link */}
              <div className="pt-4">
                <Link
                  href={current.ctaLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold text-xs sm:text-sm transition-all hover:scale-105"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col items-center text-center space-y-6 relative">
                <div
                  className={`relative w-32 h-32 rounded-2xl ${current.glowColor} border ${current.borderColor} flex items-center justify-center p-3 transition-transform hover:scale-105 duration-300 overflow-hidden shadow-lg`}
                >
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                    {current.metric}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Real ecosystem impact delivered at Vishnu Institute of Technology
                  </span>
                </div>

                <div className="w-full pt-4 border-t border-white/10 flex items-center justify-around text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Campus Led</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Mentor Backed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
