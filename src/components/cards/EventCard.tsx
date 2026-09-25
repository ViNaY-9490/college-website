'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface EventCardProps {
  event: {
    _id: string;
    title: string;
    slug: string;
    shortDescription: string;
    coverImage: string;
    category: string;
    location: string;
    startDate: string | Date;
    capacity?: number;
    status: string;
    registrationLink?: string;
  };
}

export default function EventCard({ event }: EventCardProps) {
  const [imgSrc, setImgSrc] = useState(
    event.coverImage || '/ecell-assets/images/innovate.png'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registration_open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Registration Open
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Upcoming
          </span>
        );
      case 'registration_closed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Closed
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <article className="group relative flex flex-col rounded-2xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
        <Image
          src={imgSrc}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc('/ecell-assets/images/innovate.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1017] via-[#0c1017]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
            {event.category}
          </span>
          {getStatusBadge(event.status)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Date & Location */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{event.location}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
            <Link href={`/events/${event.slug}`} className="focus:outline-none">
              {event.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${event.slug}#register`}
              className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shadow-md shadow-amber-400/20"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Open outside registration link"
                className="text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <span>Outside Link</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
            )}
          </div>

          {event.capacity && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Users className="w-3 h-3" />
              <span>Cap: {event.capacity}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
