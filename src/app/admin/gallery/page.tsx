'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Image as ImageIcon,
  X,
  Folder,
  FolderPlus,
  Grid,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Search,
} from 'lucide-react';
import Image from 'next/image';

interface GalleryItemData {
  _id: string;
  title: string;
  image: string;
  category: string;
  subCategory?: string;
  description?: string;
  order: number;
  active: boolean;
  createdAt?: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);

  // View state: 'folders' or 'photos'
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'folders' | 'photos'>('folders');

  // Form state
  const [form, setForm] = useState({
    title: '',
    image: '',
    category: 'Hackathons',
    subCategory: 'Code-Verse',
    isCustomCategory: false,
    customCategory: '',
    isCustomSubCategory: false,
    customSubCategory: '',
    description: '',
    order: 0,
    active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
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
  }, []);

  // Dynamically extract all unique Categories & Sub-categories from data
  const existingCategories = useMemo(() => {
    const defaultCats = ['Hackathons', 'Events', 'Workshops', 'Team', 'Community', 'Speakers'];
    const fromItems = items.map((i) => i.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...fromItems]));
  }, [items]);

  const existingSubCategories = useMemo(() => {
    const defaultSubs = ['Code-Verse', 'Ideathon 2026', 'Startup Expo', 'General'];
    const fromItems = items.map((i) => i.subCategory).filter(Boolean) as string[];
    return Array.from(new Set([...defaultSubs, ...fromItems]));
  }, [items]);

  // Compute folder stats
  const folderStats = useMemo(() => {
    const map = new Map<string, { category: string; subCategory: string; count: number; coverImage: string }>();

    items.forEach((item) => {
      const cat = item.category || 'Events';
      const sub = item.subCategory || 'General';
      const key = `${cat}___${sub}`;

      if (!map.has(key)) {
        map.set(key, { category: cat, subCategory: sub, count: 1, coverImage: item.image });
      } else {
        const curr = map.get(key)!;
        curr.count += 1;
      }
    });

    return Array.from(map.values());
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSub = activeFolder === 'All' || (item.subCategory || 'General') === activeFolder;
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSub && matchSearch;
    });
  }, [items, activeCategory, activeFolder, searchQuery]);

  const openNew = (presetCategory?: string, presetSubCategory?: string) => {
    setEditingItem(null);
    setForm({
      title: '',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      category: presetCategory && presetCategory !== 'All' ? presetCategory : 'Hackathons',
      subCategory: presetSubCategory && presetSubCategory !== 'All' ? presetSubCategory : 'Code-Verse',
      isCustomCategory: false,
      customCategory: '',
      isCustomSubCategory: false,
      customSubCategory: '',
      description: '',
      order: items.length + 1,
      active: true,
    });
    setShowModal(true);
  };

  const openEdit = (item: GalleryItemData) => {
    setEditingItem(item);
    const cat = item.category || 'Events';
    const sub = item.subCategory || 'General';

    setForm({
      title: item.title || '',
      image: item.image || '',
      category: cat,
      subCategory: sub,
      isCustomCategory: !existingCategories.includes(cat),
      customCategory: !existingCategories.includes(cat) ? cat : '',
      isCustomSubCategory: !existingSubCategories.includes(sub),
      customSubCategory: !existingSubCategories.includes(sub) ? sub : '',
      description: item.description || '',
      order: item.order ?? 0,
      active: !!item.active,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const finalCategory = form.isCustomCategory && form.customCategory.trim()
        ? form.customCategory.trim()
        : form.category;

      const finalSubCategory = form.isCustomSubCategory && form.customSubCategory.trim()
        ? form.customSubCategory.trim()
        : form.subCategory.trim() || 'General';

      const payload = {
        title: form.title,
        image: form.image,
        category: finalCategory,
        subCategory: finalSubCategory,
        description: form.description,
        order: form.order,
        active: form.active,
      };

      const url = editingItem ? `/api/gallery/${editingItem._id}` : '/api/gallery';
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
        const data = await res.json();
        alert(data.error || 'Failed to save gallery item');
      }
    } catch (err) {
      alert('Error saving gallery item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              Media CMS
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Gallery & Custom Folder Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize event snapshots into custom categories and folder-like albums (e.g. <strong className="text-amber-300">Code-Verse</strong>, <strong className="text-amber-300">Ideathon 2026</strong>, or custom tags).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openNew(activeCategory, activeFolder)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb & Navigation Controls */}
      <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs flex-wrap w-full md:w-auto">
          <button
            onClick={() => {
              setActiveCategory('All');
              setActiveFolder('All');
            }}
            className={`font-semibold transition-colors cursor-pointer ${
              activeCategory === 'All' && activeFolder === 'All'
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Media
          </button>

          {activeCategory !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button
                onClick={() => setActiveFolder('All')}
                className={`font-semibold cursor-pointer ${
                  activeFolder === 'All' ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {activeCategory}
              </button>
            </>
          )}

          {activeFolder !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold font-mono">
                📁 {activeFolder}
              </span>
            </>
          )}
        </div>

        {/* View Toggle & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search media or folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('folders')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'folders' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Folder View"
            >
              <Folder className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('photos')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'photos' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading gallery assets...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* FOLDER ALBUMS SECTION (Shown when viewMode is 'folders' and activeFolder === 'All') */}
          {viewMode === 'folders' && activeFolder === 'All' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Custom Folders & Albums ({folderStats.length})
                </h3>
                <span className="text-xs text-slate-500">Click any folder to view its photos</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {folderStats.map((f, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveCategory(f.category);
                      setActiveFolder(f.subCategory);
                    }}
                    className="p-5 rounded-2xl bg-[#0c1017] border border-white/10 hover:border-amber-400/50 hover:bg-[#101520] transition-all cursor-pointer group shadow-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Folder className="w-5 h-5 fill-amber-400/20" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                        {f.count} {f.count === 1 ? 'photo' : 'photos'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                        {f.subCategory}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Category: <span className="text-slate-300 font-medium">{f.category}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-amber-400/80 group-hover:text-amber-300">
                      <span>Open Folder</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}

                {/* Create New Folder Card */}
                <div
                  onClick={() => {
                    openNew();
                    setForm((prev) => ({ ...prev, isCustomSubCategory: true }));
                  }}
                  className="p-5 rounded-2xl bg-[#0c1017]/50 border border-dashed border-white/20 hover:border-amber-400/50 hover:bg-[#101520] transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/30 flex items-center justify-center transition-colors">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                      + Create Custom Folder
                    </h4>
                    <p className="text-[10px] text-slate-500">e.g. Code-Verse, E-Summit 2026</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVE FOLDER BANNER (Shown when drilled down into a folder) */}
          {activeFolder !== 'All' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Folder: <span className="text-amber-300">{activeFolder}</span> ({filteredItems.length} photos)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Category: {activeCategory}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openNew(activeCategory, activeFolder)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  + Upload to this Folder
                </button>
                <button
                  onClick={() => {
                    setActiveFolder('All');
                    setActiveCategory('All');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  Back to All Folders
                </button>
              </div>
            </div>
          )}

          {/* PHOTOS GRID */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Photos ({filteredItems.length})
              </h3>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-[#0c1017] border border-white/10 space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Photos Found</h4>
                <p className="text-xs text-slate-400">
                  No images match the selected folder or search query. Click Upload to add your first photo!
                </p>
                <button
                  onClick={() => openNew(activeCategory, activeFolder)}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Upload Photo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-3xl bg-[#0c1017] border border-white/10 overflow-hidden space-y-3 hover:border-white/20 transition-all shadow-md group"
                  >
                    <div className="relative h-44 w-full bg-slate-900">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-amber-300 border border-white/10 backdrop-blur-sm">
                          {item.category}
                        </span>
                        {item.subCategory && item.subCategory !== 'General' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/90 text-slate-950 shadow-sm">
                            📁 {item.subCategory}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-1 flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.description || 'No description'}
                        </p>
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Folder: {item.subCategory || 'General'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                          aria-label="Edit gallery item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          aria-label="Delete gallery item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* UPLOAD / EDIT MODAL WITH CUSTOM FOLDER / CATEGORY CREATION */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={editingItem ? 'Edit Media' : 'Upload Media to Gallery'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            className="w-full max-w-lg bg-[#0c1017] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? 'Edit Media Details' : 'Upload Media to Gallery'}
                </h3>
                <p className="text-xs text-slate-400">
                  Organize into categories and custom folders/albums.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Photo Title */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Photo Title / Caption *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Code-Verse 2026 Opening Hackathon Pitch"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Main Category Selection / Creation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-300">Main Category *</label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        isCustomCategory: !form.isCustomCategory,
                        customCategory: '',
                      })
                    }
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer font-medium"
                  >
                    {form.isCustomCategory ? '← Choose Existing Category' : '+ Create Custom Category'}
                  </button>
                </div>

                {form.isCustomCategory ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom category (e.g. Hackathons, E-Summit, Competitions)"
                    value={form.customCategory}
                    onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                ) : (
                  <select
                    value={form.category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setForm({ ...form, isCustomCategory: true, customCategory: '' });
                      } else {
                        setForm({ ...form, category: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Create New Category...</option>
                  </select>
                )}
              </div>

              {/* Sub-Category / Custom Folder / Album */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Folder className="w-3.5 h-3.5 text-amber-400" />
                    <span>Folder / Album (Sub-Category) *</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        isCustomSubCategory: !form.isCustomSubCategory,
                        customSubCategory: '',
                      })
                    }
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer font-medium"
                  >
                    {form.isCustomSubCategory ? '← Choose Existing Folder' : '+ Create New Folder / Album'}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400">
                  Folder groups your photos (e.g. <strong className="text-white">Code-Verse</strong>, <strong className="text-white">Ideathon Pitch Day</strong>, or <strong className="text-white">Workshop Day 1</strong>).
                </p>

                {form.isCustomSubCategory ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom folder name (e.g. Code-Verse, E-Summit 2026)"
                    value={form.customSubCategory}
                    onChange={(e) => setForm({ ...form, customSubCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                ) : (
                  <select
                    value={form.subCategory}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setForm({ ...form, isCustomSubCategory: true, customSubCategory: '' });
                      } else {
                        setForm({ ...form, subCategory: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {existingSubCategories.map((sub) => (
                      <option key={sub} value={sub}>
                        📁 {sub}
                      </option>
                    ))}
                    <option value="__custom__">+ Create New Folder / Album...</option>
                  </select>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Brief context about this photo..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Sort Order (Safe against NaN) */}
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

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
