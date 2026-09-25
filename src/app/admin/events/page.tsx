'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Calendar, MapPin, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Hackathon',
    location: 'Vishnu Institute of Technology, Bhimavaram',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    capacity: 200,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    registrationLink: '',
    status: 'registration_open',
    featured: true,
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?limit=100');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openNew = () => {
    setEditingEvent(null);
    setForm({
      title: '',
      shortDescription: '',
      description: '',
      category: 'Hackathon',
      location: 'Vishnu Institute of Technology, Bhimavaram',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      capacity: 200,
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      registrationLink: '',
      status: 'registration_open',
      featured: true,
    });
    setShowModal(true);
  };

  const openEdit = (ev: any) => {
    setEditingEvent(ev);
    setForm({
      title: ev.title || '',
      shortDescription: ev.shortDescription || '',
      description: ev.description || '',
      category: ev.category || 'Hackathon',
      location: ev.location || '',
      startDate: ev.startDate ? new Date(ev.startDate).toISOString().split('T')[0] : '',
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().split('T')[0] : '',
      registrationDeadline: ev.registrationDeadline ? new Date(ev.registrationDeadline).toISOString().split('T')[0] : '',
      capacity: ev.capacity ?? 200,
      coverImage: ev.coverImage || '',
      registrationLink: ev.registrationLink || '',
      status: ev.status || 'registration_open',
      featured: !!ev.featured,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingEvent ? `/api/events/${editingEvent.slug}` : '/api/events';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowModal(false);
        await loadEvents();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save event');
      }
    } catch (err) {
      alert('Error saving event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        await loadEvents();
      }
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Event Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, update schedule, toggle registration status, and remove campus events.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Event Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div>{ev.title}</div>
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="text-[11px] text-slate-500 font-normal">
                          /events/{ev.slug}
                        </span>
                        {ev.registrationLink && (
                          <a
                            href={ev.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-mono"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Apply Link</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-300">
                        {ev.category}
                      </span>
                    </td>
                    <td className="p-4">{formatDate(ev.startDate)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.status === 'registration_open'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="p-4">{ev.capacity || 'Unlimited'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(ev)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        aria-label="Edit event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.slug)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        aria-label="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingEvent ? 'Edit Event' : 'Create Event'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-2xl bg-[#0c1017] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Event Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Description *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Speaker Session">Speaker Session</option>
                    <option value="Bootcamp">Bootcamp</option>
                    <option value="Networking">Networking</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs"
                  >
                    <option value="registration_open">Registration Open</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="registration_closed">Registration Closed</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">End Date *</label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Deadline *</label>
                  <input
                    type="date"
                    required
                    value={form.registrationDeadline}
                    onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Location *</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Capacity Limit</label>
                  <input
                    type="number"
                    value={form.capacity === undefined || form.capacity === null || Number.isNaN(form.capacity) ? '' : form.capacity}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({
                        ...form,
                        capacity: val === '' ? 0 : isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Cover Image URL</label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">Apply / Registration Link (URL)</label>
                  <span className="text-[10px] text-amber-400 font-mono">Custom href link</span>
                </div>
                <input
                  type="url"
                  placeholder="https://unstop.com/... or https://forms.google.com/... (leave blank to use built-in portal)"
                  value={form.registrationLink}
                  onChange={(e) => setForm({ ...form, registrationLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  When set, the public &apos;Apply / Register&apos; button will open this external URL directly.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold"
                >
                  {saving ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
