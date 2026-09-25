'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Calendar, BookOpen, Rocket, FileText, ArrowRight, Loader2 } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    events: any[];
    blogs: any[];
    startups: any[];
    initiatives: any[];
    resources: any[];
  }>({
    events: [],
    blogs: [],
    startups: [],
    initiatives: [],
    resources: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ events: [], blogs: [], startups: [], initiatives: [], resources: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.results) {
          setResults(data.results);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.events.length +
    results.blogs.length +
    results.startups.length +
    results.initiatives.length +
    results.resources.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0c1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, articles, startups, initiatives, guides..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
          />
          {loading && <Loader2 className="w-4 h-4 text-sky-400 animate-spin shrink-0" />}
          {query && !loading && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {query.trim().length >= 2 && !loading && totalResults === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for hackathons, startups, incubation, or guides.
              </p>
            </div>
          )}

          {/* Events */}
          {results.events.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Events ({results.events.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.events.map((event) => (
                  <Link
                    key={event._id}
                    href={`/events/${event.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-amber-300">
                        {event.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{event.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Startups */}
          {results.startups.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
                <Rocket className="w-3.5 h-3.5" />
                <span>Startups ({results.startups.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.startups.map((st) => (
                  <Link
                    key={st._id}
                    href="/startups"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-sky-300">
                        {st.name} <span className="text-xs text-slate-500 font-normal">({st.stage})</span>
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{st.tagline}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Blogs / Insights */}
          {results.blogs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Insights & Articles ({results.blogs.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.blogs.map((b) => (
                  <Link
                    key={b._id}
                    href={`/blogs/${b.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-emerald-300">
                        {b.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{b.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {results.resources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Resources & Guides ({results.resources.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.resources.map((r) => (
                  <Link
                    key={r._id}
                    href="/resources"
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-purple-300">
                        {r.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{r.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Default suggestion hints */}
          {query.trim().length < 2 && (
            <div className="py-6 text-center">
              <p className="text-xs text-slate-500 mb-4">Quick search across the ecosystem</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['E-Summit', 'Hackathon', 'Incubation', 'Pitch Deck', 'KrishiSense', 'Student Grants'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
