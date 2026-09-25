'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Layers,
  DollarSign,
  Video,
  MessageSquare,
  Palette,
  Truck,
  Megaphone,
  Users2,
  Code2,
  FileText,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import JoinApplicationForm from '@/components/forms/JoinApplicationForm';

export const DEPARTMENTS = [
  {
    id: 'event-management',
    title: 'Event Management',
    icon: Calendar,
    tagline: 'Flagship Summits & Stage Flow',
    description:
      'Stage production, agenda flow, timing coordination, speaker hospitality, and VIP protocol for summits and workshops.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'group-hover:border-amber-400/50',
  },
  {
    id: 'offstage',
    title: 'Offstage',
    icon: Layers,
    tagline: 'Backstage Operations & Desk',
    description:
      'Backstage coordination, crowd direction, participant check-in desks, auditorium logistics, and crisis mitigation.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-blue-500/20 to-indigo-500/10',
    borderColor: 'group-hover:border-blue-400/50',
  },
  {
    id: 'sponsorship',
    title: 'Sponsorship',
    icon: DollarSign,
    tagline: 'Corporate Grants & Brand Deals',
    description:
      'Pitching to corporate brands, securing cash grants and title sponsorships for hackathons, summits, and demo days.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'group-hover:border-emerald-400/50',
  },
  {
    id: 'videography',
    title: 'Videography',
    icon: Video,
    tagline: 'Cinematography & Aftermovies',
    description:
      'Cinematography, viral Instagram reels, founder interviews, recap aftermovies, and post-production color grading.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-rose-500/20 to-red-500/10',
    borderColor: 'group-hover:border-rose-400/50',
  },
  {
    id: 'communication',
    title: 'Communication',
    icon: MessageSquare,
    tagline: 'Anchoring, PR & Stage Scripting',
    description:
      'Official campus correspondence, university notices, formal anchor scripting, and stakeholder relations.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-cyan-500/20 to-sky-500/10',
    borderColor: 'group-hover:border-cyan-400/50',
  },
  {
    id: 'design',
    title: 'Design',
    icon: Palette,
    tagline: 'Visual Identity, UI/UX & Merch',
    description:
      'UI/UX design systems, event posters, stage LED backdrops, brand merchandise, and aesthetic brand identity.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-purple-500/20 to-pink-500/10',
    borderColor: 'group-hover:border-purple-400/50',
  },
  {
    id: 'logistics',
    title: 'Logistics & Operations',
    icon: Truck,
    tagline: 'Hardware, Venue & Supplies',
    description:
      'Venue procurement, audio/visual rigging, electrical supply, physical hardware setup, and spatial planning.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-yellow-500/20 to-amber-500/10',
    borderColor: 'group-hover:border-yellow-400/50',
  },
  {
    id: 'marketing',
    title: 'Marketing & Outreach',
    icon: Megaphone,
    tagline: 'Social Growth & College Campaigns',
    description:
      'Pan-campus promotional drives, inter-college roadshows, viral campaigns, and social community growth.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-pink-500/20 to-rose-500/10',
    borderColor: 'group-hover:border-pink-400/50',
  },
  {
    id: 'pr-hr',
    title: 'PR & HR',
    icon: Users2,
    tagline: 'Team Culture & Coordinator Relations',
    description:
      'Team culture management, coordinator bonding, conflict mitigation, and university club network partnerships.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-violet-500/20 to-purple-500/10',
    borderColor: 'group-hover:border-violet-400/50',
  },
  {
    id: 'rnd-web-dev',
    title: 'R&D and Web Development',
    icon: Code2,
    tagline: 'Full-Stack Apps & Dev Tools',
    description:
      'Architecting E-Cell web platforms, internal hackathon portals, check-in apps, APIs, and automated tools.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-sky-500/20 to-blue-500/10',
    borderColor: 'group-hover:border-sky-400/50',
  },
  {
    id: 'content',
    title: 'Content & Media',
    icon: FileText,
    tagline: 'Startup Breakdowns & Editorial',
    description:
      'Writing deep-dive startup teardowns, editorial articles, press releases, newsletters, and thought leadership pieces.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-orange-500/20 to-amber-500/10',
    borderColor: 'group-hover:border-orange-400/50',
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: CreditCard,
    tagline: 'Budget Auditing & Invoicing',
    description:
      'Budget forecasting, expense tracking, invoice approvals, cash disbursement records, and audited balance sheets.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
    color: 'from-teal-500/20 to-emerald-500/10',
    borderColor: 'group-hover:border-teal-400/50',
  },
];

