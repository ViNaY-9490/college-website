'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Lightbulb, X } from 'lucide-react';

export default function AdminInitiativesPage() {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [form, setForm] = useState({
    title: '',
    tag: 'Incubation Cohort',
    shortDescription: '',
    description: '',
    iconName: 'Rocket',
    highlights: '',
    order: 0,
    active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/initiatives');
      const data = await res.json();
      setInitiatives(data.initiatives || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setForm({
      title: '',
      tag: 'Incubation Cohort',
      shortDescription: '',
      description: '',
      iconName: 'Rocket',
      highlights: '12 weeks milestone curriculum, 1-on-1 mentorship, Demo Day',
      order: initiatives.length + 1,
      active: true,
    });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      tag: item.tag || 'Incubation Cohort',
      shortDescription: item.shortDescription || '',
      description: item.description || '',
      iconName: item.iconName || 'Rocket',
      highlights: (item.highlights || []).join(', '),
      order: item.order || 0,
      active: !!item.active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights.split(',').map((h) => h.trim()).filter(Boolean),
      };

      const url = editingItem ? `/api/initiatives/${editingItem._id}` : '/api/initiatives';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        await loadData();
      } else {
        alert('Failed to save initiative');
      }
    } catch (err) {
      alert('Error saving initiative');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this initiative?')) return;
    try {
      const res = await fetch(`/api/initiatives/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      alert('Failed to delete initiative');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Flagship Initiatives Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage entrepreneurship cohorts, hackathons, and lab programs.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Initiative</span>
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
                  <th className="p-4">Title</th>
                  <th className="p-4">Tag</th>
                  <th className="p-4">Icon</th>
                  <th className="p-4">Sort</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {initiatives.map((init) => (
                  <tr key={init._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div>{init.title}</div>
                      <span className="text-[11px] text-slate-500 font-normal line-clamp-1">
                        {init.shortDescription}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-white/5 text-amber-300">
                        {init.tag}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">{init.iconName}</td>
                    <td className="p-4 font-mono">{init.order}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(init)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        aria-label="Edit initiative"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(init._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        aria-label="Delete initiative"
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

      {/* Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingItem ? 'Edit Initiative' : 'New Initiative'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-xl bg-[#0c1017] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Initiative' : 'New Initiative'}
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
                <label className="font-semibold text-slate-300">Initiative Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Badge Tag</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Icon</label>
                  <select
                    value={form.iconName}
                    onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs"
                  >
                    <option value="Rocket">Rocket</option>
                    <option value="Zap">Zap</option>
                    <option value="Users">Users</option>
                    <option value="Compass">Compass</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Highlights (comma separated)</label>
                <input
                  type="text"
                  value={form.highlights}
                  onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
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
                  {saving ? 'Saving...' : 'Save Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
