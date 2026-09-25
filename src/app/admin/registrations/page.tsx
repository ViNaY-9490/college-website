'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Download,
  Loader2,
  CheckCircle2,
  UserPlus,
  Filter,
  Copy,
  Check,
  Mail,
  Send,
  Users,
  Calendar,
  Sparkles,
  ExternalLink,
  Search,
  CheckSquare,
  Square,
  Layers,
  Inbox,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminRegistrationsPage() {
  const router = useRouter();

  // Active view: 'event_wise' | 'all_emails'
  const [activeTab, setActiveTab] = useState<'event_wise' | 'all_emails'>('event_wise');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    stats: {
      totalUniqueEmails: number;
      totalEventRegistrations: number;
      totalJoinApplications: number;
      totalSubscribers: number;
      totalInquiries: number;
    };
    eventWiseBuckets: any[];
    allContacts: any[];
  }>({
    stats: {
      totalUniqueEmails: 0,
      totalEventRegistrations: 0,
      totalJoinApplications: 0,
      totalSubscribers: 0,
      totalInquiries: 0,
    },
    eventWiseBuckets: [],
    allContacts: [],
  });

  // Selected event for event-wise view
  const [selectedEventSlug, setSelectedEventSlug] = useState<string>('');

  // Search & Filter for All Emails view
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Selected emails for bulk actions
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  // Copy notification toast
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setCopiedNotice(msg);
    setTimeout(() => setCopiedNotice(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (sourceFilter !== 'All') params.append('source', sourceFilter);

      const res = await fetch(`/api/admin/contacts/all-emails?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (!selectedEventSlug && json.eventWiseBuckets?.length > 0) {
          setSelectedEventSlug(json.eventWiseBuckets[0].slug);
        }
      }
    } catch (err) {
      console.error('Failed to load contacts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, sourceFilter]);

  // Update registration status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Copy email list to clipboard
  const handleCopyEmails = (emails: string[], label: string) => {
    if (emails.length === 0) {
      showToast('No emails to copy');
      return;
    }
    const text = emails.join(', ');
    navigator.clipboard.writeText(text);
    showToast(`Copied ${emails.length} email(s) for ${label}!`);
  };

  // Jump to Email Dispatcher with emails preloaded
  const handleBroadcastEmails = (emails: string[]) => {
    if (emails.length === 0) return;
    sessionStorage.setItem('ecell_broadcast_emails', JSON.stringify(emails));
    router.push('/admin/email?prefill=session');
  };

  // Export event CSV
  const handleExportEventCSV = (eventSlug: string) => {
    window.location.href = `/api/admin/registrations?format=csv&eventSlug=${eventSlug}`;
  };

  // Export all contacts CSV
  const handleExportAllContactsCSV = () => {
    let url = '/api/admin/contacts/all-emails?format=csv';
    if (sourceFilter !== 'All') url += `&source=${sourceFilter}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    window.location.href = url;
  };

  // Bulk selection toggles
  const toggleSelectEmail = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const selectAllFiltered = () => {
    const all = new Set(data.allContacts.map((c) => c.email));
    setSelectedEmails(all);
  };

  const deselectAll = () => {
    setSelectedEmails(new Set());
  };

  const currentEvent = data.eventWiseBuckets.find((b) => b.slug === selectedEventSlug);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {copiedNotice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-amber-400" />
            <span>Event Contacts & Email Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Classified event-wise attendee rosters, universal contacts directory, and one-click email broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'all_emails' ? (
            <button
              onClick={handleExportAllContactsCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export All Contacts CSV</span>
            </button>
          ) : (
            currentEvent && (
              <button
                onClick={() => handleExportEventCSV(currentEvent.slug)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Event Roster CSV</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Total Unique Contacts
          </span>
          <div className="text-2xl font-extrabold text-white">
            {data.stats.totalUniqueEmails}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">De-duplicated across all forms</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Event Registrations
          </span>
          <div className="text-2xl font-extrabold text-amber-400">
            {data.stats.totalEventRegistrations}
          </div>
          <span className="text-[10px] text-slate-400">Across {data.eventWiseBuckets.length} events</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Team Applicants
          </span>
          <div className="text-2xl font-extrabold text-sky-400">
            {data.stats.totalJoinApplications}
          </div>
          <span className="text-[10px] text-slate-400">12 Specialized Departments</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Newsletter Subscribers
          </span>
          <div className="text-2xl font-extrabold text-purple-400">
            {data.stats.totalSubscribers}
          </div>
          <span className="text-[10px] text-slate-400">Active campus readers</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="p-1 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1 text-xs font-semibold w-full sm:w-auto">
        <button
          onClick={() => setActiveTab('event_wise')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'event_wise'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>1. Event-Wise Classified Contacts</span>
        </button>

        <button
          onClick={() => setActiveTab('all_emails')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'all_emails'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2. Unified &quot;All Emails&quot; Master Directory</span>
        </button>
      </div>

      {/* TAB 1: EVENT-WISE CLASSIFICATION */}
      {activeTab === 'event_wise' && (
        <div className="space-y-6">
          {/* Event Picker Pills */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Select Event to View Classified Roster &amp; Emails:
            </span>
            <div className="flex flex-wrap gap-2">
              {data.eventWiseBuckets.map((bucket) => {
                const active = selectedEventSlug === bucket.slug;
                return (
                  <button
                    key={bucket.slug}
                    onClick={() => setSelectedEventSlug(bucket.slug)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                      active
                        ? 'bg-amber-400/15 border-amber-400 text-white shadow-md'
                        : 'bg-[#0c1017] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{bucket.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        active
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {bucket.totalCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {currentEvent ? (
            <div className="space-y-6">
              {/* Event Summary & Quick Action Card */}
              <div className="p-6 rounded-3xl bg-[#0c1017] border border-amber-400/20 space-y-5 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {currentEvent.category} • {currentEvent.status}
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-1">
                      {currentEvent.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      URL: /events/{currentEvent.slug} • {currentEvent.totalCount} Total Registrations ({currentEvent.uniqueEmailsCount} Unique Emails)
                    </p>
                  </div>

                  {/* Actions for this specific event */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      onClick={() => handleCopyEmails(currentEvent.uniqueEmails, currentEvent.title)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copy {currentEvent.uniqueEmailsCount} Emails</span>
                    </button>

                    <button
                      onClick={() => handleBroadcastEmails(currentEvent.uniqueEmails)}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-400/20 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Broadcast to this Event</span>
                    </button>
                  </div>
                </div>

                {/* Event Attendance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Confirmed Seats</span>
                    <span className="text-lg font-bold text-emerald-400">{currentEvent.confirmedCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Waitlisted</span>
                    <span className="text-lg font-bold text-amber-400">{currentEvent.waitlistedCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Attended Check-ins</span>
                    <span className="text-lg font-bold text-sky-400">{currentEvent.attendedCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Unique Email Contacts</span>
                    <span className="text-lg font-bold text-white">{currentEvent.uniqueEmailsCount}</span>
                  </div>
                </div>
              </div>

              {/* Event Attendees Table */}
              <div className="rounded-3xl bg-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
                <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Registered Attendees Roster ({currentEvent.attendees.length})
                  </span>
                  <span className="text-[11px] text-slate-400">Classified for {currentEvent.title}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-4">Attendee Name</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Branch &amp; Year</th>
                        <th className="p-4">Team</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {currentEvent.attendees.map((att: any) => (
                        <tr key={att._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <span className="font-semibold text-white block">{att.name}</span>
                            <span className="text-[11px] text-slate-400">{att.institution}</span>
                          </td>
                          <td className="p-4 font-mono text-amber-300 select-all">
                            {att.email}
                          </td>
                          <td className="p-4 font-mono text-slate-300">
                            {att.phone || '—'}
                          </td>
                          <td className="p-4">
                            <span className="text-white block">{att.department}</span>
                            <span className="text-[11px] text-slate-400">{att.year}</span>
                          </td>
                          <td className="p-4 text-slate-400">
                            {att.teamName || 'Solo'}
                          </td>
                          <td className="p-4">
                            <select
                              value={att.status}
                              onChange={(e) => updateStatus(att._id, e.target.value)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                att.status === 'confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : att.status === 'attended'
                                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              <option value="confirmed">confirmed</option>
                              <option value="waitlisted">waitlisted</option>
                              <option value="attended">attended</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {currentEvent.attendees.length === 0 && (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    No attendees registered for this event yet.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs bg-[#0c1017] rounded-3xl border border-white/10">
              No event buckets found.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UNIFIED ALL EMAILS MASTER DIRECTORY */}
      {activeTab === 'all_emails' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search email, name, branch, phone..."
                className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'All', label: 'All Contacts' },
                { id: 'Event', label: 'Event Attendees' },
                { id: 'Join', label: 'Recruitment' },
                { id: 'Newsletter', label: 'Newsletter' },
                { id: 'Contact', label: 'Inquiries' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSourceFilter(f.id)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    sourceFilter === f.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Action Bar */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">
                Found <strong className="text-white">{data.allContacts.length}</strong> email contacts
              </span>
              {selectedEmails.size > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-semibold">
                  {selectedEmails.size} Selected
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={selectAllFiltered}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
              >
                Select All
              </button>
              {selectedEmails.size > 0 && (
                <button
                  onClick={deselectAll}
                  className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
                >
                  Clear Selection
                </button>
              )}

              <button
                onClick={() => {
                  const targetList =
                    selectedEmails.size > 0
                      ? Array.from(selectedEmails)
                      : data.allContacts.map((c) => c.email);
                  handleCopyEmails(targetList, 'All Selected Contacts');
                }}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Copy {selectedEmails.size > 0 ? selectedEmails.size : data.allContacts.length} Emails
                </span>
              </button>

              <button
                onClick={() => {
                  const targetList =
                    selectedEmails.size > 0
                      ? Array.from(selectedEmails)
                      : data.allContacts.map((c) => c.email);
                  handleBroadcastEmails(targetList);
                }}
                className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compose Broadcast</span>
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="rounded-3xl bg-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4 w-10">Select</th>
                    <th className="p-4">Contact &amp; Email</th>
                    <th className="p-4">Primary Category</th>
                    <th className="p-4">Origin Sources &amp; Tags</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {data.allContacts.map((contact) => {
                    const isSelected = selectedEmails.has(contact.email);
                    return (
                      <tr
                        key={contact.email}
                        className={`hover:bg-white/5 transition-colors ${
                          isSelected ? 'bg-amber-400/5' : ''
                        }`}
                      >
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => toggleSelectEmail(contact.email)}
                            className="text-slate-400 hover:text-amber-400"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        <td className="p-4">
                          <span className="font-semibold text-white block">
                            {contact.name || 'Anonymous User'}
                          </span>
                          <span className="font-mono text-amber-300 text-[11px] block select-all">
                            {contact.email}
                          </span>
                          {contact.details && (
                            <span className="text-[10px] text-slate-500 block">
                              {contact.details}
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                            {contact.primaryCategory}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {contact.sources.map((src: string, i: number) => (
                              <span
                                key={i}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                  src.startsWith('Event:')
                                    ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                                    : src.startsWith('Recruitment:')
                                    ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                                    : 'bg-white/5 text-slate-400 border border-white/5'
                                }`}
                              >
                                {src}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-4 font-mono text-slate-400">
                          {contact.phone || '—'}
                        </td>

                        <td className="p-4 text-slate-400 font-mono text-[11px]">
                          {formatDate(contact.lastActive)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data.allContacts.length === 0 && (
              <div className="text-center py-20 text-slate-400 text-xs">
                No email contacts found matching your criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