export default function DepartmentRecruitmentSection() {
  const searchParams = useSearchParams();
  const urlTeam = searchParams.get('team');

  // Default to URL param or 'Event Management'
  const initialDepartment =
    DEPARTMENTS.find((d) => d.title.toLowerCase() === urlTeam?.toLowerCase())?.title ||
    'Event Management';

  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment);
  const [selectedRole, setSelectedRole] = useState<'Lead' | 'Co-Lead' | 'Associate'>('Associate');
  const [formVisible, setFormVisible] = useState(true);

  const formSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (urlTeam) {
      const match = DEPARTMENTS.find((d) => d.title.toLowerCase() === urlTeam.toLowerCase());
      if (match) {
        setSelectedDepartment(match.title);
        setFormVisible(true);
        setTimeout(() => {
          formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [urlTeam]);

  const handleDepartmentClick = (deptTitle: string, defaultRole?: 'Lead' | 'Co-Lead' | 'Associate') => {
    setSelectedDepartment(deptTitle);
    if (defaultRole) {
      setSelectedRole(defaultRole);
    }
    setFormVisible(true);

    // Smooth scroll directly to the form
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const currentDeptObj =
    DEPARTMENTS.find((d) => d.title === selectedDepartment) || DEPARTMENTS[0];
  const CurrentIcon = currentDeptObj.icon;

  return (
    <div className="space-y-16">
      {/* 1. Interactive 12-Department Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1: Choose Your Department</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Click a Department to Open its Application
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Select <strong className="text-amber-300">Event Management</strong>, <strong className="text-amber-300">R&D</strong>, <strong className="text-amber-300">Design</strong>, or any team below to load tailored questions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>12 Departments Active</span>
          </div>
        </div>

        {/* The 12 Clickable Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEPARTMENTS.map((dept) => {
            const Icon = dept.icon;
            const isSelected = selectedDepartment === dept.title;

            return (
              <div
                key={dept.id}
                onClick={() => handleDepartmentClick(dept.title)}
                data-cursor-text="Apply"
                className={`relative p-5 sm:p-6 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/15 via-[#0c1017] to-[#0c1017] border-2 border-amber-400 shadow-2xl shadow-amber-500/20 ring-1 ring-amber-400/40 -translate-y-1'
                    : 'bg-[#0c1017] border border-white/10 hover:border-white/25 hover:bg-[#101520] hover:-translate-y-0.5 shadow-lg'
                }`}
              >
                {/* Selected Indicator Ribbon */}
                {isSelected && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[11px] shadow-md shadow-amber-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 font-bold'
                          : 'bg-white/5 border border-white/10 text-amber-400 group-hover:scale-110 group-hover:bg-amber-400/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`text-base font-bold transition-colors ${
                          isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-400'
                        }`}
                      >
                        {dept.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 block font-medium">
                        {dept.tagline}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300/90 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                {/* Role quick selection inside card */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mr-1">
                      Roles:
                    </span>
                    {dept.roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDepartmentClick(dept.title, role as any);
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          isSelected && selectedRole === role
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                            : 'bg-white/5 hover:bg-white/15 text-slate-300 border border-white/5'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    <span>{isSelected ? 'Ready to Apply' : 'Apply'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Dynamic Recruitment Application Container */}
      <div
        ref={formSectionRef}
        id="application-form"
        className="scroll-mt-24 pt-6"
      >
        {formVisible && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Active Selected Department Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0e131d] to-[#0c1017] border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20 font-bold">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
                      Department Application
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Step 2: Complete Details
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Applying for: <span className="text-amber-400">{selectedDepartment}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {currentDeptObj.tagline} • Tailored interview questions loaded below.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Change Department
                </a>
              </div>
            </div>

            {/* The Form */}
            <div className="rounded-3xl bg-[#0c1017] border border-white/10 p-6 sm:p-10 shadow-2xl">
              <JoinApplicationForm
                selectedDomain={selectedDepartment}
                onDomainChange={(domain) => setSelectedDepartment(domain)}
                targetRole={selectedRole}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
