'use client';

import { Menu, ShieldCheck } from 'lucide-react';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export default function AdminHeader({ onToggleSidebar, user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-[#0a0d14] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white md:hidden hover:bg-white/5"
          aria-label="Toggle admin sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs sm:text-sm font-semibold text-white">
          E-Cell VITB Content Management System
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-white font-medium block leading-none">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] text-amber-400 font-mono">{user?.role || 'SUPER_ADMIN'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
