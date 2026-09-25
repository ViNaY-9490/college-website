import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import { Partner } from '@/models/Partner';
import { Building2, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ecosystem Partners & Accelerators | E-Cell VITB',
  description:
    'Collaborate with E-Cell VITB. Explore our institutional incubators, corporate partners, and state innovation networks.',
};

export const revalidate = 60;

export default async function PartnersPage() {
  await connectToDatabase();
  const partners = await Partner.find({ active: true }).sort({ order: 1 }).lean();

  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-sky-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutional & Industry Network</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ecosystem Partners & Accelerators
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We partner with regional government innovation societies, national entrepreneurship networks,
            and institutional incubation hubs to provide student founders with world-class mentors
            and funding channels.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner: any) => (
            <div
              key={partner._id}
              className="p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                    <Image
                      src={partner.logo || '/brand/ecell-logo.png'}
                      alt={partner.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-400">
                    {partner.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{partner.name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {partner.description}
                </p>
              </div>

              {partner.website && (
                <div className="pt-3 border-t border-white/5">
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>Visit Partner Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Partner with us CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0c1017] via-[#0f1420] to-[#080a0f] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Interested in Partnering With Us?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Sponsor our flagship hackathons, deliver an executive masterclass, or recruit from our
              top student engineering and entrepreneurship cohorts.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 transition-all shrink-0 shadow-lg shadow-amber-400/20"
          >
            Submit Partnership Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
