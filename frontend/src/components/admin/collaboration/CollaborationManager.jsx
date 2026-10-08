import React, { useState, useEffect } from 'react';
import {
  Handshake, RefreshCw, ExternalLink, Eye, Layers, Sparkles
} from 'lucide-react';
import api from '../../../config/api';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import CollabModelsGrid from './CollabModelsGrid';
import CollabModelModal from './CollabModelModal';
import CollabContentCms from './CollabContentCms';
import ToastAlert from '../shared/ToastAlert';

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

  // Add/Remove Feature
  const handleAddFeature = () => {
    const trimmed = newFeatureInput.trim();
    if (trimmed && !formData.features.includes(trimmed)) {
      setFormData(prev => ({ ...prev, features: [...prev.features, trimmed] }));
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Save Model
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

  // Toggle Active
  const handleToggleActive = async (model) => {
    setActionLoading(true);
    try {
      await api.put(`/collaboration/${model.id}`, { is_active: !model.is_active });
      showMessage('success', `Model set to ${!model.is_active ? 'Active' : 'Inactive'}`);
      fetchModels();
    } catch (err) {
      showMessage('error', 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Content
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

  const filteredModels = models.filter(m => {
    const q = searchTerm.toLowerCase();
    const titleMatch = (m.title || '').toLowerCase().includes(q);
    const descMatch = (m.description || '').toLowerCase().includes(q);
    const featMatch = Array.isArray(m.features) && m.features.some(f => f.toLowerCase().includes(q));
    return titleMatch || descMatch || featMatch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      <ToastAlert message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Main Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Eye size={14} />
              View Live Page
              <ExternalLink size={12} className="text-slate-400" />
            </a>
            <button
              onClick={fetchModels}
              disabled={loading}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
              title="Refresh models"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 mt-6 pt-2">
          <button
            onClick={() => setActiveSubTab('models')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
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

      {/* Sub-Tab 1: Models Grid */}
      {activeSubTab === 'models' && (
        <CollabModelsGrid
          models={models}
          filteredModels={filteredModels}
          loading={loading}
          actionLoading={actionLoading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenAddModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
          onToggleActive={handleToggleActive}
          onDeleteModel={handleDeleteModel}
        />
      )}

      {/* Sub-Tab 2: Content CMS */}
      {activeSubTab === 'content' && (
        <CollabContentCms
          contentData={contentData}
          setContentData={setContentData}
          onSaveContent={handleSaveContent}
          contentLoading={contentLoading}
        />
      )}

      {/* Modal */}
      <CollabModelModal
        isOpen={modalOpen}
        editingModel={editingModel}
        formData={formData}
        setFormData={setFormData}
        newFeatureInput={newFeatureInput}
        setNewFeatureInput={setNewFeatureInput}
        onAddFeature={handleAddFeature}
        onRemoveFeature={handleRemoveFeature}
        onSave={handleSaveModel}
        onClose={() => setModalOpen(false)}
        actionLoading={actionLoading}
      />
    </div>
  );
}
