import type { Metadata } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';
import GalleryLightbox from '@/components/ui/GalleryLightbox';
import { Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visual Gallery | E-Cell VITB',
  description:
    'Moments captured during hackathons, workshops, conferences, and startup pitch events at Vishnu Institute of Technology.',
};

export const revalidate = 60;

export default async function GalleryPage() {
  await connectToDatabase();
  const items = await GalleryItem.find({ active: true }).sort({ order: 1, createdAt: -1 }).lean();

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Campus Moments</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Visual Story & Event Archives
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Relive the energy of 36-hour hackathon coding sprints, packed auditoriums, masterclasses,
            and startup demo day pitches at Vishnu Institute of Technology.
          </p>
        </div>

        {/* Interactive Lightbox Grid */}
        <GalleryLightbox items={JSON.parse(JSON.stringify(items))} />
      </div>
    </div>
  );
}
