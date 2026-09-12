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
  Award
} from 'lucide-react';
import api from '../../config/api';

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
    title: 'Global SEO & Metadata',
    icon: Globe,
    description: 'Default site title, meta description, search keywords, and Open Graph image.'
  },
  business: {
    title: 'Business Information',
    icon: Clock,
    description: 'Customer inquiry response promise SLA and operating business hours.'
  },
  hero: {
    title: 'Hero Section',
    icon: Sparkles,
    description: 'Home page Hero section headline variants, top badge, subtitle paragraph, and CTA buttons.'
  },
  process: {
    title: 'Process Section',
    icon: Compass,
    description: 'Home page Process section top badge, main heading, subtitle paragraph, and CTA buttons.'
  },
  trust: {
    title: 'Trust & Stats Section',
    icon: Award,
    description: 'Home page Trust section and Achievements section headings and subtitles.'
  },
  services: {
    title: 'Services Page',
    icon: Layers,
    description: 'Services page Hero and Directory Intro badges, headings, and descriptions.'
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
  const [savedSettings, setSavedSettings] = useState({});
  const [currentSettings, setCurrentSettings] = useState({});
  const [settingsMetadata, setSettingsMetadata] = useState([]);
  const [activeGroupTab, setActiveGroupTab] = useState('all');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [imageErrorMap, setImageErrorMap] = useState({});

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
      hero: [],
      process: [],
      trust: [],
      services: []
    };

    settingsMetadata.forEach((setting) => {
      const group = setting.group_name || 'general';
      if (!map[group]) {
        map[group] = [];
      }
      map[group].push(setting);
    });

    return map;
  }, [settingsMetadata]);

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
          All Settings ({settingsMetadata.length})
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
