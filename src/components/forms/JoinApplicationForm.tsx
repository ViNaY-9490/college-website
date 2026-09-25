'use client';

import { useState, useEffect } from 'react';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Crown,
  UserCheck,
  Code2,
  Palette,
  Video,
  DollarSign,
  Calendar,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface JoinApplicationFormProps {
  selectedDomain?: string;
  onDomainChange?: (domain: string) => void;
  targetRole?: 'Lead' | 'Co-Lead' | 'Associate';
}

export default function JoinApplicationForm({
  selectedDomain = 'Event Management',
  onDomainChange,
  targetRole,
}: JoinApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    year: '2nd Year',
    roleApplied: (targetRole || 'Associate') as 'Lead' | 'Co-Lead' | 'Associate',
    primaryDomain: selectedDomain || 'Event Management',
    secondaryDomain: 'Offstage',
    weeklyCommitment: targetRole === 'Lead' || targetRole === 'Co-Lead' ? '10-15+ hrs/week' : '5-10 hrs/week',
    whyJoin: '',
    priorExperience: '',
    portfolioUrl: '',
    website_url: '', // Honeypot trap
    // Dynamic role & domain answers
    roleSpecificAnswers: {
      leadershipExperience: '',
      teamVision: '',
      conflictHandling: '',
      coreSkills: '',
      learningGoals: '',
      techStack: '',
      githubUrl: '',
      portfolioLink: '',
      videoReelLink: '',
      targetSponsors: '',
      eventExperience: '',
      writingSample: '',
    },
  });

  useEffect(() => {
    if (selectedDomain && selectedDomain !== formData.primaryDomain) {
      setFormData((prev) => ({
        ...prev,
        primaryDomain: selectedDomain,
      }));
    }
  }, [selectedDomain]);

  useEffect(() => {
    if (targetRole && targetRole !== formData.roleApplied) {
      setFormData((prev) => ({
        ...prev,
        roleApplied: targetRole,
        weeklyCommitment: targetRole === 'Associate' ? '5-10 hrs/week' : '10-15+ hrs/week',
      }));
    }
  }, [targetRole]);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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

  const handleRoleChange = (role: 'Lead' | 'Co-Lead' | 'Associate') => {
    setFormData((prev) => ({
      ...prev,
      roleApplied: role,
      weeklyCommitment: role === 'Associate' ? '5-10 hrs/week' : '10-15+ hrs/week',
    }));
  };

  const handleAnswerChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      roleSpecificAnswers: {
        ...prev.roleSpecificAnswers,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to submit application. Please check your inputs.');
      } else {
        setStatus('success');
        setMessage(data.message || 'Application received successfully!');
      }
    } catch {
      setStatus('error');
      setMessage('A network error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0c1017] border border-emerald-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Application Submitted!</h3>
        <p className="text-slate-300 text-sm max-w-lg mx-auto">{message}</p>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 max-w-md mx-auto text-left space-y-1.5">
          <p><span className="text-slate-400">Applicant:</span> {formData.name}</p>
          <p><span className="text-slate-400">Roll Number:</span> {formData.rollNumber.toUpperCase()}</p>
          <p><span className="text-slate-400">Target Role:</span> <span className="font-bold text-amber-400">{formData.roleApplied}</span></p>
          <p><span className="text-slate-400">Primary Team:</span> {formData.primaryDomain}</p>
          <p><span className="text-slate-400">Email:</span> {formData.email}</p>
        </div>
        <p className="text-xs text-slate-500">
          Our faculty convenors and domain leads will review your responses and reach out via email for the interview round.
        </p>
      </div>
    );
  }

  const isLeadership = formData.roleApplied === 'Lead' || formData.roleApplied === 'Co-Lead';

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-10 rounded-3xl bg-[#0c1017] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden"
    >
      {/* Top Banner indicating dynamic mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
            Recruitment Cohort 2026
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            E-Cell VITB Candidate Application
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select your target role and department. The application form adapts dynamically to your selection.
          </p>
        </div>

        {/* Live Role Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
          {isLeadership ? (
            <Crown className="w-4 h-4 text-amber-400" />
          ) : (
            <UserCheck className="w-4 h-4 text-sky-400" />
          )}
          <span className="text-xs font-bold text-white">
            Applying as: <span className={isLeadership ? 'text-amber-400' : 'text-sky-400'}>{formData.roleApplied}</span>
          </span>
        </div>
      </div>

      {status === 'error' && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website_url}
          onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
        />
      </div>

      {/* STEP 1: ROLE SELECTION CARDS */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Step 1: Select Your Target Position *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['Associate', 'Co-Lead', 'Lead'] as const).map((r) => {
            const selected = formData.roleApplied === r;
            return (
              <button
                type="button"
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  selected
                    ? r === 'Associate'
                      ? 'bg-sky-500/10 border-sky-400/80 shadow-lg shadow-sky-500/10 ring-1 ring-sky-400'
                      : 'bg-amber-500/10 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    {r === 'Lead' && <Crown className="w-4 h-4 text-amber-400" />}
                    {r === 'Co-Lead' && <Shield className="w-4 h-4 text-amber-300" />}
                    {r === 'Associate' && <UserCheck className="w-4 h-4 text-sky-400" />}
                    {r}
                  </span>
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selected
                        ? r === 'Associate'
                          ? 'border-sky-400 bg-sky-400'
                          : 'border-amber-400 bg-amber-400'
                        : 'border-slate-500'
                    }`}
                  >
                    {selected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {r === 'Lead' && 'Head the team, drive initiatives, manage coordinators & external relations.'}
                  {r === 'Co-Lead' && 'Co-pilot operations, coordinate cross-teams, and execute agendas.'}
                  {r === 'Associate' && 'Collaborate on projects, build hands-on skills, and support flagship events.'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: DEPARTMENT / TEAM SELECTION */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Step 2: Choose Department & Availability *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Primary Team *</label>
            <select
              value={formData.primaryDomain}
              onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Secondary Preference</label>
            <select
              value={formData.secondaryDomain}
              onChange={(e) => setFormData({ ...formData, secondaryDomain: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="">None / Open to Allocation</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Weekly Commitment *</label>
            <select
              value={formData.weeklyCommitment}
              onChange={(e) => setFormData({ ...formData, weeklyCommitment: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="5-10 hrs/week">5-10 hrs/week</option>
              <option value="10-15 hrs/week">10-15 hrs/week</option>
              <option value="15+ hrs/week">15+ hrs/week (High Availability)</option>
            </select>
          </div>
        </div>
      </div>

      {/* STEP 3: PERSONAL & ACADEMIC CREDENTIALS */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
          Step 3: Student Details
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">College Roll Number *</label>
            <input
              type="text"
              required
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="e.g. 23PA1A05XX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@vishnu.edu.in or personal"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">WhatsApp / Phone *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Academic Year *</label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="PG / Other">PG / Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Department / Branch *</label>
          <input
            type="text"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="e.g. Computer Science & Engineering"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* STEP 4: DYNAMIC ROLE-SPECIFIC QUESTIONS */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <label className="block text-xs font-bold uppercase tracking-wider text-white">
            Step 4: Questions Tailored for {formData.roleApplied} in {formData.primaryDomain}
          </label>
        </div>

        {/* LEAD / CO-LEAD QUESTIONS */}
        {isLeadership ? (
          <div className="space-y-4 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-amber-300">
                1. Leadership Experience & Committee Management *
              </label>
              <textarea
                required
                rows={3}
                value={formData.roleSpecificAnswers.leadershipExperience}
                onChange={(e) => handleAnswerChange('leadershipExperience', e.target.value)}
                placeholder="Describe your previous experience managing a team, college club, fest, or technical group. How did you delegate tasks?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-amber-300">
                2. Your Strategic Vision for {formData.primaryDomain} in 2026 *
              </label>
              <textarea
                required
                rows={3}
                value={formData.roleSpecificAnswers.teamVision}
                onChange={(e) => handleAnswerChange('teamVision', e.target.value)}
                placeholder={`What are 2 or 3 specific milestones or innovations you want this team to achieve for E-Cell VITB this year?`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-amber-300">
                3. Crisis & Conflict Resolution Approach *
              </label>
              <textarea
                required
                rows={2}
                value={formData.roleSpecificAnswers.conflictHandling}
                onChange={(e) => handleAnswerChange('conflictHandling', e.target.value)}
                placeholder="How do you handle team members who miss crucial deadlines 24 hours before a major summit or hackathon?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        ) : (
          /* ASSOCIATE QUESTIONS */
          <div className="space-y-4 p-5 rounded-2xl bg-sky-500/5 border border-sky-500/20">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-sky-300">
                1. What specific skills or ideas do you bring to {formData.primaryDomain}? *
              </label>
              <textarea
                required
                rows={3}
                value={formData.roleSpecificAnswers.coreSkills}
                onChange={(e) => handleAnswerChange('coreSkills', e.target.value)}
                placeholder="Tell us about your strengths, software tools you use, or concepts you have explored."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-sky-300">
                2. What do you hope to learn and build as an E-Cell Associate? *
              </label>
              <textarea
                required
                rows={2}
                value={formData.roleSpecificAnswers.learningGoals}
                onChange={(e) => handleAnswerChange('learningGoals', e.target.value)}
                placeholder="What excites you most about participating in the campus entrepreneurship movement?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* DOMAIN-SPECIFIC SPECIALIZED FIELDS */}
        {formData.primaryDomain === 'R&D and Web Development' && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Code2 className="w-4 h-4" />
              <span>Technical Wing Requirements</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                value={formData.roleSpecificAnswers.githubUrl}
                onChange={(e) => handleAnswerChange('githubUrl', e.target.value)}
                placeholder="GitHub Profile URL (e.g. github.com/username)"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                value={formData.roleSpecificAnswers.techStack}
                onChange={(e) => handleAnswerChange('techStack', e.target.value)}
                placeholder="Tech Stack (e.g. Next.js, Python, Flutter, Node)"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {formData.primaryDomain === 'Design' && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Palette className="w-4 h-4" />
              <span>Design Portfolio & Tools</span>
            </div>
            <input
              type="url"
              value={formData.roleSpecificAnswers.portfolioLink}
              onChange={(e) => handleAnswerChange('portfolioLink', e.target.value)}
              placeholder="Portfolio Link (Figma, Behance, Dribbble, or Google Drive)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        {formData.primaryDomain === 'Videography' && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Video className="w-4 h-4" />
              <span>Cinematography & Video Reel</span>
            </div>
            <input
              type="url"
              value={formData.roleSpecificAnswers.videoReelLink}
              onChange={(e) => handleAnswerChange('videoReelLink', e.target.value)}
              placeholder="Reel Link (YouTube, Instagram, or Google Drive folder)"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        {formData.primaryDomain === 'Sponsorship' && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <DollarSign className="w-4 h-4" />
              <span>Corporate Outreach Strategy</span>
            </div>
            <input
              type="text"
              value={formData.roleSpecificAnswers.targetSponsors}
              onChange={(e) => handleAnswerChange('targetSponsors', e.target.value)}
              placeholder="Brands or sectors you plan to pitch for sponsorship"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        {formData.primaryDomain === 'Event Management' && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Calendar className="w-4 h-4" />
              <span>Event Operations & Stage Protocols</span>
            </div>
            <textarea
              rows={3}
              value={formData.roleSpecificAnswers.eventExperience}
              onChange={(e) => handleAnswerChange('eventExperience', e.target.value)}
              placeholder="Describe your experience with event planning, stage timeline control, crowd management, or organizing college competitions."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1017] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        )}
      </div>

      {/* WHY JOIN STATEMENT & OX ALPHA AI POLISHER */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Why do you want to join E-Cell VITB? *
          </label>
          <button
            type="button"
            onClick={async () => {
              if (!formData.whyJoin.trim()) {
                alert('Please type a brief thought or draft first, and Ox Alpha will polish it into a compelling statement.');
                return;
              }
              const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prompt: formData.whyJoin,
                  taskType: 'sop_polish',
                  metadata: {
                    department: formData.primaryDomain,
                    role: formData.roleApplied,
                  },
                }),
              });
              const data = await res.json();
              if (res.ok && data.text) {
                // Extract polished statement from quotes if present
                const match = data.text.match(/"([^"]+)"/);
                if (match && match[1].length > 50) {
                  setFormData((prev) => ({ ...prev, whyJoin: match[1] }));
                } else {
                  setFormData((prev) => ({ ...prev, whyJoin: data.text }));
                }
              }
            }}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Polish Statement with ECell Help Assistance</span>
          </button>
        </div>

        <textarea
          required
          rows={3}
          value={formData.whyJoin}
          onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
          placeholder="Share your personal motivation, entrepreneurial curiosity, and what you aim to achieve. (Tip: Type your thoughts and click 'Polish Statement with ECell Help Assistance' to elevate it!)"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Recording Application...</span>
          </>
        ) : (
          <>
            <span>Submit {formData.roleApplied} Application</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
