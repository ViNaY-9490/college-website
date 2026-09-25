import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: 'Contact & Inquiries | E-Cell VITB',
  description:
    'Get in touch with the Entrepreneurship Cell of Vishnu Institute of Technology, Bhimavaram for sponsorships, mentorship, and collaborations.',
};

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Connect & Collaborate</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Get in Touch with E-Cell VITB
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Have questions about upcoming hackathons, startup incubation cohorts, campus partnerships,
            or student recruitment? Our core team is ready to assist.
          </p>
        </div>

        {/* Content Grid: Contact Information & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Campus Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[#0c1017] border border-white/10 space-y-6">
              <h2 className="text-xl font-bold text-white">Campus Headquarters</h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-xs">Official Address</span>
                    <span className="text-white font-medium block">
                      Vishnu Institute of Technology
                    </span>
                    <span className="text-slate-300">
                      Vishnupur, Kovvada, Bhimavaram, West Godavari District, Andhra Pradesh - 534202
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-xs">Official Inquiries & Coordination</span>
                    <a
                      href="mailto:e-cell@vishnu.edu.in"
                      className="text-white hover:text-amber-400 font-medium block"
                    >
                      e-cell@vishnu.edu.in
                    </a>
                    <a
                      href="mailto:Info.ecell@vishnu.edu.in"
                      className="text-slate-400 hover:text-white text-xs block"
                    >
                      Info.ecell@vishnu.edu.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-xs">Phone Line</span>
                    <span className="text-white font-medium">+91 8816 251333</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-white/5">
                  <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-xs">Incubation Lab Hours</span>
                    <span className="text-white font-medium">Monday - Saturday: 9:00 AM - 6:00 PM</span>
                    <span className="text-slate-400 block text-xs">
                      24/7 access available for incubated teams during sprint milestones.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Vishnu+Institute+of+Technology+Bhimavaram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
