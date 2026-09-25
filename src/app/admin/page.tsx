'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  UserPlus,
  Mail,
  Send,
  Rocket,
  BookOpen,
  ArrowRight,
  FileText,
  Building2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentRegistrations(data.recentRegistrations || []);
        setRecentInquiries(data.recentInquiries || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ecosystem Overview & Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry and management controls for E-Cell VITB.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Registrations</span>
            <UserPlus className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalRegistrations || 0}
          </span>
          <Link
            href="/admin/registrations"
            className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Manage attendees</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Events</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalEvents || 0}
          </span>
          <Link
            href="/admin/events"
            className="text-[11px] text-amber-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Edit events</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Join Applications</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalApplications || 0}
          </span>
          <Link
            href="/admin/join-applications"
            className="text-[11px] text-sky-400 hover:underline inline-flex items-center gap-1"
          >
            <span>{stats?.pendingApplications || 0} pending review</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Contact Inquiries</span>
            <Mail className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalInquiries || 0}
          </span>
          <Link
            href="/admin/contacts"
            className="text-[11px] text-purple-400 hover:underline inline-flex items-center gap-1"
          >
            <span>{stats?.pendingInquiries || 0} new inquiries</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Newsletter Subscribers</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalSubscribers || 0}
          </span>
          <Link
            href="/admin/newsletter"
            className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
          >
            <span>View subscribers</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Startups Incubated</span>
            <Rocket className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalStartups || 0}
          </span>
          <Link
            href="/admin/startups"
            className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
          >
            <span>Manage showcase</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Articles & Blogs</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalBlogs || 0}
          </span>
          <Link
            href="/admin/blogs"
            className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
          >
            <span>Write article</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Resources & Guides</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-white block">
            {stats?.totalResources || 0}
          </span>
          <Link
            href="/admin/resources"
            className="text-[11px] text-slate-400 hover:text-white inline-flex items-center gap-1"
          >
            <span>Upload guides</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Quick Management Shortcuts
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events"
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
          >
            + Create New Event
          </Link>
          <Link
            href="/admin/blogs"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
          >
            + Publish Blog Article
          </Link>
          <Link
            href="/admin/registrations"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
          >
            Export Event Registrations (CSV)
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
          >
            Edit Announcement Bar & Motto
          </Link>
        </div>
      </div>

      {/* Split Tables: Recent Event Registrations & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registrations */}
        <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              Recent Event Registrations
            </h3>
            <Link
              href="/admin/registrations"
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentRegistrations.length > 0 ? (
              recentRegistrations.map((reg) => (
                <div
                  key={reg._id}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-white">{reg.name}</h4>
                    <p className="text-slate-400 text-[11px]">
                      {reg.eventTitle} • {reg.department} ({reg.year})
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      reg.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {reg.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No recent event registrations found.
              </p>
            )}
          </div>
        </div>

        {/* Inquiries */}
        <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              Recent Contact Inquiries
            </h3>
            <Link href="/admin/contacts" className="text-xs text-amber-400 hover:text-amber-300">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-white">{inq.name}</h4>
                    <p className="text-slate-400 text-[11px] line-clamp-1">{inq.subject}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inq.status === 'new'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No recent inquiries received.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
