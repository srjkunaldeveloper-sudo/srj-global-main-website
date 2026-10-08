import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../config/api';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import { useNavigation } from '../../../context/NavigationContext';
import { 
  Layout, 
  Save, 
  RefreshCw, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  MapPin, 
  Phone, 
  Mail, 
  Share2, 
  Star, 
  Eye, 
  X,
  Link as LinkIcon,
  HelpCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import LegalPoliciesManager from '../legal/LegalPoliciesManager';
import { 
  FaInstagram, 
  FaPinterest, 
  FaYoutube, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedin 
} from 'react-icons/fa';

export default function FooterManager({ onNotify }) {
  const { refreshSettings } = useSiteSettings();
  const { refreshNavigation } = useNavigation();

  // Settings State
  const [settings, setSettings] = useState({});
  const [initialSettings, setInitialSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Navigation Links State (Quick Links & Legal Links)
  const [quickLinks, setQuickLinks] = useState([]);
  const [legalLinks, setLegalLinks] = useState([]);

  // Active Editor Tab ('all' | 'col1' | 'col2' | 'col3' | 'col4' | 'copyright')
  const [activeTab, setActiveTab] = useState('col1');

  // New Link Modal / Inline Form State
  const [newLinkModal, setNewLinkModal] = useState({
    isOpen: false,
    groupLocation: 'footer_quick', // 'footer_quick' | 'footer_legal'
    label: '',
    url: '',
    target: '_self'
  });

  const [editingLink, setEditingLink] = useState(null);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    }
  };

  // Fetch all footer settings and navigation items
  const loadFooterData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, navRes] = await Promise.all([
        api.get('/settings/admin'),
        api.get('/navigation/admin')
      ]);

      if (settingsRes.data && settingsRes.data.success) {
        const map = {};
        (settingsRes.data.settings || []).forEach(s => {
          map[s.setting_key] = s.setting_value !== null ? s.setting_value : '';
        });
        setSettings(map);
        setInitialSettings(map);
      }

      if (navRes.data && navRes.data.success) {
        const allNav = navRes.data.items || [];
        setQuickLinks(allNav.filter(item => item.group_location === 'footer_quick'));
        setLegalLinks(allNav.filter(item => item.group_location === 'footer_legal'));
      }
    } catch (err) {
      console.error('Failed to load footer data:', err);
      showNotification('error', 'Failed to load footer configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFooterData();
  }, []);

  // Track if any site settings have changed
  const isDirty = useMemo(() => {
    return Object.keys(settings).some(
      key => settings[key] !== (initialSettings[key] !== undefined ? initialSettings[key] : '')
    );
  }, [settings, initialSettings]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save all changed settings
  const handleSaveSettings = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      const changedPayload = {};
      Object.keys(settings).forEach(key => {
        if (settings[key] !== (initialSettings[key] !== undefined ? initialSettings[key] : '')) {
          changedPayload[key] = settings[key];
        }
      });

      const res = await api.put('/settings/bulk', { settings: changedPayload });
      if (res.data && res.data.success) {
        setInitialSettings({ ...settings });
        if (refreshSettings) refreshSettings();
        showNotification('success', 'Footer settings updated successfully!');
      } else {
        showNotification('error', res.data?.message || 'Failed to save footer settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      showNotification('error', err.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Add Navigation Link (Quick Link or Legal Link)
  const handleSaveNewLink = async (e) => {
    e.preventDefault();
    if (!newLinkModal.label.trim() || !newLinkModal.url.trim()) return;

    try {
      const payload = {
        group_location: newLinkModal.groupLocation,
        label: newLinkModal.label.trim(),
        url: newLinkModal.url.trim(),
        target: newLinkModal.target,
        item_type: newLinkModal.url.startsWith('#') ? 'hash' : (newLinkModal.url.startsWith('http') ? 'external' : 'route'),
        sort_order: (newLinkModal.groupLocation === 'footer_quick' ? quickLinks.length : legalLinks.length) + 1,
        is_active: 1
      };

      if (editingLink) {
        await api.put(`/navigation/${editingLink.id}`, payload);
        showNotification('success', 'Footer link updated successfully!');
      } else {
        await api.post('/navigation', payload);
        showNotification('success', 'New footer link added!');
      }

      setNewLinkModal({ isOpen: false, groupLocation: 'footer_quick', label: '', url: '', target: '_self' });
      setEditingLink(null);
      loadFooterData();
      if (refreshNavigation) refreshNavigation();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save link');
    }
  };

  // Delete Navigation Link
  const handleDeleteLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link from footer?')) return;
    try {
      await api.delete(`/navigation/${id}`);
      showNotification('success', 'Link removed from footer!');
      loadFooterData();
      if (refreshNavigation) refreshNavigation();
    } catch (err) {
      showNotification('error', 'Failed to delete link');
    }
  };

  // Toggle Link Active State
  const handleToggleLink = async (id) => {
    try {
      await api.patch(`/navigation/${id}/toggle`);
      loadFooterData();
      if (refreshNavigation) refreshNavigation();
    } catch (err) {
      showNotification('error', 'Failed to toggle link status');
    }
  };

  const currentYear = new Date().getFullYear();
  const copyrightPreview = (settings.footer_copyright || '© {year} SRJ Global Technologies. All rights reserved.').replace('{year}', currentYear);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-xs">Loading complete footer suite...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner & Actions Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Layout size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                Footer Management Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Full 4-column visual control over branding, quick links, contact channels, reviews, legal links, and copyright.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={loadFooterData}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh from server"
          >
            <RefreshCw size={16} />
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={!isDirty || isSaving}
            className={`px-6 py-3 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md ${
              isDirty 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{isSaving ? 'Saving...' : isDirty ? 'Save All Footer Changes' : 'Saved & Up-to-date'}</span>
          </button>
        </div>
      </div>

      {/* Column Switcher Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-slate-100/80 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('col1')}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'col1'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Share2 size={14} />
          <span>Col 1: Brand & Socials</span>
        </button>

        <button
          onClick={() => setActiveTab('col2')}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'col2'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LinkIcon size={14} />
          <span>Col 2: Quick Links ({quickLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('col3')}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'col3'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Phone size={14} />
          <span>Col 3: Get In Touch</span>
        </button>

        <button
          onClick={() => setActiveTab('col4')}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'col4'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Star size={14} />
          <span>Col 4: Review Us & Legal</span>
        </button>

        <button
          onClick={() => setActiveTab('legal-policies')}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'legal-policies'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck size={14} />
          <span>Legal Policies Content</span>
        </button>

        <button
          onClick={() => setActiveTab('copyright')}
          className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 col-span-2 md:col-span-1 ${
            activeTab === 'copyright'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layout size={14} />
          <span>Bottom Bar & Copyright</span>
        </button>
      </div>

      {/* Editor Main Panels */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        
        {/* ================= COLUMN 1: BRAND & SOCIAL MEDIA ================= */}
        {activeTab === 'col1' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                Column 1: Brand Summary & Social Profiles
              </h3>
              <p className="text-xs text-slate-500">
                Controls the logo description and official social media icons shown under the brand emblem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Company Name (Brand Header)
                </label>
                <input
                  type="text"
                  value={settings.company_name || ''}
                  onChange={(e) => handleSettingChange('company_name', e.target.value)}
                  placeholder="SRJ Global Technologies"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Footer Logo Image URL (Optional Override)
                </label>
                <input
                  type="text"
                  value={settings.logo_url || ''}
                  onChange={(e) => handleSettingChange('logo_url', e.target.value)}
                  placeholder="https://... or /assets/Logo.png"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Brand Tagline / Footer Bio Description
              </label>
              <textarea
                rows={3}
                value={settings.footer_description || ''}
                onChange={(e) => handleSettingChange('footer_description', e.target.value)}
                placeholder="Innovative digital solutions: we build high-quality websites, mobile apps, and custom enterprise platforms for growing brands."
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Social Media URLs (Leave blank to hide icon)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Instagram */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0">
                    <FaInstagram size={16} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-700 block mb-0.5">Instagram URL</span>
                    <input
                      type="url"
                      value={settings.social_instagram || ''}
                      onChange={(e) => handleSettingChange('social_instagram', e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-pink-500 font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* Pinterest */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <FaPinterest size={16} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-700 block mb-0.5">Pinterest URL</span>
                    <input
                      type="url"
                      value={settings.social_pinterest || ''}
                      onChange={(e) => handleSettingChange('social_pinterest', e.target.value)}
                      placeholder="https://pinterest.com/..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-red-500 font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* YouTube */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <FaYoutube size={16} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-700 block mb-0.5">YouTube URL</span>
                    <input
                      type="url"
                      value={settings.social_youtube || ''}
                      onChange={(e) => handleSettingChange('social_youtube', e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-red-500 font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FaFacebookF size={15} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-700 block mb-0.5">Facebook URL</span>
                    <input
                      type="url"
                      value={settings.social_facebook || ''}
                      onChange={(e) => handleSettingChange('social_facebook', e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-blue-500 font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* Twitter / X */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center flex-shrink-0">
                    <FaTwitter size={15} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-700 block mb-0.5">X / Twitter URL</span>
                    <input
                      type="url"
                      value={settings.social_twitter || ''}
                      onChange={(e) => handleSettingChange('social_twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-slate-700 font-mono text-[10px]"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <FaLinkedin size={16} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="text-[11px] font-bold text-slate-700 block mb-0.5">LinkedIn URL</span>
                    <input
                      type="url"
                      value={settings.social_linkedin || ''}
                      onChange={(e) => handleSettingChange('social_linkedin', e.target.value)}
                      placeholder="https://linkedin.com/..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-blue-700 font-mono text-[10px]"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ================= COLUMN 2: QUICK LINKS ================= */}
        {activeTab === 'col2' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1">
                  Column 2: Quick Links
                </h3>
                <p className="text-xs text-slate-500">
                  Manage the column header title and navigation links rendered in Column 2.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingLink(null);
                  setNewLinkModal({ isOpen: true, groupLocation: 'footer_quick', label: '', url: '', target: '_self' });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm self-start"
              >
                <Plus size={14} />
                <span>Add Quick Link</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Column Header Title
              </label>
              <input
                type="text"
                value={settings.footer_col2_title || 'Quick Links'}
                onChange={(e) => handleSettingChange('footer_col2_title', e.target.value)}
                placeholder="Quick Links"
                className="w-full max-w-md px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            {/* Links List */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Quick Links in Column 2 ({quickLinks.length})
              </span>

              {quickLinks.map((link) => (
                <div
                  key={link.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {link.sort_order || '•'}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {link.label}
                      </span>
                      <code className="text-[11px] text-blue-600 font-mono">
                        {link.url}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleLink(link.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        link.is_active 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {link.is_active ? 'Active' : 'Hidden'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingLink(link);
                        setNewLinkModal({
                          isOpen: true,
                          groupLocation: 'footer_quick',
                          label: link.label,
                          url: link.url,
                          target: link.target || '_self'
                        });
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 transition cursor-pointer"
                      title="Edit link"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete link"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {quickLinks.length === 0 && (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 text-xs">
                  No quick links found. Click "+ Add Quick Link" above to add pages to Column 2.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= COLUMN 3: GET IN TOUCH ================= */}
        {activeTab === 'col3' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                Column 3: Contact Channels & Location
              </h3>
              <p className="text-xs text-slate-500">
                Configure contact labels, direct email, phone numbers, WhatsApp, and physical office address.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Column Header Title
              </label>
              <input
                type="text"
                value={settings.footer_col3_title || 'Get In Touch'}
                onChange={(e) => handleSettingChange('footer_col3_title', e.target.value)}
                placeholder="Get In Touch"
                className="w-full max-w-md px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Email Section */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Mail size={14} className="text-blue-600" />
                  <span>Email Channel</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sub-label Text</label>
                  <input
                    type="text"
                    value={settings.footer_col3_email_label || 'EMAIL'}
                    onChange={(e) => handleSettingChange('footer_col3_email_label', e.target.value)}
                    placeholder="EMAIL"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Contact Email Address</label>
                  <input
                    type="email"
                    value={settings.contact_email || ''}
                    onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                    placeholder="srjglobaltechnology@gmail.com"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Phone & WhatsApp Section */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                  <Phone size={14} className="text-emerald-600" />
                  <span>Phone & WhatsApp</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sub-label Text</label>
                  <input
                    type="text"
                    value={settings.footer_col3_phone_label || 'PHONE & WHATSAPP'}
                    onChange={(e) => handleSettingChange('footer_col3_phone_label', e.target.value)}
                    placeholder="PHONE & WHATSAPP"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={settings.contact_phone || ''}
                      onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                      placeholder="+91 99904 30305"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">WhatsApp Phone</label>
                    <input
                      type="text"
                      value={settings.whatsapp_phone || ''}
                      onChange={(e) => handleSettingChange('whatsapp_phone', e.target.value)}
                      placeholder="+91 92667 06599"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Office Location Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <MapPin size={14} className="text-rose-600" />
                <span>Physical Office Location</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sub-label Text</label>
                  <input
                    type="text"
                    value={settings.footer_col3_office_label || 'OFFICE'}
                    onChange={(e) => handleSettingChange('footer_col3_office_label', e.target.value)}
                    placeholder="OFFICE"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Office Address</label>
                  <input
                    type="text"
                    value={settings.office_address || ''}
                    onChange={(e) => handleSettingChange('office_address', e.target.value)}
                    placeholder="C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Google Maps Navigation Link</label>
                <input
                  type="url"
                  value={settings.google_maps_url || ''}
                  onChange={(e) => handleSettingChange('google_maps_url', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 font-mono text-[11px]"
                />
              </div>
            </div>

          </div>
        )}

        {/* ================= COLUMN 4: REVIEW US & LEGAL ================= */}
        {activeTab === 'col4' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                Column 4: Customer Review CTA & Legal Links
              </h3>
              <p className="text-xs text-slate-500">
                Manage the Review CTA button, Google Review destination URL, and legal compliance links (Privacy Policy, Terms, etc.).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Column Header Title
                </label>
                <input
                  type="text"
                  value={settings.footer_col4_title || 'Review Us'}
                  onChange={(e) => handleSettingChange('footer_col4_title', e.target.value)}
                  placeholder="Review Us"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Review Button Label
                </label>
                <input
                  type="text"
                  value={settings.footer_review_btn_text || 'Google Review'}
                  onChange={(e) => handleSettingChange('footer_review_btn_text', e.target.value)}
                  placeholder="Google Review"
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Review Subtitle / Feedback Pitch
              </label>
              <textarea
                rows={2}
                value={settings.footer_review_text || ''}
                onChange={(e) => handleSettingChange('footer_review_text', e.target.value)}
                placeholder="Your feedback helps us deliver cutting-edge software products."
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Google Review URL
                </label>
                <input
                  type="url"
                  value={settings.google_review_url || ''}
                  onChange={(e) => handleSettingChange('google_review_url', e.target.value)}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3 mt-4 md:mt-0">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Show Review Button</span>
                  <span className="text-[11px] text-slate-400">Toggle Google Review CTA pill</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.footer_show_review_btn !== '0'}
                  onChange={(e) => handleSettingChange('footer_show_review_btn', e.target.checked ? '1' : '0')}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Legal Links Management */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Footer Legal Compliance Links ({legalLinks.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Links rendered right below the Google Review button.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingLink(null);
                    setNewLinkModal({ isOpen: true, groupLocation: 'footer_legal', label: '', url: '', target: '_self' });
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <Plus size={13} />
                  <span>Add Legal Link</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {legalLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs"
                  >
                    <span className="font-bold text-slate-800">{link.label}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{link.url}</span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLink(link);
                          setNewLinkModal({
                            isOpen: true,
                            groupLocation: 'footer_legal',
                            label: link.label,
                            url: link.url,
                            target: link.target || '_self'
                          });
                        }}
                        className="p-1 hover:text-blue-600 cursor-pointer"
                        title="Edit link"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1 hover:text-rose-600 cursor-pointer"
                        title="Delete link"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Shortcut to Edit Legal Policies Content */}
            <div className="mt-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-blue-950">
                    Edit Content Inside Privacy Policy, Terms, or Cookies?
                  </h5>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Customize the full legal clauses, paragraphs, headings, and revision dates.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('legal-policies')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Policy Content Editor</span>
                <span>→</span>
              </button>
            </div>

          </div>
        )}

        {/* ================= LEGAL POLICIES CONTENT TAB ================= */}
        {activeTab === 'legal-policies' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <LegalPoliciesManager onNotify={onNotify || showNotification} />
          </div>
        )}

        {/* ================= BOTTOM BAR & COPYRIGHT ================= */}
        {activeTab === 'copyright' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-1">
                Bottom Bar: Copyright Notice
              </h3>
              <p className="text-xs text-slate-500">
                Define the copyright template string. Use <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-blue-600">{'{year}'}</code> as a placeholder that automatically updates to the current year.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Copyright String Template
              </label>
              <input
                type="text"
                value={settings.footer_copyright || '© {year} SRJ Global Technologies. All rights reserved.'}
                onChange={(e) => handleSettingChange('footer_copyright', e.target.value)}
                placeholder="© {year} SRJ Global Technologies. All rights reserved."
                className="w-full max-w-xl px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 max-w-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Live Public Rendering:
              </span>
              <p className="text-xs font-semibold text-slate-700">
                {copyrightPreview}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ================= REAL-TIME LIVE FOOTER PREVIEW ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Eye size={16} className="text-blue-400" />
            <span>Live Footer Preview (Synchronized with Website)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Updates in real-time as you edit fields above
          </span>
        </div>

        {/* Scaled Visual Representation of Footer */}
        <div className="p-8 sm:p-12 bg-white text-slate-800 font-sans border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            
            {/* Col 1 */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-black text-slate-900">
                  {settings.company_name || 'SRJ Global Technologies'}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-xs">
                {settings.footer_description || 'Innovative digital solutions: we build high-quality websites, mobile apps, and custom enterprise platforms for growing brands.'}
              </p>
              <div className="flex items-center gap-2">
                {['Instagram', 'Pinterest', 'YouTube', 'Facebook', 'Twitter', 'LinkedIn'].map((social, i) => (
                  <span key={i} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-[10px] border border-slate-200">
                    {social[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                {settings.footer_col2_title || 'Quick Links'}
              </h4>
              <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                {quickLinks.map(q => (
                  <span key={q.id} className="hover:text-blue-600 cursor-pointer">{q.label}</span>
                ))}
              </div>
            </div>

            {/* Col 3 */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                {settings.footer_col3_title || 'Get In Touch'}
              </h4>
              <div className="space-y-2 text-xs text-slate-500">
                <div>
                  <span className="text-[10px] font-bold text-slate-900 block">{settings.footer_col3_email_label || 'EMAIL'}</span>
                  <span>{settings.contact_email || 'srjglobaltechnology@gmail.com'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-900 block">{settings.footer_col3_phone_label || 'PHONE & WHATSAPP'}</span>
                  <span>{settings.contact_phone || '+91 99904 30305'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-900 block">{settings.footer_col3_office_label || 'OFFICE'}</span>
                  <span className="line-clamp-2">{settings.office_address || 'C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304'}</span>
                </div>
              </div>
            </div>

            {/* Col 4 */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                {settings.footer_col4_title || 'Review Us'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {settings.footer_review_text || 'Your feedback helps us deliver cutting-edge software products.'}
              </p>
              {settings.footer_show_review_btn !== '0' && (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 text-white text-[11px] font-bold mb-4 shadow-sm">
                  <span>★</span>
                  <span>{settings.footer_review_btn_text || 'Google Review'}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                {legalLinks.map(l => (
                  <span key={l.id}>{l.label}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Bar Preview */}
          <div className="pt-6 mt-8 border-t border-slate-100 text-center sm:text-left text-xs text-slate-400">
            {copyrightPreview}
          </div>
        </div>
      </div>

      {/* Add / Edit Link Modal */}
      {newLinkModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setNewLinkModal({ ...newLinkModal, isOpen: false })}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              {editingLink ? 'Edit Footer Link' : 'Add New Footer Link'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              {newLinkModal.groupLocation === 'footer_quick' ? 'Targeted for Column 2 (Quick Links)' : 'Targeted for Column 4 (Legal Links)'}
            </p>

            <form onSubmit={handleSaveNewLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Link Label *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Careers or Terms of Service"
                  value={newLinkModal.label}
                  onChange={(e) => setNewLinkModal({ ...newLinkModal, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  URL / Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/careers, /terms, or https://..."
                  value={newLinkModal.url}
                  onChange={(e) => setNewLinkModal({ ...newLinkModal, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Open Target
                </label>
                <select
                  value={newLinkModal.target}
                  onChange={(e) => setNewLinkModal({ ...newLinkModal, target: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="_self">Same Tab (_self)</option>
                  <option value="_blank">New Tab (_blank)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewLinkModal({ ...newLinkModal, isOpen: false })}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  {editingLink ? 'Update Link' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
