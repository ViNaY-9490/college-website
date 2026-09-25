'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Rocket, X, ExternalLink } from 'lucide-react';

export default function AdminStartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingStartup, setEditingStartup] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    category: 'EdTech',
    stage: 'Prototype',
    problem: '',
    solution: '',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    website: '',
    founderNames: '',
    order: 0,
    active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/startups');
      const data = await res.json();
      setStartups(data.startups || []);
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
    setEditingStartup(null);
    setForm({
      name: '',
      tagline: '',
      category: 'EdTech',
      stage: 'Prototype',
      problem: '',
      solution: '',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      website: '',
      founderNames: '',
      order: startups.length + 1,
      active: true,
    });
    setShowModal(true);
  };

  const openEdit = (st: any) => {
    setEditingStartup(st);
    setForm({
      name: st.name || '',
      tagline: st.tagline || '',
      category: st.category || 'EdTech',
      stage: st.stage || 'Prototype',
      problem: st.problem || '',
      solution: st.solution || '',
      logo: st.logo || '',
      website: st.website || '',
      founderNames: (st.founders || []).map((f: any) => f.name).join(', '),
      order: st.order || 0,
      active: !!st.active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const founders = form.founderNames
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean)
        .map((name) => ({ name, role: 'Co-founder' }));

      const payload = {
        name: form.name,
        tagline: form.tagline,
        category: form.category,
        stage: form.stage,
        problem: form.problem,
        solution: form.solution,
        logo: form.logo,
        website: form.website,
        founders,
        order: form.order,
        active: form.active,
      };

      const url = editingStartup ? `/api/startups/${editingStartup._id}` : '/api/startups';
      const method = editingStartup ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        await loadData();
      } else {
        alert('Failed to save startup');
      }
    } catch (err) {
      alert('Error saving startup');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this startup?')) return;
    try {
      const res = await fetch(`/api/startups/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      alert('Failed to delete startup');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Startup Showcase Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showcase campus ventures, validate problem-solutions, and display stages.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Startup</span>
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
                  <th className="p-4">Startup</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Founders</th>
                  <th className="p-4">Sort</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {startups.map((st) => (
                  <tr key={st._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">
                      <div>{st.name}</div>
                      <span className="text-[11px] text-slate-500 font-normal line-clamp-1">
                        {st.tagline}
                      </span>
                    </td>
                    <td className="p-4 text-sky-400">{st.category}</td>
                    <td className="p-4 font-bold text-amber-300">{st.stage}</td>
                    <td className="p-4 text-slate-400">
                      {(st.founders || []).map((f: any) => f.name).join(', ') || 'N/A'}
                    </td>
                    <td className="p-4 font-mono">{st.order}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(st)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                        aria-label="Edit startup"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(st._id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        aria-label="Delete startup"
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
          aria-label={editingStartup ? 'Edit Startup' : 'Add Startup'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-2xl bg-[#0c1017] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingStartup ? 'Edit Startup' : 'Add Startup'}
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
                <label className="font-semibold text-slate-300">Startup Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Tagline *</label>
                <input
                  type="text"
                  required
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
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
                    <option value="AgriTech">AgriTech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="HealthTech">HealthTech</option>
                    <option value="FinTech">FinTech</option>
                    <option value="AI / DeepTech">AI / DeepTech</option>
                    <option value="SaaS">SaaS</option>
                    <option value="CleanTech">CleanTech</option>
                    <option value="Consumer">Consumer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Maturity Stage *</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs"
                  >
                    <option value="Ideation">Ideation</option>
                    <option value="Prototype">Prototype</option>
                    <option value="Validation">Validation</option>
                    <option value="Early Traction">Early Traction</option>
                    <option value="Scaling">Scaling</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Problem Statement *</label>
                <textarea
                  required
                  rows={2}
                  value={form.problem}
                  onChange={(e) => setForm({ ...form, problem: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Solution *</label>
                <textarea
                  required
                  rows={2}
                  value={form.solution}
                  onChange={(e) => setForm({ ...form, solution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Founders (comma separated names)</label>
                <input
                  type="text"
                  value={form.founderNames}
                  onChange={(e) => setForm({ ...form, founderNames: e.target.value })}
                  placeholder="Karthik Raju, Praveen V."
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Website URL</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Logo URL</label>
                  <input
                    type="url"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
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
                  {saving ? 'Saving...' : 'Save Startup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
