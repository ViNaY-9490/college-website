import type { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Event } from '@/models/Event';
import EventCard from '@/components/cards/EventCard';
import { Calendar, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Events & Hackathons | E-Cell VITB',
  description:
    'Explore upcoming hackathons, innovation summits, startup conferences, and technical workshops organized by E-Cell VITB.',
};

export const revalidate = 60;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; search?: string }>;
}) {
  const { category, status, search } = await searchParams;

  await connectToDatabase();

  const query: any = { status: { $ne: 'draft' } };

  if (category && category !== 'All') {
    query.category = category;
  }

  if (status && status !== 'All') {
    if (status === 'past') {
      query.status = 'completed';
    } else if (status === 'open') {
      query.status = 'registration_open';
    } else if (status === 'ongoing') {
      query.status = 'in_progress';
    } else if (status === 'upcoming') {
      query.status = { $in: ['registration_open', 'upcoming'] };
    }
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const rawEvents = await Event.find(query).sort({ startDate: status === 'past' ? -1 : 1 }).lean();
  const events = JSON.parse(JSON.stringify(rawEvents));

  const categories = [
    'All',
    'Flagship',
    'Competitions',
    'Workshops',
    'Guest Lectures',
    'E-Summit',
  ];

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Activities & Summits</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Events & Innovation Hackathons
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From pan-India conferences to 36-hour prototyping sprints and venture capital demo days,
            explore every event happening across Vishnu Institute of Technology.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1017] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const isSelected = (!category && cat === 'All') || category === cat;
              return (
                <Link
                  key={cat}
                  href={`/events?category=${cat}${status ? `&status=${status}` : ''}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Link
              href={`/events?status=upcoming${category ? `&category=${category}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                status === 'upcoming' || !status
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming
            </Link>
            <Link
              href={`/events?status=ongoing${category ? `&category=${category}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                status === 'ongoing'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ongoing
            </Link>
            <Link
              href={`/events?status=open${category ? `&category=${category}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                status === 'open'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Open for Registration
            </Link>
            <Link
              href={`/events?status=past${category ? `&category=${category}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                status === 'past'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Events
            </Link>
          </div>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : status === 'ongoing' ? (
          <div className="text-center py-20 p-8 sm:p-12 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">No Ongoing Events Right Now</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              There are currently no active live sessions taking place. Check out our upcoming flagship summits or subscribe below to get notified instantly when live events start!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/events?status=upcoming"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                View Upcoming Summits
              </Link>
              <Link
                href="/join"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/15 border border-white/10 transition-colors"
              >
                Apply to E-Cell Team
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Events Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No events matched the selected filters. Try clearing your filters or check back
              shortly.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
            >
              Reset Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
