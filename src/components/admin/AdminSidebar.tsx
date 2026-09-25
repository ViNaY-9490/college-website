'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Rocket,
  Lightbulb,
  BookOpen,
  Image as ImageIcon,
  Building2,
  FileText,
  Mail,
  UserPlus,
  Send,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Bot,
  MailCheck,
  X,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Registrations', href: '/admin/registrations', icon: UserPlus },
  { name: 'Join Applications', href: '/admin/join-applications', icon: Users },
  { name: 'Email Dispatcher', href: '/admin/email', icon: MailCheck },
  { name: 'RAG Knowledge Base', href: '/admin/knowledge-base', icon: Bot },
  { name: 'Contacts', href: '/admin/contacts', icon: Mail },
  { name: 'Team Members', href: '/admin/team', icon: Users },
  { name: 'Initiatives', href: '/admin/initiatives', icon: Lightbulb },
  { name: 'Startups', href: '/admin/startups', icon: Rocket },
  { name: 'Blogs & Insights', href: '/admin/blogs', icon: BookOpen },
  { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Partners', href: '/admin/partners', icon: Building2 },
  { name: 'Resources', href: '/admin/resources', icon: FileText },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Send },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <aside className="w-64 bg-[#0a0d14] border-r border-white/10 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center p-1">
            <Image
              src="/brand/ecell-logo.png"
              alt="E-Cell VITB"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">E-CELL CMS</span>
            <span className="text-[10px] text-amber-400 block font-mono">PORTAL ADMIN</span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white md:hidden"
            aria-label="Close admin menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Admin Navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Links & Logout */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </span>
          <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">View</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
