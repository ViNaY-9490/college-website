import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Rocket, Users, Target, Shield, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import { SiteSettings } from '@/models/SiteSettings';
import { Event } from '@/models/Event';
import { Initiative } from '@/models/Initiative';
import { Startup } from '@/models/Startup';
import { BlogPost } from '@/models/BlogPost';
import { Partner } from '@/models/Partner';
import { TeamMember } from '@/models/TeamMember';

import HeroSection from '@/components/sections/HeroSection';
import ImpactMetrics from '@/components/sections/ImpactMetrics';
import MottoSection from '@/components/sections/MottoSection';
import EventCard from '@/components/cards/EventCard';
import InitiativeCard from '@/components/cards/InitiativeCard';
import StartupCard from '@/components/cards/StartupCard';
import BlogCard from '@/components/cards/BlogCard';

export const revalidate = 60; // Revalidate every minute

async function getHomeData() {
  try {
    await connectToDatabase();
    const [settings, events, initiatives, startups, blogs, partners, team] = await Promise.all([
      SiteSettings.findOne().lean(),
      Event.find({ status: { $in: ['registration_open', 'upcoming'] } })
        .sort({ startDate: 1 })
        .limit(3)
        .lean(),
      Initiative.find({ active: true }).sort({ order: 1 }).limit(3).lean(),
      Startup.find({ active: true }).sort({ order: 1 }).limit(2).lean(),
      BlogPost.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(3).lean(),
      Partner.find({ active: true }).sort({ order: 1 }).limit(6).lean(),
      TeamMember.find({ active: true, category: { $in: ['Executive Board', 'Faculty Advisors'] } })
        .sort({ order: 1 })
        .limit(4)
        .lean(),
    ]);

    return {
      settings: JSON.parse(JSON.stringify(settings || {})),
      events: JSON.parse(JSON.stringify(events || [])),
      initiatives: JSON.parse(JSON.stringify(initiatives || [])),
      startups: JSON.parse(JSON.stringify(startups || [])),
      blogs: JSON.parse(JSON.stringify(blogs || [])),
      partners: JSON.parse(JSON.stringify(partners || [])),
      team: JSON.parse(JSON.stringify(team || [])),
    };
  } catch (error) {
    console.error('Home data load error:', error);
    return {
      settings: {},
      events: [],
      initiatives: [],
      startups: [],
      blogs: [],
      partners: [],
      team: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();
  const upcomingEvent = data.events[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <HeroSection
        upcomingEventTitle={upcomingEvent?.title}
        upcomingEventSlug={upcomingEvent?.slug}
      />

      {/* 2. IMPACT METRICS / CREDIBILITY */}
      <ImpactMetrics stats={data.settings?.stats} />

      {/* 3. ABOUT E-CELL STORY & BELIEFS */}
      <section className="py-20 sm:py-28 bg-[#07080b] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About The Organization</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Catalyzing Student Entrepreneurs at{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Vishnu Institute of Technology
                </span>
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                E-Cell, Vishnu Institute of Technology, is a student-driven community dedicated to
                promoting entrepreneurship, innovation, and technological venture creation.
              </p>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We believe that university campuses are the ultimate cradle for world-changing
                technologies. Through hands-on bootcamps, real investor demo days, and inter-departmental
                collaboration, we equip aspiring student founders with the execution horsepower
                needed to turn dorm-room hypotheses into venture-scale reality.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-xl font-bold text-amber-400">100% Student Led</span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Driven by passionate engineering and business leaders.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="block text-xl font-bold text-sky-400">Incubator Linked</span>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Direct access to state & institutional incubation grants.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 group"
                >
                  <span>Read our complete story, vision, and governance</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right: Visual Showcase with Official Baseline Statements */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-lg rounded-3xl bg-[#0c1017] border border-white/10 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Core Pillars of Value
                  </span>
                  <span className="text-xs font-mono text-amber-400">VITB ECOSYSTEM</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      Access to Young Innovators
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Connect directly with multi-disciplinary student engineers solving real regional problems.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-sky-400" />
                      Industry-Academia Bridge
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Bridging classroom theory with corporate challenges, venture capital evaluation, and real startup grit.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Mentorship & Mutual Growth
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Alumni founders and seasoned startup mentors offering 1-on-1 office hours to validated cohorts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOTTO SECTION: INNOVATE – CREATE – LEAD */}
      <MottoSection />

      {/* 5. UPCOMING EVENTS & HACKATHONS */}
      <section className="py-20 sm:py-28 bg-[#090b10] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400 mb-3">
                <Sparkles className="w-3 h-3" />
                <span>Campus Calendar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Upcoming Events & Hackathons
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
                Participate in high-energy conferences, hands-on masterclasses, and competitive
                hackathons.
              </p>
            </div>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all self-start md:self-auto"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          {data.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.events.map((event: any) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 p-8 rounded-2xl bg-[#0c1017] border border-white/10">
              <p className="text-slate-400 text-sm">
                No active events currently scheduled. Check back soon for announcements!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 6. FLAGSHIP INITIATIVES */}
      <section className="py-20 sm:py-28 bg-[#07080b] border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
              Actionable Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Flagship Incubation & Innovation Initiatives
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Structured pathways engineered to take students from curious beginner to venture-backed
              founder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.initiatives.map((init: any) => (
              <InitiativeCard key={init._id} initiative={init} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/initiatives"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white"
            >
              <span>View all initiatives and cohort timelines</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. STARTUP SHOWCASE */}
      {data.startups.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#090b10] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-semibold text-sky-400 tracking-wider uppercase">
                  Venture Showcase
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Startups Born at Vishnu Institute of Technology
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
                  Meet the visionary campus founders creating real-world products in AgriTech, EdTech,
                  and AI.
                </p>
              </div>

              <Link
                href="/startups"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all self-start md:self-auto"
              >
                <span>View All Startups</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.startups.map((st: any) => (
                <StartupCard key={st._id} startup={st} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. WHY JOIN E-CELL / RECRUITMENT TEASER */}
      <section className="py-20 sm:py-28 bg-[#07080b] border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-gradient-to-br from-[#0e1320] via-[#0c1017] to-[#080a0f] border border-white/15 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  Student Leadership & Recruitment
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Ready to Shape the Next Wave of Campus Innovators?
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Joining E-Cell VITB is more than joining a student club. You will manage large-scale
                  hackathons, network directly with venture capital leaders, pitch real products, and
                  work alongside the most ambitious engineers on campus.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real executive leadership experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Direct founder & mentor network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Lab access & fast-track incubation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hands-on event & product management</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    href="/join"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/25 transition-all"
                  >
                    <span>Apply to Join E-Cell</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/team"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
                  >
                    <span>Meet the Team</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 text-center">
                  <Users className="w-12 h-12 text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Recruitment Open Across Domains</h3>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {[
                      'Event Management',
                      'Design',
                      'R&D and Web Dev',
                      'Sponsorship & Finance',
                      'Marketing & Outreach',
                      'Videography',
                      'PR & HR',
                      'Communication',
                    ].map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 pt-2">
                    All years and engineering departments welcome to apply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INSIGHTS & ARTICLES */}
      {data.blogs.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#090b10] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                  Insights & Playbooks
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Articles for Student Builders
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
                  Practical takeaways on customer validation, cap tables, angel syndicates, and
                  dorm-room prototyping.
                </p>
              </div>

              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all self-start md:self-auto"
              >
                <span>Read All Insights</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.blogs.map((post: any) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. PARTNERS / ECOSYSTEM SUPPORTERS */}
      {data.partners.length > 0 && (
        <section className="py-16 bg-[#07080b] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ecosystem & Incubation Collaborators
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data.partners.map((partner: any) => (
                <div
                  key={partner._id}
                  className="p-5 rounded-2xl bg-[#0c1017] border border-white/5 hover:border-white/15 flex items-center justify-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center p-1">
                    <Image
                      src={partner.logo || '/brand/ecell-logo.png'}
                      alt={partner.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-300 text-left">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/partners"
                className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
              >
                <span>Partner with E-Cell VITB</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
