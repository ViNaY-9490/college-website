'use client';

import { useState } from 'react';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Bot,
  FileText,
  Globe,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface EventRegistrationFormProps {
  eventSlug: string;
  eventTitle: string;
  isClosed?: boolean;
  externalRegistrationLink?: string;
}

export default function EventRegistrationForm({
  eventSlug,
  eventTitle,
  isClosed = false,
  externalRegistrationLink,
}: EventRegistrationFormProps) {
  // If external link exists, user can choose between 'portal' or 'external'
  const [activeMode, setActiveMode] = useState<'portal' | 'external'>('portal');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: 'Vishnu Institute of Technology',
    department: 'Computer Science & Engineering',
    year: '2nd Year',
    teamName: '',
    remarks: '',
    website_url: '', // Honeypot trap
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // AI Idea Pitch Assistant
  const [showAiHelper, setShowAiHelper] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPitch, setAiPitch] = useState<string | null>(null);

  const handleBrainstormPitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiTopic,
          taskType: 'pitch_brainstorm',
          metadata: {
            eventTitle,
            eventSlug,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setAiPitch(data.text);
      } else {
        setAiPitch('Could not generate pitch outline right now. Please try again.');
      }
    } catch {
      setAiPitch('Network connection error while contacting Ox Alpha AI.');
    } finally {
      setAiLoading(false);
    }
  };

  if (isClosed) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-amber-500/20 text-center space-y-4 shadow-xl">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Registrations Closed
        </span>
        <h4 className="text-lg font-bold text-white">Event Registration is Closed</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          The registration deadline or maximum attendee capacity for <strong className="text-white">{eventTitle}</strong> has been reached.
        </p>

        {externalRegistrationLink && (
          <div className="pt-2">
            <a
              href={externalRegistrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
            >
              <span>Check Partner Portal Status</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`/api/events/${eventSlug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Registration failed. Please try again.');
      } else {
        setStatus('success');
        setMessage(data.message || 'Registration confirmed! A ticket record has been generated.');
      }
    } catch {
      setStatus('error');
      setMessage('A network error occurred. Please check your connectivity and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-8 rounded-3xl bg-[#0c1017] border border-emerald-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Registration Confirmed
          </span>
          <h4 className="text-2xl font-extrabold text-white">You Are All Set!</h4>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{message}</p>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 text-left space-y-2">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Attendee:</span>
            <span className="text-white font-semibold">{formData.name}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Event:</span>
            <span className="text-amber-300 font-semibold">{eventTitle}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-slate-400">Email:</span>
            <span className="text-white font-mono">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Institution:</span>
            <span className="text-slate-200">{formData.institution}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setStatus('idle');
            setFormData({
              name: '',
              email: '',
              phone: '',
              institution: 'Vishnu Institute of Technology',
              department: 'Computer Science & Engineering',
              year: '2nd Year',
              teamName: '',
              remarks: '',
              website_url: '',
            });
          }}
          className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer pt-2 inline-block"
        >
          Register another team member or attendee
        </button>
      </div>
    );
  }

  return (
    <div id="register" className="p-6 sm:p-8 rounded-3xl bg-[#0c1017] border border-white/15 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Official Event Registration</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Reserve Your Seat
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Choose your preferred method to register for <strong className="text-white">{eventTitle}</strong>.
        </p>
      </div>

      {/* Mode Switcher Tabs if External Link exists */}
      {externalRegistrationLink && (
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('portal')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'portal'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Portal Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('external')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'external'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Outside Link</span>
          </button>
        </div>
      )}

      {/* TAB 1: OUTSIDE REGISTRATION VIA HREF LINK */}
      {activeMode === 'external' && externalRegistrationLink && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-white/5 border border-amber-400/30 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                External Portal Registration
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Official registrations are also hosted on an external platform (e.g. Unstop, Devfolio, or official Google Form). Click below to launch the outside application form.
            </p>
          </div>

          <a
            href={externalRegistrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 text-center cursor-pointer group"
          >
            <span>Open Outside Registration Link</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 space-y-1 font-mono break-all">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Direct URL:</span>
            <a
              href={externalRegistrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{externalRegistrationLink}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>

          <p className="text-center text-xs text-slate-400">
            Prefer direct campus check-in?{' '}
            <button
              type="button"
              onClick={() => setActiveMode('portal')}
              className="text-amber-400 hover:underline font-semibold"
            >
              Register using the In-Portal Form
            </button>
          </p>
        </div>
      )}

      {/* TAB 2: PORTAL IN-FORM REGISTRATION */}
      {activeMode === 'portal' && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
          {/* Honeypot hidden input */}
          <input
            type="text"
            name="website_url"
            value={formData.website_url}
            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Varma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahul@vishnu.edu.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Institution / College *</label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="Vishnu Institute of Technology"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Department / Branch *</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="CSE / ECE / IT / AI&DS / Mech"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Academic Year *</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="PG / Alumni / Other">PG / Alumni / Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Team Name <span className="text-slate-500 font-normal">(Optional for Hackathons)</span>
            </label>
            <input
              type="text"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              placeholder="e.g. Team Algorand or Solo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {status === 'error' && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming Portal Registration...</span>
              </>
            ) : (
              <>
                <span>Complete In-Portal Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {externalRegistrationLink && (
            <div className="pt-2 text-center text-xs text-slate-400">
              Or prefer the external platform?{' '}
              <button
                type="button"
                onClick={() => setActiveMode('external')}
                className="text-amber-400 hover:underline font-semibold"
              >
                Use Outside Registration Link →
              </button>
            </div>
          )}
        </form>
      )}

      {/* AI Project Idea Pitch Coach (Collapsible) */}
      <div className="pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => setShowAiHelper(!showAiHelper)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white group"
        >
          <span className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Brainstorm Pitch with ECell Help Assistance</span>
          </span>
          <span className="text-[11px] text-amber-400 group-hover:underline">
            {showAiHelper ? 'Close' : 'Try AI Assistant'}
          </span>
        </button>

        {showAiHelper && (
          <div className="mt-3 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-fadeIn text-xs">
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Enter your theme or problem statement (e.g. &quot;Smart Agriculture drone monitoring&quot; or &quot;AI Health diagnostics&quot;), and ECell Help Assistance will structure a winning pitch outline for this event!
            </p>

            <form onSubmit={handleBrainstormPitch} className="flex gap-2">
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Enter theme or startup idea..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={aiLoading || !aiTopic.trim()}
                className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {aiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Generate</span>
              </button>
            </form>

            {aiPitch && (
              <div className="mt-3 p-3.5 rounded-xl bg-black/60 border border-amber-400/20 text-slate-300 space-y-2 whitespace-pre-line text-xs font-sans max-h-60 overflow-y-auto leading-relaxed">
                {aiPitch}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
