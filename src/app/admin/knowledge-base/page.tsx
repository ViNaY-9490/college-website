'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit,
  Loader2,
  Sparkles,
  ExternalLink,
  BookOpen,
  X,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminKnowledgeBasePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Custom',
    content: '',
    source: 'https://ecellvitb.in/',
    tags: '',
    active: true,
  });

  const categories = [
    'All',
    'Leadership',
    'Recruitment',
    'Events',
    'Startups',
    'About & Vision',
    'Contact & Campus',
    'Custom',
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/knowledge?${params.toString()}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter, search]);

  const handleSyncEcell = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/knowledge/sync-ecell', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Knowledge Base synchronized with ecellvitb.in!');
        loadData();
      } else {
        alert(data.error || 'Failed to sync knowledge.');
      }
    } catch {
      alert('Network error while synchronizing.');
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Custom',
      content: '',
      source: 'Admin Manual Entry',
      tags: '',
      active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item: any) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      category: item.category,
      content: item.content,
      source: item.source,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      active: item.active ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingId) {
        const res = await fetch(`/api/knowledge/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setModalOpen(false);
          loadData();
        }
      } else {
        const res = await fetch('/api/knowledge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setModalOpen(false);
          loadData();
        }
      }
    } catch {
      alert('Failed to save knowledge item.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this knowledge item from the RAG database?')) return;
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it._id !== id));
      }
    } catch {
      alert('Failed to delete.');
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      const res = await fetch(`/api/knowledge/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !item.active }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) => (it._id === item._id ? { ...it, active: !it.active } : it))
        );
      }
    } catch {
      alert('Failed to toggle status.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-amber-400" />
            <span>RAG AI Knowledge Base & Sources</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage factual ground-truth knowledge powering the public AI Assistant. Synchronize live data from ecellvitb.in or upload custom documentation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSyncEcell}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync from ecellvitb.in'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md shadow-amber-400/20 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Knowledge Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl transition-all ${
                categoryFilter === cat
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search knowledge..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Knowledge Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-16 text-center text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
            Loading knowledge base documents...
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className={`p-5 rounded-2xl bg-[#0c1017] border transition-all duration-200 space-y-3 flex flex-col justify-between ${
                item.active ? 'border-white/10 hover:border-amber-400/30' : 'border-white/5 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-amber-400 font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                  </div>

                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors shrink-0 ${
                      item.active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}
                  >
                    {item.active ? 'ACTIVE' : 'MUTED'}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 whitespace-pre-wrap font-sans">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-slate-500">Source:</span>
                  <span className="font-mono text-slate-300 truncate max-w-[180px]">
                    {item.source}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    title="Edit Item"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-12 text-center rounded-2xl bg-[#0c1017] border border-white/10 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Knowledge Items Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sync ground-truth data from ecellvitb.in or add custom documents above.
            </p>
            <button
              onClick={handleSyncEcell}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Verified Facts Now</span>
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1017] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-400" />
                <span>{editingId ? 'Edit Knowledge Item' : 'New Knowledge Document'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Incubation Lab Access & Guidelines"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300 block">Source Attribution</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="https://ecellvitb.in/ or Internal Policy"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Factual Content Body *</label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter complete factual sentences and guidelines. The RAG engine retrieves this context directly for user questions."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Keywords & Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. hackathon, ideathon, prize, eligibility"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-white/10 text-amber-400 focus:ring-amber-400"
                  />
                  <span>Active in AI Assistant Search Pool</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                >
                  {editingId ? 'Update Document' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
