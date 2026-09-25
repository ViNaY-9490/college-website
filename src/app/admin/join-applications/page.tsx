'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Trash2,
  CheckCircle2,
  Loader2,
  Filter,
  ExternalLink,
  Eye,
  Mail,
  Crown,
  Shield,
  UserCheck,
  X,
  Clock,
  Sparkles,
  Phone,
  Send,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminJoinApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDomain, setFilterDomain] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Selected candidate for full detail dossier modal
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Email modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  const domains = [
    'Event Management',
    'Offstage',
    'Sponsorship',
    'Videography',
    'Communication',
    'Design',
    'Logistics & Operations',
    'Marketing & Outreach',
    'PR & HR',
    'R&D and Web Development',
    'Content & Media',
    'Finance',
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDomain !== 'All') params.append('domain', filterDomain);
      if (filterStatus !== 'All') params.append('status', filterStatus);

      const res = await fetch(`/api/join?${params.toString()}`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterDomain, filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/join/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app._id === id ? { ...app, status } : app))
        );
        if (selectedApp && selectedApp._id === id) {
          setSelectedApp((prev: any) => ({ ...prev, status }));
        }
      }
    } catch {
      alert('Failed to update applicant status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this application record?')) return;
    try {
      const res = await fetch(`/api/join/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
        if (selectedApp?._id === id) setSelectedApp(null);
      }
    } catch {
      alert('Failed to delete application');
    }
  };

  const handleOpenEmailModal = (app: any) => {
    setSelectedApp(app);
    setEmailSubject(`Update regarding your E-Cell VITB Application - ${app.roleApplied || 'Role'}`);
    setEmailMessage(
      `Dear ${app.name},\n\nThank you for applying for the ${app.roleApplied || 'Associate'} position in the ${app.primaryDomain} team at E-Cell, Vishnu Institute of Technology.\n\nWe were impressed by your application and would like to invite you for an interview session.\n\nPlease let us know your availability.\n\nBest regards,\nRecruitment Team\nE-Cell VITB`
    );
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedApp) return;
    setSendingEmail(true);
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmails: [selectedApp.email],
          subject: emailSubject,
          message: emailMessage,
          templateType: 'custom_candidate',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to dispatch email.');
      } else {
        alert(`Email successfully queued/sent to ${selectedApp.email}!`);
        setEmailModalOpen(false);
      }
    } catch {
      alert('Network error while dispatching email.');
    } finally {
      setSendingEmail(false);
    }
  };

  const filteredList = applications.filter((app) => {
    if (filterRole !== 'All' && app.roleApplied !== filterRole) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Recruitment & Candidate Dossiers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review detailed candidate applications, leadership answers, portfolios, and trigger custom emails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-amber-400">
            Total Candidates: {filteredList.length}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/10 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300">Team:</span>
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
          >
            <option value="All">All 12 Teams</option>
            {domains.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Target Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
          >
            <option value="All">All Roles</option>
            <option value="Lead">Lead</option>
            <option value="Co-Lead">Co-Lead</option>
            <option value="Associate">Associate</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewed">Interviewed</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl bg-[#0c1017] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-white/10">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Roll & Branch</th>
                <th className="p-4">Target Role</th>
                <th className="p-4">Primary Team</th>
                <th className="p-4">Applied On</th>
                <th className="p-4">Pipeline Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
                    Loading applications...
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                filteredList.map((app) => (
                  <tr key={app._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{app.name}</div>
                      <div className="text-[11px] text-slate-400">{app.email}</div>
                      <div className="text-[11px] text-slate-500">{app.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-amber-300 font-bold">{app.rollNumber}</div>
                      <div className="text-slate-400">{app.department}</div>
                      <div className="text-[10px] text-slate-500">{app.year}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          app.roleApplied === 'Lead'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : app.roleApplied === 'Co-Lead'
                            ? 'bg-orange-400/20 text-orange-300 border border-orange-400/30'
                            : 'bg-sky-400/20 text-sky-300 border border-sky-400/30'
                        }`}
                      >
                        {app.roleApplied === 'Lead' && <Crown className="w-3 h-3" />}
                        {app.roleApplied === 'Co-Lead' && <Shield className="w-3 h-3" />}
                        {app.roleApplied === 'Associate' && <UserCheck className="w-3 h-3" />}
                        {app.roleApplied || 'Associate'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-200">{app.primaryDomain}</span>
                      {app.secondaryDomain && (
                        <div className="text-[10px] text-slate-500">2nd: {app.secondaryDomain}</div>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="p-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          app.status === 'selected'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : app.status === 'shortlisted'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : app.status === 'interviewed'
                            ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                            : app.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-white/10 text-slate-300 border-white/10'
                        }`}
                      >
                        <option value="pending" className="bg-[#0c1017]">Pending</option>
                        <option value="shortlisted" className="bg-[#0c1017]">Shortlisted</option>
                        <option value="interviewed" className="bg-[#0c1017]">Interviewed</option>
                        <option value="selected" className="bg-[#0c1017]">Selected</option>
                        <option value="rejected" className="bg-[#0c1017]">Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          title="View Complete Candidate Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEmailModal(app)}
                          className="p-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 transition-colors"
                          title="Send Custom Mail"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No applications found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL CANDIDATE DOSSIER MODAL */}
      {selectedApp && !emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1017] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">{selectedApp.name}</h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedApp.roleApplied === 'Lead'
                        ? 'bg-amber-400/20 text-amber-300'
                        : selectedApp.roleApplied === 'Co-Lead'
                        ? 'bg-orange-400/20 text-orange-300'
                        : 'bg-sky-400/20 text-sky-300'
                    }`}
                  >
                    {selectedApp.roleApplied || 'Associate'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Roll: <span className="font-mono text-amber-400 font-bold">{selectedApp.rollNumber}</span> • {selectedApp.department} ({selectedApp.year})
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact & Availability Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-500 block">Email</span>
                <a href={`mailto:${selectedApp.email}`} className="text-white hover:text-amber-400 font-medium break-all">
                  {selectedApp.email}
                </a>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-500 block">WhatsApp / Phone</span>
                <span className="text-white font-medium">{selectedApp.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-500 block">Weekly Commitment</span>
                <span className="text-amber-400 font-bold">{selectedApp.weeklyCommitment || '5-10 hrs/week'}</span>
              </div>
            </div>

            {/* Team Preferences */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Primary Team Selection:</span>
                <span className="font-bold text-white text-sm">{selectedApp.primaryDomain}</span>
              </div>
              {selectedApp.secondaryDomain && (
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-slate-400">Secondary Preference:</span>
                  <span className="text-slate-300">{selectedApp.secondaryDomain}</span>
                </div>
              )}
            </div>

            {/* DYNAMIC ROLE & DOMAIN SPECIFIC ANSWERS */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Candidate Responses & Role Questions
              </h3>

              {/* Leadership specific answers */}
              {selectedApp.roleSpecificAnswers?.leadershipExperience && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1 text-xs">
                  <span className="font-bold text-amber-300 block">1. Leadership & Committee Experience:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.roleSpecificAnswers.leadershipExperience}
                  </p>
                </div>
              )}

              {selectedApp.roleSpecificAnswers?.teamVision && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1 text-xs">
                  <span className="font-bold text-amber-300 block">2. Strategic Vision for Team in 2026:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.roleSpecificAnswers.teamVision}
                  </p>
                </div>
              )}

              {selectedApp.roleSpecificAnswers?.conflictHandling && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1 text-xs">
                  <span className="font-bold text-amber-300 block">3. Conflict & Deadline Resolution:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.roleSpecificAnswers.conflictHandling}
                  </p>
                </div>
              )}

              {/* Associate specific answers */}
              {selectedApp.roleSpecificAnswers?.coreSkills && (
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-1 text-xs">
                  <span className="font-bold text-sky-300 block">Skills & Strengths Offered:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.roleSpecificAnswers.coreSkills}
                  </p>
                </div>
              )}

              {selectedApp.roleSpecificAnswers?.learningGoals && (
                <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-1 text-xs">
                  <span className="font-bold text-sky-300 block">Learning & Growth Goals:</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.roleSpecificAnswers.learningGoals}
                  </p>
                </div>
              )}

              {/* Technical Links */}
              {(selectedApp.roleSpecificAnswers?.githubUrl || selectedApp.roleSpecificAnswers?.techStack) && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <span className="font-bold text-white block">Technical Profiles:</span>
                  {selectedApp.roleSpecificAnswers.githubUrl && (
                    <a
                      href={selectedApp.roleSpecificAnswers.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-400 hover:underline mr-4"
                    >
                      <span>GitHub: {selectedApp.roleSpecificAnswers.githubUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedApp.roleSpecificAnswers.techStack && (
                    <p className="text-slate-400 mt-1">
                      Stack: <span className="text-slate-200">{selectedApp.roleSpecificAnswers.techStack}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Portfolio / Reel links */}
              {selectedApp.roleSpecificAnswers?.portfolioLink && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="text-slate-400 block mb-1">Portfolio:</span>
                  <a
                    href={selectedApp.roleSpecificAnswers.portfolioLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    <span>{selectedApp.roleSpecificAnswers.portfolioLink}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              {selectedApp.roleSpecificAnswers?.videoReelLink && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <span className="text-slate-400 block mb-1">Videography Reel:</span>
                  <a
                    href={selectedApp.roleSpecificAnswers.videoReelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline inline-flex items-center gap-1 break-all"
                  >
                    <span>{selectedApp.roleSpecificAnswers.videoReelLink}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              {/* Why Join */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
                <span className="font-bold text-white block">Motivation for Joining E-Cell VITB:</span>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedApp.whyJoin}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Change Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp._id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-semibold"
                >
                  <option value="pending" className="bg-[#0c1017]">Pending</option>
                  <option value="shortlisted" className="bg-[#0c1017]">Shortlisted</option>
                  <option value="interviewed" className="bg-[#0c1017]">Interviewed</option>
                  <option value="selected" className="bg-[#0c1017]">Selected</option>
                  <option value="rejected" className="bg-[#0c1017]">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEmailModal(selectedApp)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Mail</span>
                </button>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs hover:bg-white/15"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT CUSTOM EMAIL DISPATCH MODAL */}
      {emailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c1017] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Dispatch Custom Mail</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Recipient: <span className="text-white font-medium">{selectedApp.name}</span> ({selectedApp.email})
                </p>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Subject *</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300 block">Message Body *</label>
                <textarea
                  rows={8}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sendingEmail || !emailSubject || !emailMessage}
                onClick={handleSendEmail}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 disabled:opacity-50 transition-colors"
              >
                {sendingEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Mail</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
