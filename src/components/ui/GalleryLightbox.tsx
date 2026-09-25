'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { X, ZoomIn, Calendar, Folder } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface GalleryLightboxProps {
  items: {
    _id: string;
    title: string;
    image: string;
    category: string;
    subCategory?: string;
    description?: string;
    date?: string | Date;
  }[];
}

export default function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [activeItem, setActiveItem] = useState<(typeof items)[0] | null>(null);

  // Extract all categories dynamically from actual items
  const categories = useMemo(() => {
    const fromItems = items.map((i) => i.category).filter(Boolean);
    const unique = Array.from(new Set(fromItems));
    return ['All', ...unique];
  }, [items]);

  // Extract available subcategories / folders for the active category
  const availableFolders = useMemo(() => {
    const relevant =
      selectedCategory === 'All'
        ? items
        : items.filter((i) => i.category === selectedCategory);

    const folders = relevant
      .map((i) => i.subCategory)
      .filter((s): s is string => Boolean(s && s !== 'General'));

    const unique = Array.from(new Set(folders));
    return unique.length > 0 ? ['All', ...unique] : [];
  }, [items, selectedCategory]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchFolder =
        selectedFolder === 'All' ||
        (item.subCategory || 'General') === selectedFolder;

      return matchCategory && matchFolder;
    });
  }, [items, selectedCategory, selectedFolder]);

  return (
    <div className="space-y-6">
      {/* Category Pills Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-[#0c1017] border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedFolder('All');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-Category / Folder Pills (shown when folders exist) */}
        {availableFolders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>Albums:</span>
            </span>
            {availableFolders.map((folder) => {
              const isSelected = selectedFolder === folder;
              const count =
                folder === 'All'
                  ? (selectedCategory === 'All'
                      ? items
                      : items.filter((i) => i.category === selectedCategory)
                    ).length
                  : items.filter(
                      (i) =>
                        (selectedCategory === 'All' || i.category === selectedCategory) &&
                        i.subCategory === folder
                    ).length;

              return (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5 hover:text-slate-200'
                  }`}
                >
                  <span>📁 {folder}</span>
                  <span className="text-[10px] opacity-75 font-sans font-bold">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Masonry-style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-2xl bg-[#0c1017] border border-white/10 overflow-hidden cursor-pointer hover:border-white/25 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1"
          >
            <div className="relative h-60 w-full overflow-hidden bg-slate-900">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                  {item.category}
                </span>
                {item.subCategory && item.subCategory !== 'General' && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-amber-400 text-slate-950 shadow-sm">
                    📁 {item.subCategory}
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-slate-300 line-clamp-1">{item.description}</p>
                  )}
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-md">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 p-8 rounded-3xl bg-[#0c1017] border border-white/10">
          <p className="text-sm text-slate-400">No media available in this category or album.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0c1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-400">{activeItem.category}</span>
                  {activeItem.subCategory && activeItem.subCategory !== 'General' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                      📁 {activeItem.subCategory}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{activeItem.title}</h3>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-[55vh] sm:h-[65vh] w-full bg-black">
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {activeItem.description && (
              <div className="p-4 border-t border-white/10 bg-[#090b10] text-xs text-slate-300">
                {activeItem.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
