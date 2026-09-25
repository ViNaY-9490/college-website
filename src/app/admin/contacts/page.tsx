'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2, Loader2, Clock, Phone, Building } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminContactsPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq._id === id ? { ...inq, status } : inq))
        );
      }
    } catch (err) {
      alert('Failed to update inquiry status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      }
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Contact Inquiries</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review incoming questions, partnership proposals, and sponsorship outreach.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{inq.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-amber-300">
                      {inq.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="text-slate-300">{inq.email}</span>
                    {inq.phone && <span>• {inq.phone}</span>}
                    {inq.organization && <span>• Org: {inq.organization}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <select
                    value={inq.status}
                    onChange={(e) => updateStatus(inq._id, e.target.value)}
                    className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white"
                  >
                    <option value="new">new</option>
                    <option value="in_review">in_review</option>
                    <option value="responded">responded</option>
                    <option value="archived">archived</option>
                  </select>

                  <button
                    onClick={() => handleDelete(inq._id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    aria-label="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Subject: {inq.subject}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {inq.message}
                </p>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>Received: {formatDate(inq.createdAt)}</span>
                <a
                  href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Reply via Email →
                </a>
              </div>
            </div>
          ))}

          {inquiries.length === 0 && (
            <div className="text-center py-20 p-8 rounded-3xl bg-[#0c1017] border border-white/10 text-slate-400 text-xs">
              No inquiries in the database yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
