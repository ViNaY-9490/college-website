'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  linkText?: string;
  linkUrl?: string;
}

export default function AnnouncementBar({
  text = '✨ Innovate – Create – Lead: E-Cell VITB Recruitment 2026 is Live across 12 Departments!',
  linkText = 'Apply Now',
  linkUrl = '/join',
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside
      aria-label="Important Announcement"
      className="relative z-50 bg-[#0a0e17] border-b border-amber-500/20 px-3 sm:px-4 py-2 text-[11px] sm:text-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-slate-200 text-center font-medium overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
          <span className="truncate">{text}</span>
          {linkUrl && (
            <Link
              href={linkUrl}
              className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 shrink-0 ml-1 transition-colors"
            >
              <span>{linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
