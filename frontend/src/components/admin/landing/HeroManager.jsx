import React, { useState, useEffect } from 'react';
import { Sparkles, Save, RotateCcw, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../../config/api';
import { useSiteSettings } from '../../../context/SiteSettingsContext';

const DEFAULT_HEADINGS = [
  "Grow Your Business with Smart Technology",
  "Scalable Web & App Development Solutions",
  "Complete Digital Growth Solutions",
  "Building Future-Ready Digital Experiences"
];

export default function HeroManager({ onNotify }) {
  const { refreshSettings } = useSiteSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [heroState, setHeroState] = useState({
    hero_badge: 'Trusted by Leaders in Enterprise Technology',
    hero_headings: DEFAULT_HEADINGS.join('\n'),
    hero_subtitle: 'SRJ Global Technologies helps startups and businesses build modern websites, mobile apps, AI solutions, and scalable software.',
    hero_cta_primary_text: 'Explore Services',
    hero_cta_primary_url: '/services',
    hero_cta_secondary_text: 'View Our Work',
    hero_cta_secondary_url: '/portfolio'
  });

  const [initialState, setInitialState] = useState({});

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/settings');
      if (res.data?.success && res.data.settings) {
        const s = res.data.settings;

        let parsedHeadings = s.hero_headings;
        if (Array.isArray(parsedHeadings)) {
          parsedHeadings = parsedHeadings.join('\n');
        } else if (typeof parsedHeadings === 'string' && parsedHeadings.startsWith('[')) {
          try {
            parsedHeadings = JSON.parse(parsedHeadings).join('\n');
          } catch {
            // Keep as string
          }
        }

        const loaded = {
          hero_badge: s.hero_badge || 'Trusted by Leaders in Enterprise Technology',
          hero_headings: parsedHeadings || DEFAULT_HEADINGS.join('\n'),
          hero_subtitle: s.hero_subtitle || 'SRJ Global Technologies helps startups and businesses build modern websites, mobile apps, AI solutions, and scalable software.',
          hero_cta_primary_text: s.hero_cta_primary_text || 'Explore Services',
          hero_cta_primary_url: s.hero_cta_primary_url || '/services',
          hero_cta_secondary_text: s.hero_cta_secondary_text || 'View Our Work',
          hero_cta_secondary_url: s.hero_cta_secondary_url || '/portfolio'
        };

        setHeroState(loaded);
        setInitialState(loaded);
      }
    } catch (err) {
      console.error('Failed to load hero settings:', err);
      setErrorMessage('Could not load hero settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Parse headings into newline clean string
    const cleanHeadings = heroState.hero_headings
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean)
      .join('\n');

    const payload = {
      hero_badge: heroState.hero_badge.trim(),
      hero_headings: cleanHeadings,
      hero_subtitle: heroState.hero_subtitle.trim(),
      hero_cta_primary_text: heroState.hero_cta_primary_text.trim(),
      hero_cta_primary_url: heroState.hero_cta_primary_url.trim(),
      hero_cta_secondary_text: heroState.hero_cta_secondary_text.trim(),
      hero_cta_secondary_url: heroState.hero_cta_secondary_url.trim()
    };

    try {
      const res = await api.put('/settings/bulk', { settings: payload });
      if (res.data?.success) {
        setInitialState({ ...heroState, hero_headings: cleanHeadings });
        if (refreshSettings) refreshSettings();
        setSuccessMessage('Hero section updated successfully!');
        if (onNotify) onNotify('success', 'Hero section updated successfully!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(res.data?.message || 'Failed to update hero settings');
      }
    } catch (err) {
      console.error('Save hero settings error:', err);
      setErrorMessage(err.response?.data?.message || 'Error updating hero settings');
      if (onNotify) onNotify('error', 'Failed to update hero section');
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = JSON.stringify(heroState) !== JSON.stringify(initialState);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  const previewHeading = heroState.hero_headings
    ? heroState.hero_headings.split('\n').filter(Boolean)[0] || 'Build Modern Scalable Software'
    : 'Build Modern Scalable Software';

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

      {/* Hero Live Visual Preview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
          Live Homepage Preview
        </div>

        <div className="max-w-2xl space-y-4 pt-2">
          {heroState.hero_badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold">
              <Sparkles size={13} />
              <span>{heroState.hero_badge}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {previewHeading}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed">
            {heroState.hero_subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md"
            >
              <span>{heroState.hero_cta_primary_text || 'Primary CTA'}</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 font-bold text-xs sm:text-sm border border-white/15"
            >
              <span>{heroState.hero_cta_secondary_text || 'Secondary CTA'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hero Section Content</h3>
            <p className="text-xs text-slate-500">
              Customize the prominent top section of your homepage. Headlines rotate automatically.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isDirty || isSaving}
              onClick={() => setHeroState(initialState)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Badge */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Top Badge Text
            </label>
            <input
              type="text"
              value={heroState.hero_badge}
              onChange={(e) => setHeroState({ ...heroState, hero_badge: e.target.value })}
              placeholder="e.g. Trusted by Leaders in Enterprise Technology"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium"
            />
          </div>

          {/* Headline Variants */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Rotating Headlines (One headline per line)
              </label>
              <span className="text-[11px] text-slate-400">Rotates every 4 seconds via GSAP</span>
            </div>
            <textarea
              rows={4}
              value={heroState.hero_headings}
              onChange={(e) => setHeroState({ ...heroState, hero_headings: e.target.value })}
              placeholder="Enter headline variants, one per line..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium leading-relaxed font-sans"
            />
          </div>

          {/* Subtitle */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={heroState.hero_subtitle}
              onChange={(e) => setHeroState({ ...heroState, hero_subtitle: e.target.value })}
              placeholder="Detailed hero subtitle paragraph..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-900 font-medium leading-relaxed"
            />
          </div>

          {/* Primary CTA */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Primary CTA Button</h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Label</label>
              <input
                type="text"
                value={heroState.hero_cta_primary_text}
                onChange={(e) => setHeroState({ ...heroState, hero_cta_primary_text: e.target.value })}
                placeholder="e.g. Explore Services"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Button URL / Link</label>
              <input
                type="text"
                value={heroState.hero_cta_primary_url}
                onChange={(e) => setHeroState({ ...heroState, hero_cta_primary_url: e.target.value })}
                placeholder="e.g. /services or #services"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Secondary CTA Button</h4>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Label</label>
              <input
                type="text"
                value={heroState.hero_cta_secondary_text}
                onChange={(e) => setHeroState({ ...heroState, hero_cta_secondary_text: e.target.value })}
                placeholder="e.g. View Our Work"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Button URL / Link</label>
              <input
                type="text"
                value={heroState.hero_cta_secondary_url}
                onChange={(e) => setHeroState({ ...heroState, hero_cta_secondary_url: e.target.value })}
                placeholder="e.g. /portfolio or #portfolio"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-medium focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
