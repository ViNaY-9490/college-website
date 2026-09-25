'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
  Sparkles,
  FileText,
  UserCheck,
  Calendar,
} from 'lucide-react';

export default function AdminEmailBroadcastPage() {
  const [recipientType, setRecipientType] = useState<
    'custom' | 'join_applicants' | 'event_attendees' | 'newsletter'
  >('custom');

  const [customEmails, setCustomEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  // AI Email Drafter (Ox Alpha)
  const [showAiDrafter, setShowAiDrafter] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Check for pre-filled emails from Event-wise or All Contacts table
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ecell_broadcast_emails');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecipientType('custom');
          setCustomEmails(parsed.join(', '));
          sessionStorage.removeItem('ecell_broadcast_emails');
        }
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  const handleGenerateAiEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          taskType: 'email_draft',
          metadata: {
            audience: recipientType === 'join_applicants' ? 'Recruitment Applicants' : recipientType === 'event_attendees' ? 'Event Attendees' : 'Campus Community',
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        const text: string = data.text;
        // Parse subject if AI generated "Subject: ..."
        const subjectMatch = text.match(/^Subject:\s*(.*)/im);
        if (subjectMatch) {
          setSubject(subjectMatch[1].trim());
          setMessage(text.replace(/^Subject:.*\n+/im, '').trim());
        } else {
          setMessage(text.trim());
        }
        setShowAiDrafter(false);
        setAiPrompt('');
      } else {
        alert(data.error || 'Failed to generate email draft');
      }
    } catch {
      alert('Error connecting to Ox Alpha AI');
    } finally {
      setAiGenerating(false);
    }
  };

  // Loaded recipient lists for preview
  const [recipientList, setRecipientList] = useState<string[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);

  // Pre-made template options
  const templates = [
    {
      name: 'Interview Shortlist Invitation',
      subject: 'Invitation for E-Cell VITB Leadership & Domain Interview',
      body: `Dear Candidate,\n\nWe have reviewed your application for the 2026 recruitment cohort at E-Cell, Vishnu Institute of Technology.\n\nWe are pleased to invite you for an offline personal interview with our domain leads and faculty convenors:\n\nVenue: E-Cell Innovation Lab / Seminar Hall, VITB\nTiming: 4:30 PM onwards\nPlease bring your college ID and proof of projects/portfolio.\n\nBest regards,\nRecruitment Team\nE-Cell VITB`,
    },
    {
      name: 'Event Registration Confirmation',
      subject: 'Seat Confirmed: Ideathon 2026 at Vishnu Institute of Technology',
      body: `Dear Innovator,\n\nYour registration for Ideathon 2026: Campus Venture Pitch is officially confirmed!\n\nEvent Schedule:\nDate: April 10, 2026 | 09:30 AM\nVenue: Main Auditorium, Vishnu Institute of Technology, Bhimavaram\n\nPlease arrive 15 minutes before the opening keynote for credential check-in.\n\nBest regards,\nOrganizing Committee\nE-Cell VITB`,
    },
    {
      name: 'General Campus Announcement',
      subject: 'Important Announcement from E-Cell VITB: New Initiatives',
      body: `Dear Student & Founder Community,\n\nWe are excited to share key updates on upcoming workshops, venture prototyping credits, and incubation grants available at Vishnu Institute of Technology.\n\nStay tuned to our portal for dates and speaker announcements.\n\nBest regards,\nE-Cell VITB\necellvitb.in`,
    },
  ];

  const applyTemplate = (tpl: (typeof templates)[0]) => {
    setSubject(tpl.subject);
    setMessage(tpl.body);
  };

  // Fetch recipients based on selected type
  useEffect(() => {
    const fetchRecipients = async () => {
      if (recipientType === 'custom') {
        setRecipientList(
          customEmails
            .split(',')
            .map((e) => e.trim().toLowerCase())
            .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
        );
        return;
      }

      setLoadingRecipients(true);
      try {
        if (recipientType === 'join_applicants') {
          const res = await fetch('/api/join');
          const data = await res.json();
          const emails = (data.applications || []).map((a: any) => a.email);
          setRecipientList(Array.from(new Set(emails)));
        } else if (recipientType === 'event_attendees') {
          const res = await fetch('/api/admin/registrations');
          const data = await res.json();
          const emails = (data.registrations || []).map((r: any) => r.email);
          setRecipientList(Array.from(new Set(emails)));
        } else if (recipientType === 'newsletter') {
          const res = await fetch('/api/newsletter');
          const data = await res.json();
          const emails = (data.subscribers || []).map((s: any) => s.email);
          setRecipientList(Array.from(new Set(emails)));
        }
      } catch (err) {
        console.error('Failed to load recipient pool:', err);
      } finally {
        setLoadingRecipients(false);
      }
    };

    fetchRecipients();
  }, [recipientType, customEmails]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientList.length === 0) {
      alert('Please specify at least one valid recipient.');
      return;
    }

    if (!confirm(`Are you sure you want to dispatch this email to ${recipientList.length} recipient(s)?`)) {
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmails: recipientList,
          subject,
          message,
          templateType: recipientType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setFeedback(data.error || 'Failed to dispatch email.');
      } else {
        setStatus('success');
        setFeedback(data.message || `Successfully sent email to ${data.deliveredCount} recipients!`);
      }
    } catch {
      setStatus('error');
      setFeedback('A network error occurred while dispatching email.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Mail className="w-6 h-6 text-amber-400" />
          <span>Email Dispatcher & Broadcast Center</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Send personalized or bulk custom emails to recruitment applicants, event attendees, or newsletter subscribers.
        </p>
      </div>

      {status === 'success' && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{feedback}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSend} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Message */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-white/10 space-y-6 shadow-xl">
          {/* Recipient Audience Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              1. Select Recipient Audience *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { id: 'custom', label: 'Custom List / Individual', icon: Users },
                { id: 'join_applicants', label: 'All Join Applicants', icon: UserCheck },
                { id: 'event_attendees', label: 'Event Attendees', icon: Calendar },
                { id: 'newsletter', label: 'Subscribers', icon: Mail },
              ].map((aud) => {
                const Icon = aud.icon;
                const active = recipientType === aud.id;
                return (
                  <button
                    type="button"
                    key={aud.id}
                    onClick={() => setRecipientType(aud.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                      active
                        ? 'bg-amber-400/15 border-amber-400/80 text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span className="font-semibold text-[11px] leading-tight">{aud.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* If custom is selected, show email inputs */}
          {recipientType === 'custom' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Recipient Email Addresses (comma separated for multiple) *
              </label>
              <textarea
                rows={2}
                required
                value={customEmails}
                onChange={(e) => setCustomEmails(e.target.value)}
                placeholder="student@vishnu.edu.in, founder@startup.com, info.ecell@vishnu.edu.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          )}

          {/* Ox Alpha AI Broadcast Drafter */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-transparent border border-amber-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ox Alpha AI Email Drafter</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAiDrafter(!showAiDrafter)}
                className="text-[11px] font-semibold text-amber-400 hover:underline"
              >
                {showAiDrafter ? 'Hide Drafter' : 'Draft with AI →'}
              </button>
            </div>

            {showAiDrafter && (
              <div className="space-y-2 pt-2 animate-fadeIn">
                <p className="text-[11px] text-slate-400">
                  Tell Ox Alpha what email announcement or update you want to send. The AI will craft the formal subject line and body automatically.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Announce Ideathon 2026 reporting time at 9:00 AM in Main Auditorium with ID cards..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    disabled={aiGenerating || !aiPrompt.trim()}
                    onClick={handleGenerateAiEmail}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
                  >
                    {aiGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Generate Draft</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Pre-made Templates */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Or Choose a Quick Template Preset:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {templates.map((tpl, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => applyTemplate(tpl)}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Important Update regarding E-Cell VITB Hackathon"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Email Message Content *</label>
            <textarea
              rows={10}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your official email message..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 font-mono leading-relaxed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading' || recipientList.length === 0}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Broadcasting Email...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Broadcast Email to {recipientList.length} Recipient(s)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Audience Pool Summary & Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Recipients Pool</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                {recipientList.length} Target(s)
              </span>
            </h3>

            {loadingRecipients ? (
              <div className="py-6 text-center text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin mx-auto text-amber-400 mb-1" />
                Loading target emails...
              </div>
            ) : recipientList.length > 0 ? (
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {recipientList.slice(0, 50).map((email, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white/5 text-[11px] font-mono text-slate-300 truncate"
                  >
                    {email}
                  </div>
                ))}
                {recipientList.length > 50 && (
                  <p className="text-[10px] text-slate-500 pt-1 text-center">
                    + {recipientList.length - 50} more recipients
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No recipients selected yet. Choose an audience or enter emails.
              </p>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-400">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Anti-Spam & Delivery Notice</span>
            </h4>
            <p className="leading-relaxed">
              Emails dispatched from the admin panel are logged in the immutable Audit Trail with the administrator ID and timestamp.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
