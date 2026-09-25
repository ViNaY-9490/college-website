import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | E-Cell VITB',
  description: 'Terms of participation, hackathon code of conduct, and digital guidelines for E-Cell VITB.',
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Community Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Participation</h1>
          <p className="text-xs text-amber-300/80 mt-1">
            Notice: This document is an institutional operational draft provided for campus compliance and is subject to formal university legal counsel review.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/10 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Event Registration & Code of Conduct</h2>
            <p>
              By registering for events, competitions, or hackathons hosted by E-Cell VITB,
              participants agree to adhere to academic integrity, mutual respect, and Vishnu Institute
              of Technology campus regulations. Plagiarism or intellectual theft during ideathons and
              hackathons is grounds for immediate disqualification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Intellectual Property (IP) Rights</h2>
            <p>
              Unless otherwise specified by sponsored partner prize challenges, student teams retain
              100% intellectual property rights and equity ownership over the software, hardware, and
              business concepts created during hackathons and incubation cohorts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Attendance & Certificates</h2>
            <p>
              Official certificates of participation and merit are issued solely to attendees who
              satisfy milestone check-ins and verified on-site or virtual presence criteria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
