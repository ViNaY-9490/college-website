import Link from 'next/link';
import { Home, Calendar, Compass, Mail, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-grid-pattern relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-6 relative z-10 p-8 sm:p-12 rounded-3xl bg-[#0c1017] border border-white/10 shadow-2xl">
        <span className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-sky-400 font-mono">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-white">Route Not Found</h1>

        <p className="text-slate-400 text-sm leading-relaxed">
          The entrepreneurship ecosystem page or event you are searching for might have moved,
          concluded, or is temporarily unavailable.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-4 text-xs font-semibold">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Home Page</span>
          </Link>

          <Link
            href="/events"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Campus Events</span>
          </Link>

          <Link
            href="/about"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>About E-Cell</span>
          </Link>

          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
          >
            <Mail className="w-4 h-4 text-purple-400" />
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
