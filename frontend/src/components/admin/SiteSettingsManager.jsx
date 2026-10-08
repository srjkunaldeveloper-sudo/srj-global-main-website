import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building, 
  Phone, 
  Share2, 
  Layout, 
  Globe, 
  Clock, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Image, 
  Mail, 
  MapPin, 
  Sparkles,
  ExternalLink,
  Layers,
  Settings,
  Compass,
  Award,
  DollarSign,
  Handshake,
  Bot,
  Search,
  FileText
} from 'lucide-react';
import api from '../../config/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';

// 11 Core Public Pages for SEO Controller
const SEO_PAGES = [
  { id: 'home', label: 'Homepage', path: '/', badge: '#2563EB' },
  { id: 'services', label: 'Services', path: '/services', badge: '#7C3AED' },
  { id: 'pricing', label: 'Pricing', path: '/pricing', badge: '#059669' },
  { id: 'about', label: 'About Us', path: '/about', badge: '#EA580C' },
  { id: 'industries', label: 'Industries', path: '/industries', badge: '#0284C7' },
  { id: 'collaboration', label: 'Collaboration', path: '/collaboration', badge: '#D97706' },
  { id: 'careers', label: 'Careers', path: '/careers', badge: '#4F46E5' },
  { id: 'contact', label: 'Contact Us', path: '/contact', badge: '#DC2626' },
  { id: 'blog', label: 'Blog & Insights', path: '/blog', badge: '#0D9488' },
  { id: 'privacy', label: 'Privacy Policy', path: '/privacy', badge: '#64748B' },
  { id: 'terms', label: 'Terms & Conditions', path: '/terms', badge: '#475569' }
];

// Defined Group Metadata
const GROUP_CONFIG = {
  identity: {
    title: 'Company Identity',
    icon: Building,
    description: 'Official brand name, logos, tagline, and canonical site configuration.'
  },
  contact: {
    title: 'Contact Information',
    icon: Phone,
    description: 'Public business email, helpline numbers, physical address, and maps.'
  },
  social: {
    title: 'Social Media Profiles',
    icon: Share2,
    description: 'Official company social media URLs displayed in footer and contact areas.'
  },
  footer: {
    title: 'Footer Configuration',
    icon: Layout,
    description: 'Footer summary description, copyright template, and Google review link.'
  },
  seo: {
    title: 'Search, AEO & GEO Engine',
    icon: Globe,
    description: 'Full administrative control over Google SERP snippets, per-page meta tags, and AI search engines (Perplexity, ChatGPT, Claude).'
  },
  business: {
    title: 'Business Information',
    icon: Clock,
    description: 'Customer inquiry response promise SLA and operating business hours.'
  },
  collaboration: {
    title: 'Collaboration Page Content',
    icon: Handshake,
    description: 'Collaboration page Hero section badge, headline, subtitle paragraph, offerings header, and conversion CTA configuration.'
  }
};

// Social Icon Mapping
const SOCIAL_ICONS = {
  social_instagram: Share2,
  social_facebook: Share2,
  social_twitter: Share2,
  social_linkedin: Share2,
  social_youtube: Share2,
  social_pinterest: Share2
};

