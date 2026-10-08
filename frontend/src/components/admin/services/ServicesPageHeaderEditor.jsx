import React, { useState, useEffect } from 'react';
import { Sparkles, Save, RotateCcw, Loader2, CheckCircle2, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../../../config/api';
import { useSiteSettings } from '../../../context/SiteSettingsContext';

export default function ServicesPageHeaderEditor({ onNotify }) {
  const { refreshSettings } = useSiteSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [headerState, setHeaderState] = useState({
    services_hero_badge: 'Enterprise Technology Partner',
    services_hero_title: 'Technology Solutions Built for Growth.',
    services_hero_subtitle: 'We build scalable web applications, enterprise software, AI-powered solutions, cloud infrastructure, and mobile applications that help startups and enterprises grow faster.',
    services_intro_badge: 'The SRJ Ecosystem',
    services_intro_title: 'Everything You Need to Build, Scale, and Transform',
    services_intro_description: 'Explore our complete range of technology services designed to help businesses turn ideas into powerful digital products.'
  });

  const [initialState, setInitialState] = useState({});

  useEffect(() => {
    fetchHeaderSettings();
  }, []);

  const fetchHeaderSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/settings');
      if (res.data?.success && res.data.settings) {
        const s = res.data.settings;
        const loaded = {
          services_hero_badge: s.services_hero_badge || 'Enterprise Technology Partner',
          services_hero_title: s.services_hero_title || 'Technology Solutions Built for Growth.',
          services_hero_subtitle: s.services_hero_subtitle || 'We build scalable web applications, enterprise software, AI-powered solutions, cloud infrastructure, and mobile applications that help startups and enterprises grow faster.',
          services_intro_badge: s.services_intro_badge || 'The SRJ Ecosystem',
          services_intro_title: s.services_intro_title || 'Everything You Need to Build, Scale, and Transform',
          services_intro_description: s.services_intro_description || 'Explore our complete range of technology services designed to help businesses turn ideas into powerful digital products.'
        };
        setHeaderState(loaded);
        setInitialState(loaded);
      }
    } catch (err) {
      console.error('Failed to load services header settings:', err);
      setErrorMessage('Could not load services header settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      services_hero_badge: headerState.services_hero_badge.trim(),
      services_hero_title: headerState.services_hero_title.trim(),
      services_hero_subtitle: headerState.services_hero_subtitle.trim(),
      services_intro_badge: headerState.services_intro_badge.trim(),
      services_intro_title: headerState.services_intro_title.trim(),
      services_intro_description: headerState.services_intro_description.trim()
    };

    try {
      const res = await api.put('/settings/bulk', { settings: payload });
      if (res.data?.success) {
        setInitialState(headerState);
        if (refreshSettings) refreshSettings();
        setSuccessMessage('Services page headers updated successfully!');
        if (onNotify) onNotify('success', 'Services page content updated successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(res.data?.message || 'Failed to update services settings');
      }
    } catch (err) {
      console.error('Save services settings error:', err);
      setErrorMessage(err.response?.data?.message || 'Error updating services settings');
      if (onNotify) onNotify('error', 'Failed to update services page settings');
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = JSON.stringify(headerState) !== JSON.stringify(initialState);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Alert Notices */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium">
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Services Hero Live Visual Preview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
          Live /services Preview
        </div>

        <div className="max-w-2xl space-y-4 pt-2">
          {headerState.services_hero_badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={13} />
              <span>{headerState.services_hero_badge}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {headerState.services_hero_title || 'Technology Solutions Built for Growth.'}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed">
            {headerState.services_hero_subtitle}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a
              href="/services"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md"
            >
              <span>View Public /services</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Services Page Hero & Intro Content</h3>
            <p className="text-xs text-slate-500">
              Configure the top banner and ecosystem directory intro on the <code>/services</code> landing page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isDirty || isSaving}
              onClick={() => setHeaderState(initialState)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black disabled:opacity-40 transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Section 1: Hero */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
            Part 1: Services Hero Banner
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hero Eyebrow / Badge
              </label>
              <input
                type="text"
                value={headerState.services_hero_badge}
                onChange={(e) => setHeaderState({ ...headerState, services_hero_badge: e.target.value })}
                placeholder="e.g. Enterprise Technology Partner"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={headerState.services_hero_title}
                onChange={(e) => setHeaderState({ ...headerState, services_hero_title: e.target.value })}
                placeholder="e.g. Technology Solutions Built for Growth."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hero Subtitle Description
              </label>
              <textarea
                rows={3}
                value={headerState.services_hero_subtitle}
                onChange={(e) => setHeaderState({ ...headerState, services_hero_subtitle: e.target.value })}
                placeholder="Detailed hero subtitle paragraph..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Ecosystem Intro */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
            Part 2: Ecosystem Directory Intro
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Intro Eyebrow Badge
              </label>
              <input
                type="text"
                value={headerState.services_intro_badge}
                onChange={(e) => setHeaderState({ ...headerState, services_intro_badge: e.target.value })}
                placeholder="e.g. The SRJ Ecosystem"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Intro Heading
              </label>
              <input
                type="text"
                value={headerState.services_intro_title}
                onChange={(e) => setHeaderState({ ...headerState, services_intro_title: e.target.value })}
                placeholder="e.g. Everything You Need to Build, Scale, and Transform"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Intro Paragraph
              </label>
              <textarea
                rows={3}
                value={headerState.services_intro_description}
                onChange={(e) => setHeaderState({ ...headerState, services_intro_description: e.target.value })}
                placeholder="Intro paragraph explaining the complete service range..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium leading-relaxed"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
