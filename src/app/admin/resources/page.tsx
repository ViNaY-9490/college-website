'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, FileText, X, ExternalLink } from 'lucide-react';

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'Guide',
    category: 'Pitch Deck',
    fileUrl: '',
    order: 0,
    active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resources');
      const data = await res.json();
      setResources(data.resources || []);
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
      description: '',
      type: 'Guide',
      category: 'Pitch Deck',
      fileUrl: '',
      order: resources.length + 1,
      active: true,
    });
    setShowModal(true);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'Guide',
      category: item.category || 'Pitch Deck',
      fileUrl: item.fileUrl || '',
      order: item.order || 0,
      active: !!item.active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingItem ? `/api/resources/${editingItem._id}` : '/api/resources';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowModal(false);
        await loadData();
      } else {
        alert('Failed to save resource');
      }
    } catch (err) {
      alert('Error saving resource');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      alert('Failed to delete resource');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Founder Resources & Toolkits
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage downloadable pitch deck templates, legal guides, and founder playbooks.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Resource</span>
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
                  <th className="p-4">Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">URL</th>
                  <th className="p-4">Sort</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {resources.map((res) => (
                  <tr key={res._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div>{res.title}</div>
                      <span className="text-[11px] text-slate-500 font-normal line-clamp-1">
                        {res.description}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded bg-white/5 text-purple-300">
                        {res.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{res.type}</td>
                    <td className="p-4 text-sky-400 max-w-xs truncate">
                      <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-4 font-mono">{res.order}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(res)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                        aria-label="Edit resource"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(res._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        aria-label="Delete resource"
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
          aria-label={editingItem ? 'Edit Resource' : 'Add Resource'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-lg bg-[#0c1017] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Resource' : 'Add Resource'}
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
                <label className="font-semibold text-slate-300">Resource Title *</label>
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
                  <label className="font-semibold text-slate-300">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs"
                  >
                    <option value="Pitch Deck">Pitch Deck</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                    <option value="Business Model">Business Model</option>
                    <option value="Fundraising">Fundraising</option>
                    <option value="Tech Stack">Tech Stack</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Resource Format</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs"
                  >
                    <option value="Template">Template</option>
                    <option value="Guide">Guide</option>
                    <option value="PDF">PDF</option>
                    <option value="Deck">Deck</option>
                    <option value="Tool">Tool</option>
                    <option value="Cheatsheet">Cheatsheet</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Resource URL (Link/Drive/File) *</label>
                <input
                  type="url"
                  required
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  placeholder="https://docs.google.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Sort Order</label>
                <input
                  type="number"
                  value={form.order === undefined || form.order === null || Number.isNaN(form.order) ? '' : form.order}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({
                      ...form,
                      order: val === '' ? 0 : isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10),
                    });
                  }}
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
                  {saving ? 'Saving...' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
