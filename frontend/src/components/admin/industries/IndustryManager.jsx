import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import IndustryListGrid from './IndustryListGrid';
import IndustryEditorView from './IndustryEditorView';

const INITIAL_FORM_STATE = {
  id: '',
  title: '',
  subtitle: '',
  icon: 'FaRocket',
  color: '#2563EB',
  badge: 'Enterprise Grade',
  description: '',
  features: ['Custom System Architecture', 'Cloud Infrastructure & API Gateway', 'Real-time Analytics Dashboard'],
  benefits: ['Faster Time to Market', 'Enterprise Scalability & Security', 'Reduced Operational Overhead'],
  stats: [
    { number: '99.9%', label: 'Platform Uptime' },
    { number: '45%', label: 'Efficiency Gain' },
    { number: '2.5x', label: 'Faster Time-to-Market' }
  ],
  cta_title: '',
  cta_subtitle: '',
  cta_button_text: 'Contact Solution Team',
  cta_button_url: '/contact',
  sort_order: 0,
  is_active: 1
};

export default function IndustryManager({ onJumpToFaq }) {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  // Editor mode: null (list view) | 'new' | 'edit'
  const [editorMode, setEditorMode] = useState(null);
  const [activeEditorTab, setActiveEditorTab] = useState('identity');

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);

  // Quick inputs for adding item in lists
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [newStatNumber, setNewStatNumber] = useState('');
  const [newStatLabel, setNewStatLabel] = useState('');

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/industries/admin');
      const data = res.data?.industries || res.data || [];
      setIndustries(data);
    } catch (err) {
      console.error('Error fetching industries:', err);
      showNotification('error', 'Failed to load industries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
    setEditorMode('new');
    setActiveEditorTab('identity');
  };

  const handleOpenEdit = (ind) => {
    setEditingId(ind.id);
    setFormData({
      id: ind.id,
      title: ind.title || '',
      subtitle: ind.subtitle || '',
      icon: ind.icon || 'FaRocket',
      color: ind.color || '#2563EB',
      badge: ind.badge || 'Enterprise Grade',
      description: ind.description || '',
      features: Array.isArray(ind.features) ? ind.features : [],
      benefits: Array.isArray(ind.benefits) ? ind.benefits : [],
      stats: Array.isArray(ind.stats) && ind.stats.length > 0 ? ind.stats : [
        { number: '99.9%', label: 'Platform Uptime' },
        { number: '45%', label: 'Efficiency Gain' }
      ],
      cta_title: ind.cta_title || '',
      cta_subtitle: ind.cta_subtitle || '',
      cta_button_text: ind.cta_button_text || 'Contact Solution Team',
      cta_button_url: ind.cta_button_url || '/contact',
      sort_order: ind.sort_order || 0,
      is_active: ind.is_active !== undefined ? ind.is_active : 1
    });
    setEditorMode('edit');
    setActiveEditorTab('identity');
  };

  const handleCloseEditor = () => {
    setEditorMode(null);
    setEditingId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleSaveIndustry = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title?.trim()) {
      showNotification('error', 'Industry Title is required');
      setActiveEditorTab('identity');
      return;
    }

    if (editorMode === 'new' && !formData.id?.trim()) {
      showNotification('error', 'Industry Slug / ID is required');
      setActiveEditorTab('identity');
      return;
    }

    if (!formData.description?.trim()) {
      showNotification('error', 'Overview Description is required');
      setActiveEditorTab('hero');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: formData.id.trim().toLowerCase(),
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        icon: formData.icon.trim(),
        color: formData.color.trim(),
        badge: formData.badge.trim(),
        description: formData.description.trim(),
        features: formData.features,
        benefits: formData.benefits,
        stats: formData.stats,
        cta_title: formData.cta_title?.trim() || null,
        cta_subtitle: formData.cta_subtitle?.trim() || null,
        cta_button_text: formData.cta_button_text?.trim() || 'Contact Solution Team',
        cta_button_url: formData.cta_button_url?.trim() || '/contact',
        sort_order: parseInt(formData.sort_order, 10) || 0,
        is_active: parseInt(formData.is_active, 10) === 1 ? 1 : 0
      };

      if (editorMode === 'edit') {
        await api.put(`/industries/${editingId}`, payload);
        showNotification('success', `"${formData.title}" page updated successfully!`);
      } else {
        await api.post('/industries', payload);
        showNotification('success', `"${formData.title}" page created successfully!`);
      }

      await fetchIndustries();
      setEditorMode(null);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving industry:', err);
      showNotification('error', err.response?.data?.message || 'Failed to save industry page');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/industries/${id}/toggle`);
      setIndustries(prev =>
        prev.map(item => item.id === id ? { ...item, is_active: item.is_active ? 0 : 1 } : item)
      );
      showNotification('success', 'Industry status updated');
    } catch (err) {
      showNotification('error', 'Failed to toggle status');
    }
  };

  const handleDelete = async (id, title, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete the "${title}" industry page? This cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/industries/${id}`);
      setIndustries(prev => prev.filter(item => item.id !== id));
      showNotification('success', `"${title}" deleted successfully`);
    } catch (err) {
      showNotification('error', 'Failed to delete industry');
    }
  };

  // Helper functions for dynamic lists
  const addFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData(prev => ({ ...prev, features: [...prev.features, newFeatureInput.trim()] }));
    setNewFeatureInput('');
  };

  const removeFeature = (idx) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const addBenefit = () => {
    if (!newBenefitInput.trim()) return;
    setFormData(prev => ({ ...prev, benefits: [...prev.benefits, newBenefitInput.trim()] }));
    setNewBenefitInput('');
  };

  const removeBenefit = (idx) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== idx)
    }));
  };

  const addStat = () => {
    if (!newStatNumber.trim() || !newStatLabel.trim()) return;
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { number: newStatNumber.trim(), label: newStatLabel.trim() }]
    }));
    setNewStatNumber('');
    setNewStatLabel('');
  };

  const removeStat = (idx) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx)
    }));
  };

  // Filtered industries
  const filteredIndustries = industries.filter(ind => {
    const matchesSearch = !searchQuery.trim()
      ? true
      : ind.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.badge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all'
      ? true
      : statusFilter === 'active'
        ? ind.is_active === 1
        : ind.is_active === 0;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      <ToastAlert notification={notification} />

      {editorMode === null ? (
        <IndustryListGrid
          industries={industries}
          filteredIndustries={filteredIndustries}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onRefresh={fetchIndustries}
          onOpenCreate={handleOpenCreate}
          onOpenEdit={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      ) : (
        <IndustryEditorView
          editorMode={editorMode}
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          activeEditorTab={activeEditorTab}
          setActiveEditorTab={setActiveEditorTab}
          loading={loading}
          onCloseEditor={handleCloseEditor}
          onSaveIndustry={handleSaveIndustry}
          newFeatureInput={newFeatureInput}
          setNewFeatureInput={setNewFeatureInput}
          addFeature={addFeature}
          removeFeature={removeFeature}
          newBenefitInput={newBenefitInput}
          setNewBenefitInput={setNewBenefitInput}
          addBenefit={addBenefit}
          removeBenefit={removeBenefit}
          newStatNumber={newStatNumber}
          setNewStatNumber={setNewStatNumber}
          newStatLabel={newStatLabel}
          setNewStatLabel={setNewStatLabel}
          addStat={addStat}
          removeStat={removeStat}
          onJumpToFaq={onJumpToFaq}
        />
      )}
    </div>
  );
}
