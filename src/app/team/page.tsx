import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import { TeamMember } from '@/models/TeamMember';
import TeamCard from '@/components/cards/TeamCard';
import {
  Users,
  Sparkles,
  ArrowRight,
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Team & Faculty Leadership | E-Cell VITB',
  description:
    'Meet the faculty advisors, student executive board, core leads, and coordinators driving innovation at Vishnu Institute of Technology.',
};

export const revalidate = 60;

const recruitmentDepartments = [
  {
    title: 'Event Management',
    icon: Calendar,
    tagline: 'Flagship Summits & Stage Flow',
    description: 'Stage production, agenda flow, timing coordination, and VIP protocol for summits.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Offstage',
    icon: Layers,
    tagline: 'Backstage Operations & Desk',
    description: 'Backstage coordination, crowd direction, participant registration desks, and support.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Sponsorship',
    icon: DollarSign,
    tagline: 'Corporate Grants & Brand Deals',
    description: 'Pitching to corporate brands, securing cash grants and title sponsorships.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Videography',
    icon: Video,
    tagline: 'Cinematography & Aftermovies',
    description: 'Cinematography, viral Instagram reels, founder interviews, and video post-production.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Communication',
    icon: MessageSquare,
    tagline: 'Anchoring, PR & Stage Scripting',
    description: 'Official campus correspondence, formal anchor scripting, and stakeholder relations.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Design',
    icon: Palette,
    tagline: 'Visual Identity, UI/UX & Merch',
    description: 'UI/UX design systems, event posters, stage LED backdrops, and brand identity.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Logistics & Operations',
    icon: Truck,
    tagline: 'Hardware, Venue & Supplies',
    description: 'Venue procurement, audio/visual rigging, electrical supply, and hardware setup.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Marketing & Outreach',
    icon: Megaphone,
    tagline: 'Social Growth & College Campaigns',
    description: 'Pan-campus promotional drives, college roadshows, viral campaigns, and growth.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'PR & HR',
    icon: Users2,
    tagline: 'Team Culture & Relations',
    description: 'Team culture management, coordinator bonding, and student club partnerships.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'R&D and Web Development',
    icon: Code2,
    tagline: 'Full-Stack Apps & Dev Tools',
    description: 'Architecting E-Cell web platforms, hackathon portals, check-in apps, and APIs.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Content & Media',
    icon: FileText,
    tagline: 'Startup Breakdowns & Editorial',
    description: 'Writing startup teardowns, editorial articles, press releases, and newsletters.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
  {
    title: 'Finance',
    icon: CreditCard,
    tagline: 'Budget Auditing & Invoicing',
    description: 'Budget forecasting, expense tracking, invoice approvals, and balance sheets.',
    roles: ['Lead', 'Co-Lead', 'Associate'],
  },
];

export default async function TeamPage() {
  await connectToDatabase();

  const rawMembers = await TeamMember.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean();
  const members = JSON.parse(JSON.stringify(rawMembers));

  // Group by category dynamically based on what exists in the database
  const categoriesOrder = [
    'Faculty Advisors',
    'Executive Board',
    'Core Team',
    'Leads',
    'Coordinators',
    'Members',
  ];

  const grouped = categoriesOrder.reduce((acc, cat) => {
    const list = members.filter((m: any) => m.category === cat);
    if (list.length > 0) {
      acc.push({ category: cat, members: list });
    }
    return acc;
  }, [] as { category: string; members: any[] }[]);

  // Catch any remaining categories not in the standard list
  const otherMembers = members.filter((m: any) => !categoriesOrder.includes(m.category));
  if (otherMembers.length > 0) {
    grouped.push({ category: 'Community Team', members: otherMembers });
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Header with official ecellvitb.in team banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-white/10 pb-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
              <Users className="w-3.5 h-3.5" />
              <span>Leadership & Community</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              The Minds Behind E-Cell VITB
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Meet the dedicated faculty convenors, executive board, and departmental student leads who organize hackathons, mentor early-stage ventures, and steer the entrepreneurship ecosystem across Vishnu Institute of Technology.
            </p>
            <div className="pt-2">
              <a
                href="#recruitment-departments"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
              >
                <span>Join Our Team (12 Departments Open)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden">
              <Image
                src="/ecell-assets/images/team.png"
                alt="E-Cell VITB Team Banner"
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          </div>
        </div>

        {/* Grouped Sections */}
        {grouped.map((group) => (
          <div key={group.category} className="space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {group.category}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-amber-400">
                {group.members.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {group.members.map((member: any) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#0c1017] border border-white/10 space-y-2">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Team Roster Updating</h3>
            <p className="text-sm text-slate-400">
              The updated leadership list for the current academic session will appear here.
            </p>
          </div>
        )}

        {/* Dedicated Join E-Cell / Recruitment Section */}
        <div id="recruitment-departments" className="pt-12 border-t border-white/10 space-y-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join E-Cell Campus Leadership</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Click a Department to Apply
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Ready to lead campus initiatives? Click on <strong className="text-amber-300">Event Management</strong>, <strong className="text-amber-300">R&D</strong>, <strong className="text-amber-300">Design</strong>, or any department to jump directly into the application form.
              </p>
            </div>

            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shrink-0 shadow-lg shadow-amber-400/20"
            >
              <span>View Full Recruitment Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recruitmentDepartments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Link
                  key={dept.title}
                  href={`/join?team=${encodeURIComponent(dept.title)}#application-form`}
                  data-cursor-text="Apply"
                  className="p-5 sm:p-6 rounded-3xl bg-[#0c1017] border border-white/10 hover:border-amber-400/50 hover:bg-[#101520] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-400/10 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {dept.title}
                        </h3>
                        <span className="text-[11px] text-slate-400 block font-medium">
                          {dept.tagline}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300/80 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">
                        Roles:
                      </span>
                      {dept.roles.map((r) => (
                        <span
                          key={r}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-medium"
                        >
                          {r}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
