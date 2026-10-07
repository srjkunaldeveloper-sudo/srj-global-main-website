import React, { useState, useEffect } from 'react';
import {
  Handshake, Plus, Edit2, Trash2, CheckCircle2, XCircle,
  Sparkles, Save, ExternalLink, AlertCircle, RefreshCw,
  Lightbulb, Code, Rocket, LineChart, Globe, ShieldCheck,
  Check, X, Search, Layers, Zap, ArrowRight, Eye, Shield
} from 'lucide-react';
import api from '../../config/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const POPULAR_ICONS = [
  'Lightbulb', 'Code', 'Rocket', 'LineChart', 'Globe', 
  'ShieldCheck', 'Sparkles', 'Zap', 'Layers', 'Handshake', 'Shield'
];

const ICON_MAP = {
  Lightbulb,
  Code,
  Rocket,
  LineChart,
  Globe,
  ShieldCheck,
  Sparkles,
  Zap,
  Layers,
  Handshake,
  Shield
};

export default function CollaborationManager() {
  const { settings, refreshSettings } = useSiteSettings();
  const [activeSubTab, setActiveSubTab] = useState('models'); // 'models' | 'content'
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Lightbulb',
    image: '',
    features: [],
    sort_order: 1,
    is_active: true
  });

  // CMS Content State
  const [contentLoading, setContentLoading] = useState(false);
  const [contentData, setContentData] = useState({
    collab_hero_badge: '',
    collab_hero_title: '',
    collab_hero_subtitle: '',
    collab_section_badge: '',
    collab_section_title: '',
    collab_section_subtitle: '',
    collab_cta_title: '',
    collab_cta_subtitle: '',
    collab_cta_btn_primary: '',
    collab_cta_btn_secondary: ''
  });

  // Sync site settings
  useEffect(() => {
    if (settings) {
      setContentData({
        collab_hero_badge: settings.collab_hero_badge || 'Partnership Hub',
        collab_hero_title: settings.collab_hero_title || 'Build The Future Together.',
        collab_hero_subtitle: settings.collab_hero_subtitle || 'We don\'t just write code; we build businesses. Explore how we partner with you at every stage of your digital journey to ensure scalable and sustainable success.',
        collab_section_badge: settings.collab_section_badge || 'OUR OFFERINGS',
        collab_section_title: settings.collab_section_title || 'Collaboration Models',
        collab_section_subtitle: settings.collab_section_subtitle || 'End-to-end technological and strategic support for your business.',
        collab_cta_title: settings.collab_cta_title || 'Ready to Transform Your Idea?',
        collab_cta_subtitle: settings.collab_cta_subtitle || 'Let\'s build something extraordinary together. Connect with our engineering and strategy experts today.',
        collab_cta_btn_primary: settings.collab_cta_btn_primary || 'Discuss Your Project',
        collab_cta_btn_secondary: settings.collab_cta_btn_secondary || 'Explore Services'
      });
    }
  }, [settings]);

  // Fetch Models
  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/collaboration/admin');
      if (res.data?.success) {
        setModels(res.data.data || []);
      }
    } catch (err) {
      // Fallback to public if admin endpoint issues
      try {
        const fallbackRes = await api.get('/collaboration');
        if (fallbackRes.data?.success) {
          setModels(fallbackRes.data.data || []);
        }
      } catch (e) {
        showMessage('error', 'Failed to load collaboration models');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingModel(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Lightbulb',
      image: '',
      features: ['Market Research', 'Feasibility Analysis'],
      sort_order: (models.length > 0 ? Math.max(...models.map(m => m.sort_order || 0)) + 1 : 1),
      is_active: true
    });
    setNewFeatureInput('');
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (model) => {
    setEditingModel(model);
    setFormData({
      title: model.title || '',
      description: model.description || '',
      icon: model.icon || 'Lightbulb',
      image: model.image || '',
      features: Array.isArray(model.features) ? [...model.features] : [],
      sort_order: model.sort_order ?? 1,
      is_active: Boolean(model.is_active)
    });
    setNewFeatureInput('');
    setModalOpen(true);
  };

  // Add Feature Tag
  const handleAddFeature = () => {
    const trimmed = newFeatureInput.trim();
    if (trimmed && !formData.features.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, trimmed]
      }));
      setNewFeatureInput('');
    }
  };

  // Remove Feature Tag
  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Save Model (Create or Update)
  const handleSaveModel = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showMessage('error', 'Title and description are required');
      return;
    }

    setActionLoading(true);
    try {
      if (editingModel) {
        await api.put(`/collaboration/${editingModel.id}`, formData);
        showMessage('success', 'Collaboration model updated successfully!');
      } else {
        await api.post('/collaboration', formData);
        showMessage('success', 'Collaboration model created successfully!');
      }
      setModalOpen(false);
      fetchModels();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to save collaboration model');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Model
  const handleDeleteModel = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setActionLoading(true);
    try {
      await api.delete(`/collaboration/${id}`);
      showMessage('success', `"${title}" has been deleted.`);
      fetchModels();
    } catch (err) {
      showMessage('error', 'Failed to delete collaboration model');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Toggle Active Status
  const handleToggleActive = async (model) => {
    setActionLoading(true);
    try {
      await api.put(`/collaboration/${model.id}`, {
        is_active: !model.is_active
      });
      showMessage('success', `Model set to ${!model.is_active ? 'Active' : 'Inactive'}`);
      fetchModels();
    } catch (err) {
      showMessage('error', 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Header & CTA CMS Content
  const handleSaveContent = async (e) => {
    e.preventDefault();
    setContentLoading(true);
    try {
      const payload = Object.entries(contentData).map(([setting_key, setting_value]) => ({
        setting_key,
        setting_value,
        group_name: 'collaboration'
      }));

      await api.put('/settings/bulk', { settings: payload });
      await refreshSettings();
      showMessage('success', 'Collaboration page header and CTA settings saved successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to save content settings');
    } finally {
      setContentLoading(false);
    }
  };

  // Filtered models
  const filteredModels = models.filter(m => {
    const q = searchTerm.toLowerCase();
    const titleMatch = (m.title || '').toLowerCase().includes(q);
    const descMatch = (m.description || '').toLowerCase().includes(q);
    const featMatch = Array.isArray(m.features) && m.features.some(f => f.toLowerCase().includes(q));
    return titleMatch || descMatch || featMatch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all shadow-sm ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Handshake size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">Collaboration Manager</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  /collaboration
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage collaboration models, service deliverables, hero text, and client conversion CTAs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/collaboration"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Eye size={14} />
              View Live Page
              <ExternalLink size={12} className="text-slate-400" />
            </a>
            <button
              onClick={fetchModels}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              title="Refresh models"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-100 mt-6 pt-2">
          <button
            onClick={() => setActiveSubTab('models')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeSubTab === 'models'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Layers size={16} />
            Collaboration Models (Cards)
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold ml-1">
              {models.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('content')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeSubTab === 'content'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sparkles size={16} />
            Page Content & CMS (Hero & CTA)
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: COLLABORATION MODELS (CARDS) */}
      {activeSubTab === 'models' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models by title or deliverables..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <Plus size={16} />
              Add Collaboration Model
            </button>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <RefreshCw size={24} className="animate-spin mx-auto text-slate-400 mb-2" />
              <p className="text-xs text-slate-500 font-semibold">Loading collaboration models...</p>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <Handshake size={36} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No collaboration models found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {searchTerm ? 'No models match your search query.' : 'Click "Add Collaboration Model" to create the first card.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.map((model) => {
                const IconComponent = ICON_MAP[model.icon] || Lightbulb;
                return (
                  <div
                    key={model.id}
                    className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                      model.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                    }`}
                  >
                    <div>
                      {/* Top Meta: Position & Status */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                          #{model.sort_order}
                        </span>

                        <button
                          onClick={() => handleToggleActive(model)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            model.is_active 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {model.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {model.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </div>

                      {/* Icon & Title */}
                      <div className="flex items-start gap-3.5 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
                          <IconComponent size={20} strokeWidth={1.8} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">{model.title}</h3>
                          <span className="text-[10px] font-mono text-slate-400">icon: {model.icon}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {model.description}
                      </p>

                      {/* Feature Items Pills */}
                      {Array.isArray(model.features) && model.features.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Key Deliverables ({model.features.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {model.features.map((feat, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                              >
                                <Check size={10} className="text-slate-500" />
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(model)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      >
                        <Edit2 size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteModel(model.id, model.title)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: PAGE CONTENT & CMS */}
      {activeSubTab === 'content' && (
        <form onSubmit={handleSaveContent} className="space-y-6">
          {/* Hero Section Configuration */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hero Section CMS</h3>
                <p className="text-xs text-slate-500 mt-0.5">Top banner headline, badge, and descriptive paragraph.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Hero Area</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Hero Top Badge
                </label>
                <input
                  type="text"
                  value={contentData.collab_hero_badge}
                  onChange={(e) => setContentData({ ...contentData, collab_hero_badge: e.target.value })}
                  placeholder="e.g. Partnership Hub"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={contentData.collab_hero_title}
                  onChange={(e) => setContentData({ ...contentData, collab_hero_title: e.target.value })}
                  placeholder="e.g. Build The Future Together."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  rows={3}
                  value={contentData.collab_hero_subtitle}
                  onChange={(e) => setContentData({ ...contentData, collab_hero_subtitle: e.target.value })}
                  placeholder="Explain your collaboration philosophy..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Offerings Section Configuration */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Offerings Section Header CMS</h3>
                <p className="text-xs text-slate-500 mt-0.5">Section header above the 6 collaboration model cards.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Grid Area</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Section Small Label
                </label>
                <input
                  type="text"
                  value={contentData.collab_section_badge}
                  onChange={(e) => setContentData({ ...contentData, collab_section_badge: e.target.value })}
                  placeholder="e.g. OUR OFFERINGS"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={contentData.collab_section_title}
                  onChange={(e) => setContentData({ ...contentData, collab_section_title: e.target.value })}
                  placeholder="e.g. Collaboration Models"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={contentData.collab_section_subtitle}
                  onChange={(e) => setContentData({ ...contentData, collab_section_subtitle: e.target.value })}
                  placeholder="e.g. End-to-end technological and strategic support for your business."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner Configuration */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Bottom CTA Banner CMS</h3>
                <p className="text-xs text-slate-500 mt-0.5">Final conversion call-to-action banner at the bottom of the page.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">CTA Area</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  CTA Banner Title
                </label>
                <input
                  type="text"
                  value={contentData.collab_cta_title}
                  onChange={(e) => setContentData({ ...contentData, collab_cta_title: e.target.value })}
                  placeholder="e.g. Ready to Transform Your Idea?"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Primary Button Label
                </label>
                <input
                  type="text"
                  value={contentData.collab_cta_btn_primary}
                  onChange={(e) => setContentData({ ...contentData, collab_cta_btn_primary: e.target.value })}
                  placeholder="e.g. Discuss Your Project"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  CTA Banner Subtitle
                </label>
                <textarea
                  rows={2}
                  value={contentData.collab_cta_subtitle}
                  onChange={(e) => setContentData({ ...contentData, collab_cta_subtitle: e.target.value })}
                  placeholder="e.g. Let's build something extraordinary together..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Secondary Button Label
                </label>
                <input
                  type="text"
                  value={contentData.collab_cta_btn_secondary}
                  onChange={(e) => setContentData({ ...contentData, collab_cta_btn_secondary: e.target.value })}
                  placeholder="e.g. Explore Services"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={contentLoading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {contentLoading ? 'Saving Settings...' : 'Save Collaboration Page Settings'}
            </button>
          </div>
        </form>
      )}

      {/* CREATE / EDIT MODEL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Handshake size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingModel ? 'Edit Collaboration Model' : 'New Collaboration Model'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveModel} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Model Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Idea Validation & Consultation"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this collaboration model includes and achieves..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Icon (Lucide Icon Name)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g. Lightbulb"
                    className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                  />
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
                    {React.createElement(ICON_MAP[formData.icon] || Lightbulb, { size: 18 })}
                  </div>
                </div>

                {/* Popular Icon Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_ICONS.map((iconName) => (
                    <button
                      type="button"
                      key={iconName}
                      onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        formData.icon === iconName
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {React.createElement(ICON_MAP[iconName] || Lightbulb, { size: 12 })}
                      {iconName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Tags / Deliverables */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Key Deliverables / Checklist Items
                </label>
                
                {/* Add new tag */}
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type deliverable and click Add (e.g. Market Research)..."
                    className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Tags List */}
                <div className="flex flex-wrap gap-2 min-h-[38px] p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                  {formData.features.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No deliverables added yet.</span>
                  ) : (
                    formData.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs"
                      >
                        {feat}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                    <span className="ml-3 text-xs font-bold text-slate-700">
                      {formData.is_active ? 'Active & Published' : 'Hidden Draft'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  {actionLoading ? 'Saving...' : (editingModel ? 'Update Model' : 'Create Model')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
