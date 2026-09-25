import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { EventRegistration } from '@/models/EventRegistration';
import { formatDate, formatDateTime } from '@/lib/utils';
import EventRegistrationForm from '@/components/forms/EventRegistrationForm';

export const revalidate = 60;

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const event = await Event.findOne({ slug }).lean();

  if (!event) {
    return { title: 'Event Not Found | E-Cell VITB' };
  }

  const title = event.seo?.metaTitle || `${event.title} | E-Cell VITB`;
  const description = event.seo?.metaDescription || event.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: event.coverImage, alt: event.title }],
    },
  };
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = await params;
  await connectToDatabase();

  const event = await Event.findOne({ slug }).lean();
  if (!event) {
    notFound();
  }

  const registrationCount = await EventRegistration.countDocuments({
    eventId: (event as any)._id,
    status: { $in: ['confirmed', 'attended'] },
  });

  const isClosed =
    event.status === 'completed' ||
    event.status === 'registration_closed' ||
    new Date() > new Date(event.registrationDeadline);

  // JSON-LD Structured Data
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.shortDescription,
    startDate: new Date(event.startDate).toISOString(),
    endDate: new Date(event.endDate).toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isVirtual
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vishnu Institute of Technology, Vishnupur',
        addressLocality: 'Bhimavaram',
        postalCode: '534202',
        addressCountry: 'IN',
      },
    },
    image: [event.coverImage],
    organizer: {
      '@type': 'Organization',
      name: 'E-Cell VITB',
      url: 'https://ecellvitb.in',
    },
  };

  return (
    <div className="py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to All Events</span>
          </Link>
        </div>

        {/* Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-amber-300">
                {event.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {registrationCount} Registered
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {event.shortDescription}
            </p>

            {/* Quick Metadata Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#0c1017] border border-white/10 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-xs">Date & Time</span>
                  <span className="text-white font-medium">{formatDate(event.startDate)}</span>
                  <span className="text-slate-400 block text-xs">
                    {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-xs">Location</span>
                  <span className="text-white font-medium">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Extended Description */}
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold text-white">About the Event</h2>
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white">Distinguished Speakers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.speakers.map((sp: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 flex items-start gap-4"
                    >
                      <div className="relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        <Image
                          src={sp.photo || '/ecell-assets/icons/team_member.png'}
                          alt={sp.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">{sp.name}</h3>
                        <p className="text-xs text-amber-400 font-semibold">
                          {sp.role || sp.designation} {sp.company ? `• ${sp.company}` : ''}
                        </p>
                        {sp.bio && <p className="text-xs text-slate-400">{sp.bio}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda Timeline */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white">Event Agenda</h2>
                <div className="space-y-3">
                  {event.agenda.map((ag: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0c1017] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono text-amber-400">{ag.time}</span>
                        <h4 className="text-sm font-bold text-white">{ag.title}</h4>
                        {ag.description && (
                          <p className="text-xs text-slate-400">{ag.description}</p>
                        )}
                      </div>
                      {ag.speaker && (
                        <span className="text-xs text-slate-400 font-medium self-start sm:self-auto px-2.5 py-1 rounded bg-white/5">
                          Speaker: {ag.speaker}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {event.faqs && event.faqs.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {event.faqs.map((faq: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0c1017] border border-white/5 space-y-1.5"
                    >
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                        {faq.question}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Registration Box (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <EventRegistrationForm
              eventSlug={event.slug}
              eventTitle={event.title}
              isClosed={isClosed}
              externalRegistrationLink={(event as any).registrationLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
