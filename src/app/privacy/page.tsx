import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | E-Cell VITB',
  description: 'Privacy policy and data handling guidelines for E-Cell VITB digital services.',
};

export default function PrivacyPage() {
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
            <span>Institutional Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-amber-300/80 mt-1">
            Notice: This document is an institutional operational draft provided for digital transparency and is subject to formal university legal counsel review.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c1017] border border-white/10 space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When students or external participants register for hackathons, apply for membership, or
              submit contact inquiries, we collect basic identification data such as Name, Email,
              Phone Number, College Institution, Academic Year, and Department.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. How Information is Used</h2>
            <p>
              Collected information is strictly utilized to coordinate event passes, send essential
              schedule updates, verify campus eligibility, and evaluate recruitment applications. We
              never sell student data to third-party marketing brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Data Security & Storage</h2>
            <p>
              Data is stored securely on encrypted MongoDB Atlas clusters with role-based access
              controls and SSL/TLS transmission encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Inquiries & Data Removal</h2>
            <p>
              Participants wishing to update or request deletion of their registration records can
              contact us directly at{' '}
              <a href="mailto:ecell@vishnu.edu.in" className="text-amber-400 underline">
                ecell@vishnu.edu.in
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
