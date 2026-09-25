'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import {
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  GitHubIcon,
} from '@/components/ui/SocialIcons';
import NewsletterForm from '../forms/NewsletterForm';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative bg-[#05070a] border-t border-white/10 text-slate-400 text-sm overflow-hidden">
      {/* Subtle background ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/ecell-logo.png"
                  alt="E-Cell VITB"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  E-CELL <span className="text-amber-400 font-extrabold">VITB</span>
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase">
                  Vishnu Institute of Technology
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The student-driven entrepreneurship community at Vishnu Institute of Technology.
              Fostering innovation, accelerating student ventures, and inspiring future visionary leaders.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-amber-300">
              <span>INNOVATE</span>
              <span className="text-slate-600">•</span>
              <span>CREATE</span>
              <span className="text-slate-600">•</span>
              <span>LEAD</span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2 max-w-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Stay Ahead in the Startup Ecosystem
              </h4>
              <NewsletterForm />
            </div>
          </div>

          {/* Column 2: Ecosystem */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About E-Cell
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link href="/initiatives" className="hover:text-white transition-colors">
                  Flagship Initiatives
                </Link>
              </li>
              <li>
                <Link href="/startups" className="hover:text-white transition-colors">
                  Startup Showcase
                </Link>
              </li>
              <li>
                <Link href="/partners" className="hover:text-white transition-colors">
                  Partners & Incubators
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  Team & Faculty Advisors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Community */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Resources & Insights
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Founder Insights & Blogs
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Pitch Decks & Handbooks
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors">
                  Photo & Event Gallery
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-amber-300 text-amber-400 font-medium transition-colors">
                  Join E-Cell Community
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Campus & Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Campus Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Vishnu Institute of Technology, Vishnupur, Bhimavaram, AP - 534202
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="flex flex-col">
                  <a href="mailto:e-cell@vishnu.edu.in" className="hover:text-white">
                    e-cell@vishnu.edu.in
                  </a>
                  <a href="mailto:Info.ecell@vishnu.edu.in" className="text-[11px] text-slate-500 hover:text-white">
                    Info.ecell@vishnu.edu.in
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 8816 251333</span>
              </div>
            </div>

            {/* Social links */}
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <a
                  href="https://linkedin.com/company/ecell-vitb"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/ecell_vitb"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@ecellvitb"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <YouTubeIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/ecell_vitb"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/ecell-vitb"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <GitHubIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} E-Cell VITB • Entrepreneurship Cell of Vishnu Institute of Technology. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