export default function SiteSettingsManager() {
  const { refreshSettings } = useSiteSettings();
  const [savedSettings, setSavedSettings] = useState({});
  const [currentSettings, setCurrentSettings] = useState({});
  const [settingsMetadata, setSettingsMetadata] = useState([]);
  const [activeGroupTab, setActiveGroupTab] = useState('all');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageErrorMap, setImageErrorMap] = useState({});
  const [selectedSeoPage, setSelectedSeoPage] = useState('home');
  const [seoSubTab, setSeoSubTab] = useState('pages');

  // 1. Fetch settings from backend on component mount
  const fetchSettings = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get('/settings/admin');
      if (res.data && res.data.success && Array.isArray(res.data.settings)) {
        const settingsList = res.data.settings;
        setSettingsMetadata(settingsList);

        const initialMap = {};
        settingsList.forEach((item) => {
          initialMap[item.setting_key] = item.setting_value !== null ? item.setting_value : '';
        });

        setSavedSettings(initialMap);
        setCurrentSettings(initialMap);
      } else {
        setErrorMessage('Invalid response structure received from server.');
      }
    } catch (err) {
      console.error('Error loading site settings:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to load site settings. Please verify backend connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // 2. Compute dirty state by comparing current values against last saved values
  const isDirty = useMemo(() => {
    if (!savedSettings || !currentSettings) return false;
    return Object.keys(currentSettings).some(
      (key) => currentSettings[key] !== (savedSettings[key] !== undefined ? savedSettings[key] : '')
    );
  }, [savedSettings, currentSettings]);

  // Compute changed keys payload
  const getChangedPayload = () => {
    const changed = {};
    Object.keys(currentSettings).forEach((key) => {
      if (currentSettings[key] !== (savedSettings[key] !== undefined ? savedSettings[key] : '')) {
        changed[key] = currentSettings[key];
      }
    });
    return changed;
  };

  // 3. Form Input Change Handler
  const handleInputChange = (key, value) => {
    setCurrentSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    // Reset image preview error state when URL input changes
    if (imageErrorMap[key]) {
      setImageErrorMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  // 4. Save Handler (Bulk Update)
  const handleSave = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const changedPayload = getChangedPayload();

    try {
      const res = await api.put('/settings/bulk', { settings: changedPayload });
      if (res.data && res.data.success) {
        const updatedSavedMap = { ...savedSettings, ...changedPayload };
        setSavedSettings(updatedSavedMap);
        setCurrentSettings(updatedSavedMap);

        if (refreshSettings) {
          refreshSettings();
        }

        setSuccessMessage(res.data.message || 'Site settings updated successfully!');
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setErrorMessage(res.data?.message || 'Failed to update site settings.');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to save site settings. Please check server validation.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Discard Changes Handler
  const handleDiscard = () => {
    if (!isDirty) return;
    if (window.confirm('Are you sure you want to discard all unsaved changes?')) {
      setCurrentSettings({ ...savedSettings });
      setErrorMessage(null);
    }
  };

  // Group settings by group_name
  const groupedSettings = useMemo(() => {
    const map = {
      identity: [],
      contact: [],
      social: [],
      footer: [],
      seo: [],
      business: [],
      collaboration: []
    };

    settingsMetadata.forEach((setting) => {
      const group = setting.group_name || 'general';
      // Exclude homepage, services, and pricing sections since they are managed in their dedicated managers
      if (['hero', 'process', 'trust', 'home', 'services', 'pricing'].includes(group)) {
        return;
      }
      if (!map[group]) {
        map[group] = [];
      }
      map[group].push(setting);
    });

    return map;
  }, [settingsMetadata]);

  // Non-landing settings count
  const nonLandingCount = useMemo(() => {
    return Object.values(groupedSettings).reduce((acc, curr) => acc + curr.length, 0);
  }, [groupedSettings]);

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State (Failed GET)
  if (errorMessage && Object.keys(savedSettings).length === 0) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-red-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Failed to Load Site Settings</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{errorMessage}</p>
        <button
          onClick={fetchSettings}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-md"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Sticky Save Action Bar */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <Settings size={22} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Site Settings</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage global website branding, contact details, social links, footer, SEO metadata, and SLA promises.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition cursor-pointer ${
              isDirty && !isSaving
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
          >
            <RotateCcw size={15} />
            Discard Changes
          </button>

          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md ${
              isDirty && !isSaving
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes {isDirty && <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block ml-1"></span>}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Global Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-900 font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Group Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/60 no-scrollbar">
        <button
          onClick={() => setActiveGroupTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeGroupTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Settings ({nonLandingCount})
        </button>
        {Object.keys(GROUP_CONFIG).map((groupKey) => {
          const groupMeta = GROUP_CONFIG[groupKey];
          const IconComp = groupMeta.icon;
          const count = groupedSettings[groupKey]?.length || 0;
          return (
            <button
              key={groupKey}
              onClick={() => setActiveGroupTab(groupKey)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeGroupTab === groupKey
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <IconComp size={14} />
              {groupMeta.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Setting Sections Render */}
      <div className="space-y-8">
        {Object.keys(GROUP_CONFIG).map((groupKey) => {
          if (activeGroupTab !== 'all' && activeGroupTab !== groupKey) {
            return null;
          }

          const groupMeta = GROUP_CONFIG[groupKey];
          const IconComp = groupMeta.icon;
          const settingsInGroup = groupedSettings[groupKey] || [];

          if (settingsInGroup.length === 0) return null;

          return (
            <div key={groupKey} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
              {/* Group Header */}
              <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800">
                  <IconComp size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{groupMeta.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{groupMeta.description}</p>
                </div>
              </div>

              {/* Group Controls Grid */}
              {groupKey === 'seo' ? (
                <div className="space-y-6">
                  {/* Sub Navigation */}
                  <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setSeoSubTab('pages')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        seoSubTab === 'pages'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText size={14} className="text-blue-600" />
                      Page-by-Page SEO (11 Pages)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoSubTab('global')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        seoSubTab === 'global'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Globe size={14} className="text-emerald-600" />
                      Global Meta Defaults & OG Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeoSubTab('aeo_geo')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        seoSubTab === 'aeo_geo'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Bot size={14} className="text-purple-600" />
                      AEO & GEO (AI Search Optimization)
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase bg-purple-100 text-purple-700 rounded-md">New</span>
                    </button>
                  </div>

                  {/* SUB-TAB 1: PAGE-BY-PAGE SEO */}
                  {seoSubTab === 'pages' && (
                    <div className="space-y-6">
                      {/* Page Selector Carousel / Pills */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {SEO_PAGES.map((page) => {
                          const isSelected = selectedSeoPage === page.id;
                          return (
                            <button
                              key={page.id}
                              type="button"
                              onClick={() => setSelectedSeoPage(page.id)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 cursor-pointer border ${
                                isSelected
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ backgroundColor: page.badge }}
                              />
                              {page.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Page Form & Google SERP Preview */}
                      {(() => {
                        const currentPage = SEO_PAGES.find((p) => p.id === selectedSeoPage) || SEO_PAGES[0];
                        const titleKey = `seo_${currentPage.id}_title`;
                        const descKey = `seo_${currentPage.id}_description`;
                        const keywordsKey = `seo_${currentPage.id}_keywords`;

                        const pageTitle = currentSettings[titleKey] || '';
                        const pageDesc = currentSettings[descKey] || '';
                        const pageKeywords = currentSettings[keywordsKey] || '';

                        const displayTitle = pageTitle || currentSettings['global_seo_title'] || 'SRJ Global Technologies';
                        const displayDesc = pageDesc || currentSettings['global_seo_description'] || 'SRJ Global Technologies delivers scalable software solutions.';

                        return (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column: Edit Inputs */}
                            <div className="lg:col-span-7 space-y-5">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: currentPage.badge }} />
                                    {currentPage.label} SEO Configuration
                                  </h3>
                                  <code className="text-[11px] text-slate-400 font-mono">Route: {currentPage.path}</code>
                                </div>
                                <a
                                  href={currentPage.path}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-xl transition"
                                >
                                  View Page <ExternalLink size={12} />
                                </a>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-xs font-extrabold text-slate-800">
                                    Page Meta Title
                                  </label>
                                  <span className={`text-[10px] font-mono font-bold ${pageTitle.length > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                                    {pageTitle.length} / 60 chars (Optimal)
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={pageTitle}
                                  onChange={(e) => handleInputChange(titleKey, e.target.value)}
                                  placeholder={`e.g. ${currentPage.label} | SRJ Global Technologies`}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <label className="text-xs font-extrabold text-slate-800">
                                    Meta Description
                                  </label>
                                  <span className={`text-[10px] font-mono font-bold ${pageDesc.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                                    {pageDesc.length} / 160 chars (Optimal)
                                  </span>
                                </div>
                                <textarea
                                  rows={3}
                                  value={pageDesc}
                                  onChange={(e) => handleInputChange(descKey, e.target.value)}
                                  placeholder="Enter comprehensive meta description for search engines..."
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm leading-relaxed"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                                  Search Keywords (Comma-separated)
                                </label>
                                <input
                                  type="text"
                                  value={pageKeywords}
                                  onChange={(e) => handleInputChange(keywordsKey, e.target.value)}
                                  placeholder="e.g. software development, IT consulting, SRJ Global"
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm"
                                />
                              </div>
                            </div>

                            {/* Right Column: Google Live SERP Snippet Preview */}
                            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Search size={14} className="text-blue-600" />
                                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                                    Google SERP Live Preview
                                  </span>
                                </div>

                                {/* Mock Google Card */}
                                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-700">
                                      S
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[12px] font-medium text-slate-800 leading-tight">SRJ Global Technologies</span>
                                      <span className="text-[10px] text-slate-400 font-mono">https://srjglobaltechnology.com{currentPage.path}</span>
                                    </div>
                                  </div>
                                  <div className="text-[15px] font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                                    {displayTitle}
                                  </div>
                                  <div className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-3">
                                    {displayDesc}
                                  </div>
                                </div>
                              </div>

                              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
                                💡 <strong>Tip:</strong> Changes made here will instantly reflect in the browser title, Google search bots, and social shares for <code className="font-mono font-bold">{currentPage.path}</code>.
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* SUB-TAB 2: GLOBAL META DEFAULTS */}
                  {seoSubTab === 'global' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {settingsInGroup
                        .filter((s) =>
                          ['global_seo_title', 'global_seo_description', 'global_seo_keywords', 'global_og_image'].includes(
                            s.setting_key
                          )
                        )
                        .map((setting) => {
                          const key = setting.setting_key;
                          const val = currentSettings[key] !== undefined ? currentSettings[key] : '';
                          const isTextarea = key === 'global_seo_description';
                          const isImage = key === 'global_og_image';

                          return (
                            <div key={key} className={`space-y-2 ${isTextarea ? 'md:col-span-2' : 'col-span-1'}`}>
                              <label className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                                <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                                <code className="text-[10px] font-mono text-slate-400 font-normal">({key})</code>
                              </label>
                              {isTextarea ? (
                                <textarea
                                  rows={3}
                                  value={val}
                                  onChange={(e) => handleInputChange(key, e.target.value)}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm leading-relaxed"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => handleInputChange(key, e.target.value)}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm"
                                />
                              )}
                              {isImage && val && (
                                <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    OG Image Preview:
                                  </span>
                                  <img
                                    src={val}
                                    alt="OG preview"
                                    className="max-h-14 max-w-[180px] object-contain rounded border border-slate-200 bg-white p-1"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* SUB-TAB 3: AEO & GEO AI OPTIMIZATION */}
                  {seoSubTab === 'aeo_geo' && (
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/60 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
                            <Bot size={18} />
                          </span>
                          <div>
                            <h3 className="text-sm font-extrabold text-purple-950">
                              AEO & GEO (AI Answer Engines Optimization)
                            </h3>
                            <p className="text-xs text-purple-800/80">
                              Optimized for ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews.
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-purple-900 leading-relaxed pt-1">
                          When users ask AI engines like Perplexity or ChatGPT questions like <em>"What are the best game development agencies in India?"</em> or <em>"Custom software pricing"</em>, these settings directly feed the structured facts and entity citations.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <a
                            href="/llms.txt"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-white px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 transition"
                          >
                            View /llms.txt <ExternalLink size={12} />
                          </a>
                          <a
                            href="/sitemap.xml"
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-white px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 transition"
                          >
                            View /sitemap.xml <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-xs font-extrabold text-slate-800">
                            AI Knowledge Graph Entity Topics (<code className="font-mono text-purple-600 font-normal">geo_knows_about</code>)
                          </label>
                          <textarea
                            rows={3}
                            value={currentSettings['geo_knows_about'] || ''}
                            onChange={(e) => handleInputChange('geo_knows_about', e.target.value)}
                            placeholder="Comma-separated topics: Custom Software Development, Unity Game Development, Real Money Games, AI Solutions..."
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm leading-relaxed"
                          />
                          <p className="text-[11px] text-slate-400">
                            Injected into Schema.org Organization as <code className="font-mono">knowsAbout</code> topics for Google Knowledge Graph and AI models.
                          </p>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="block text-xs font-extrabold text-slate-800">
                            Official Company AI Summary (<code className="font-mono text-purple-600 font-normal">geo_ai_summary</code>)
                          </label>
                          <textarea
                            rows={4}
                            value={currentSettings['geo_ai_summary'] || ''}
                            onChange={(e) => handleInputChange('geo_ai_summary', e.target.value)}
                            placeholder="Authoritative paragraph defining SRJ Global Technologies for generative AI crawlers..."
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm leading-relaxed"
                          />
                          <p className="text-[11px] text-slate-400">
                            Injected into meta tags and Schema.org as <code className="font-mono">disambiguatingDescription</code> and <code className="font-mono">abstract</code>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Section Quick Save */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                    <span className="text-xs text-slate-400 font-medium">
                      {isDirty ? 'Unsaved changes in SEO settings' : 'All SEO & AEO settings are up to date.'}
                    </span>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={!isDirty || isSaving}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
                        isDirty && !isSaving
                          ? 'bg-slate-900 hover:bg-black text-white shadow-md'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Saving SEO Settings...
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          Save SEO & AEO Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsInGroup.map((setting) => {
                  const key = setting.setting_key;
                  const fieldType = setting.field_type;
                  const description = setting.description;
                  const val = currentSettings[key] !== undefined ? currentSettings[key] : '';

                  const isTextarea = fieldType === 'textarea' || fieldType === 'json' || key === 'hero_headings' || key === 'hero_subtitle' || key === 'office_address' || key === 'footer_description' || key === 'global_seo_description' || key === 'services_hero_subtitle' || key === 'services_intro_description';
                  const isImage = key === 'logo_url' || key === 'favicon_url' || key === 'global_og_image';
                  const SocialIcon = SOCIAL_ICONS[key];

                  return (
                    <div
                      key={key}
                      className={`space-y-2 ${isTextarea ? 'md:col-span-2' : 'col-span-1'}`}
                    >
                      <label className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                        <span className="flex items-center gap-2">
                          {SocialIcon && <SocialIcon size={14} className="text-slate-500" />}
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                          <code className="text-[10px] font-mono text-slate-400 font-normal">({key})</code>
                        </span>
                        {fieldType && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                            {fieldType}
                          </span>
                        )}
                      </label>

                      {/* Control Render */}
                      {isTextarea ? (
                        <textarea
                          rows={3}
                          value={val}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm leading-relaxed"
                        />
                      ) : (
                        <div className="relative">
                          <input
                            type={fieldType === 'email' ? 'email' : fieldType === 'phone' ? 'tel' : fieldType === 'url' ? 'url' : 'text'}
                            value={val}
                            onChange={(e) => handleInputChange(key, e.target.value)}
                            placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition-all shadow-sm"
                          />
                        </div>
                      )}

                      {/* Image Preview for Asset/URL Keys */}
                      {isImage && val && !imageErrorMap[key] && (
                        <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Preview:</span>
                          <img
                            src={val}
                            alt={`${key} preview`}
                            className={`object-contain rounded border border-slate-200 bg-white p-1 ${
                              key === 'favicon_url' ? 'w-8 h-8' : 'max-h-12 max-w-[180px]'
                            }`}
                            onError={() => setImageErrorMap((prev) => ({ ...prev, [key]: true }))}
                          />
                        </div>
                      )}

                      {/* Helper Description */}
                      {description && (
                        <p className="text-[11px] text-slate-400 font-medium leading-normal">
                          {description}
                        </p>
                      )}
                    </div>
                  );
                })}
                {/* Card Bottom Quick Save Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {isDirty ? 'Unsaved changes in settings' : 'All changes in this section are up to date.'}
                  </span>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isDirty || isSaving}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm ${
                      isDirty && !isSaving
                        ? 'bg-slate-900 hover:bg-black text-white shadow-md'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save {groupMeta.title}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Sticky Bottom Floating Bar when modifications exist */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-5">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>You have unsaved changes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={14} /> Save Now
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
