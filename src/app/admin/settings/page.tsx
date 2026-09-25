'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, CheckCircle2, Sparkles, Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data.settings || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Global CMS & Organization Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize homepage announcements, motto text, campus contacts, social handles, and SEO
          defaults.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Announcement Bar */}
        <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Top Announcement Bar
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementBar?.enabled ?? true}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBar: {
                      ...settings.announcementBar,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-amber-400 rounded"
              />
              <span className="text-slate-300">Show Announcement Bar</span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Announcement Text</label>
              <input
                type="text"
                value={settings.announcementBar?.text || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcementBar: {
                      ...settings.announcementBar,
                      text: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Link Label</label>
                <input
                  type="text"
                  value={settings.announcementBar?.linkText || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcementBar: {
                        ...settings.announcementBar,
                        linkText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Link URL</label>
                <input
                  type="text"
                  value={settings.announcementBar?.linkUrl || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcementBar: {
                        ...settings.announcementBar,
                        linkUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Motto Concept Settings */}
        <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-white/5">
            Motto Explanations (INNOVATE – CREATE – LEAD)
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-amber-400 font-semibold">INNOVATE Subtitle</label>
              <input
                type="text"
                value={settings.motto?.innovate || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    motto: { ...settings.motto, innovate: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sky-400 font-semibold">CREATE Subtitle</label>
              <input
                type="text"
                value={settings.motto?.create || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    motto: { ...settings.motto, create: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-emerald-400 font-semibold">LEAD Subtitle</label>
              <input
                type="text"
                value={settings.motto?.lead || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    motto: { ...settings.motto, lead: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Contact Info */}
        <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-white/5">
            Campus Contact Coordinates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Contact Email</label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Phone Number</label>
              <input
                type="text"
                value={settings.contact?.phone || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Official Campus Address</label>
            <textarea
              rows={2}
              value={settings.contact?.address || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  contact: { ...settings.contact, address: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
        </div>

        {/* 4. Social Links */}
        <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-white/5">
            Official Social Media URLs
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">LinkedIn URL</label>
              <input
                type="url"
                value={settings.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Instagram URL</label>
              <input
                type="url"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">YouTube Channel URL</label>
              <input
                type="url"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Twitter / X URL</label>
              <input
                type="url"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
              />
            </div>
          </div>
        </div>

        {/* Save button & success notification */}
        <div className="flex items-center justify-between pt-4">
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}
          {!success && <div />}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
