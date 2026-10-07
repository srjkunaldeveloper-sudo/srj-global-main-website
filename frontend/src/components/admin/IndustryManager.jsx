import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Check,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Layers,
  Search,
  ArrowLeft,
  Send,
  Save,
  X,
  BarChart3,
  HelpCircle,
  Compass,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  FaRocket,
  FaBuilding,
  FaGraduationCap,
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaHeartbeat,
  FaCalendarAlt,
  FaUtensils,
  FaTicketAlt,
  FaBriefcase,
  FaStore
} from 'react-icons/fa';
import api from '../../config/api';

const PRESET_ICONS = [
  { name: 'FaRocket', label: 'Rocket (Startups / Innovation)', icon: FaRocket },
  { name: 'FaBuilding', label: 'Building (Enterprise / Real Estate)', icon: FaBuilding },
  { name: 'FaGraduationCap', label: 'Graduation Cap (EdTech / Education)', icon: FaGraduationCap },
  { name: 'FaShoppingCart', label: 'Shopping Cart (E-Commerce & Retail)', icon: FaShoppingCart },
  { name: 'FaShieldAlt', label: 'Shield (Cybersecurity & Fintech)', icon: FaShieldAlt },
  { name: 'FaUsers', label: 'Users (Social Networks & Community)', icon: FaUsers },
  { name: 'FaHeartbeat', label: 'Heartbeat (Healthcare & MedTech)', icon: FaHeartbeat },
  { name: 'FaCalendarAlt', label: 'Calendar (Events & Bookings)', icon: FaCalendarAlt },
  { name: 'FaUtensils', label: 'Utensils (Hospitality & FoodTech)', icon: FaUtensils },
  { name: 'FaTicketAlt', label: 'Ticket (Entertainment & Travel)', icon: FaTicketAlt },
  { name: 'FaBriefcase', label: 'Briefcase (Corporate & B2B Services)', icon: FaBriefcase },
  { name: 'FaStore', label: 'Store (Retail Outlets & POS)', icon: FaStore },
];

const PRESET_COLORS = [
  '#2563EB', '#3B82F6', '#06B6D4', '#10B981', '#14B8A6',
  '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1'
];

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
  const initialFormState = {
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

  const [formData, setFormData] = useState(initialFormState);
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
    setFormData(initialFormState);
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
    setFormData(initialFormState);
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

  const renderIcon = (iconName, color = '#2563EB', size = 20) => {
    const found = PRESET_ICONS.find(i => i.name === iconName);
    const IconComp = found ? found.icon : FaRocket;
    return <IconComp size={size} style={{ color }} />;
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-sm font-semibold transition-all shadow-md ${
          notification.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="cursor-pointer text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* VIEW 1: SECTOR DIRECTORY LIST */}
      {editorMode === null && (
        <>
          {/* Header & Quick Action Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
                <Compass size={14} /> Official Industry Pages CMS
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Industries & Sector Pages Manager
              </h2>
              <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                Configure both the public directory cards on <code>/industries</code> and the complete official sector landing pages on <code>/industries/:slug</code> with custom Hero, Capabilities, ROI Value, Stats, FAQs, and Enterprise CTA.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <a
                href="/industries"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
              >
                <ExternalLink size={14} /> View Public Directory
              </a>
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                <Plus size={16} /> New Industry Sector
              </button>
            </div>
          </div>

          {/* Search, Filter & Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-72">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search industries, slugs, badges..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
              >
                <option value="all">All Status ({industries.length})</option>
                <option value="active">Active Only ({industries.filter(i => i.is_active).length})</option>
                <option value="inactive">Inactive Only ({industries.filter(i => !i.is_active).length})</option>
              </select>
            </div>

            <button
              onClick={fetchIndustries}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer self-end sm:self-auto"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {/* Industry Cards Grid */}
          {filteredIndustries.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
              <Layers size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-slate-600">No industry sectors found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search filter or click &quot;New Industry Sector&quot; to create one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredIndustries.map((ind) => {
                const featuresCount = Array.isArray(ind.features) ? ind.features.length : 0;
                const benefitsCount = Array.isArray(ind.benefits) ? ind.benefits.length : 0;
                const statsCount = Array.isArray(ind.stats) ? ind.stats.length : 0;

                return (
                  <div
                    key={ind.id}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs"
                            style={{
                              backgroundColor: `${ind.color || '#2563EB'}12`,
                              borderColor: `${ind.color || '#2563EB'}25`
                            }}
                          >
                            {renderIcon(ind.icon, ind.color || '#2563EB', 22)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: ind.color || '#2563EB' }}
                              />
                              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                /{ind.id}
                              </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                              {ind.title}
                            </h3>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                          ind.is_active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {ind.is_active ? 'Active' : 'Draft'}
                        </span>
                      </div>

                      {/* Subtitle & Badge */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {ind.badge && (
                          <span
                            className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
                            style={{
                              backgroundColor: `${ind.color || '#2563EB'}10`,
                              color: ind.color || '#2563EB',
                              borderColor: `${ind.color || '#2563EB'}25`
                            }}
                          >
                            {ind.badge}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-500">
                          {ind.subtitle}
                        </span>
                      </div>

                      {/* Overview Paragraph snippet */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                        {ind.description}
                      </p>

                      {/* Metric & Module Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold mb-4 pt-3 border-t border-slate-100">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                          ⚡ {featuresCount} Capabilities
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                          📈 {benefitsCount} ROI Values
                        </span>
                        {statsCount > 0 && (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                            📊 {statsCount} Stats
                          </span>
                        )}
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 ml-auto">
                          Order: {ind.sort_order || 0}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`/industries/${ind.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 text-xs font-bold transition cursor-pointer"
                          title="Open official industry landing page"
                        >
                          <Eye size={13} /> View Page
                        </a>

                        <button
                          onClick={(e) => handleToggleStatus(ind.id, e)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            ind.is_active
                              ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {ind.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(ind)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer shadow-xs"
                        >
                          <Edit size={13} /> Edit Page CMS
                        </button>

                        <button
                          onClick={(e) => handleDelete(ind.id, ind.title, e)}
                          className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                          title="Delete industry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: SECTOR PAGE CMS BUILDER (Full Page Editor) */}
      {editorMode !== null && (
        <div className="space-y-6">
          {/* Top Bar with Back & Save */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseEditor}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                title="Back to Sector List"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {editorMode === 'new' ? 'New Sector' : 'Editing Sector CMS'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    /industries/{formData.id || 'slug'}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {formData.title || 'Untitled Industry Sector'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {editorMode === 'edit' && (
                <a
                  href={`/industries/${editingId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
                >
                  <Eye size={14} /> View Live Page
                </a>
              )}
              <button
                onClick={handleCloseEditor}
                className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveIndustry}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition shadow-md cursor-pointer"
              >
                <Save size={15} /> Save Page Content
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'identity', label: '1. Sector Identity & URL', icon: Compass },
              { id: 'hero', label: '2. Hero & Overview', icon: Sparkles },
              { id: 'capabilities', label: '3. Technical Capabilities', icon: CheckCircle2 },
              { id: 'benefits', label: '4. Strategic ROI & Value', icon: TrendingUp },
              { id: 'stats', label: '5. Key Performance Stats', icon: BarChart3 },
              { id: 'cta', label: '6. Enterprise CTA Banner', icon: Send },
              { id: 'faqs', label: '7. Sector FAQs', icon: HelpCircle },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeEditorTab === tab.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <TabIcon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Area (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* TAB 1: IDENTITY & BRANDING */}
              {activeEditorTab === 'identity' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Compass size={18} className="text-blue-600" /> Sector Identity & Official URL
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Sets the unique URL slug, title, badge, brand accent color, and icon for this sector.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Industry Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Ecommerce & Retail"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        URL Slug / ID *
                      </label>
                      <input
                        type="text"
                        value={formData.id}
                        disabled={editorMode === 'edit'}
                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                        placeholder="e.g. ecommerce"
                        className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-900 ${
                          editorMode === 'edit' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''
                        }`}
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        URL: <code>/industries/{formData.id || 'slug'}</code> (lowercase, hyphens only)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Header Badge Label *
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="e.g. Revenue Boost or Enterprise Ready"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Sort Order & Status
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
                          placeholder="Sort order"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-900"
                        />
                        <select
                          value={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value, 10) })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900"
                        >
                          <option value={1}>Active (Visible)</option>
                          <option value={0}>Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Brand Accent Color *
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-10 h-10 rounded-xl border border-slate-200 p-1 cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#2563EB"
                        className="w-28 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-slate-900"
                      />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {PRESET_COLORS.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setFormData({ ...formData, color: c })}
                            className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                              formData.color === c ? 'border-black scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Sector Icon *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                      {PRESET_ICONS.map(item => {
                        const IconComp = item.icon;
                        const isSelected = formData.icon === item.name;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: item.name })}
                            className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-blue-500 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                            }`}
                          >
                            <IconComp size={18} style={{ color: isSelected ? formData.color : '#64748B' }} />
                            <span className="text-xs font-bold truncate text-slate-800">
                              {item.name.replace('Fa', '')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('hero')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                    >
                      Next: Hero & Overview <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: HERO & OVERVIEW */}
              {activeEditorTab === 'hero' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-500" /> Hero & Overview Section
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Displayed right at the top of the official page <code>/industries/{formData.id || 'slug'}</code>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Tagline / Subtitle *
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="e.g. Scalable Digital Stores & Payment Gateway Integration"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Appears directly beneath the main Industry Title.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Comprehensive Industry Overview *
                    </label>
                    <textarea
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detailed overview describing your software engineering capabilities, domain expertise, enterprise architectural approach, and business solutions for this specific industry sector..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 resize-none leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      This is the main narrative section that enterprise clients read to understand your domain authority.
                    </p>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('identity')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to Identity
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('capabilities')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                    >
                      Next: Technical Capabilities <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CAPABILITIES & MODULES */}
              {activeEditorTab === 'capabilities' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-blue-600" /> Core Capabilities & Technical Modules
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Rendered as individual enterprise capability cards with checkmark icons on the official page.
                    </p>
                  </div>

                  {/* Add Capability Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                      placeholder="e.g. Microservices-based Architecture, Automated CI/CD Pipelines..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Module
                    </button>
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-2">
                    {formData.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl group hover:bg-white hover:border-slate-300 transition"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs"
                            style={{
                              backgroundColor: `${formData.color}15`,
                              borderColor: `${formData.color}30`,
                              color: formData.color
                            }}
                          >
                            <Check size={14} />
                          </span>
                          <span className="text-xs font-bold text-slate-800">{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Remove capability"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                    {formData.features.length === 0 && (
                      <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-2xl">
                        No capabilities added yet. Type a capability name above and press Enter.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('hero')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to Hero
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('benefits')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                    >
                      Next: Strategic ROI <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: STRATEGIC ROI & BENEFITS */}
              {activeEditorTab === 'benefits' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp size={18} className="text-emerald-600" /> Strategic Business Value & ROI Benefits
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Highlights tangible business outcomes, risk reduction, operational cost savings, and scale.
                    </p>
                  </div>

                  {/* Add Benefit Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBenefitInput}
                      onChange={(e) => setNewBenefitInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                      placeholder="e.g. 40% Reduction in Infrastructure Costs, 99.99% Transaction Security..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                    />
                    <button
                      type="button"
                      onClick={addBenefit}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Benefit
                    </button>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-2">
                    {formData.benefits.map((ben, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl group hover:bg-white hover:border-emerald-200 transition"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 text-xs">
                            <ShieldCheck size={14} />
                          </span>
                          <span className="text-xs font-bold text-slate-800">{ben}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBenefit(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Remove benefit"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                    {formData.benefits.length === 0 && (
                      <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-2xl">
                        No benefits added yet. Type a benefit above and press Enter.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('capabilities')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to Capabilities
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('stats')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                    >
                      Next: Key Stats <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: KEY STATS & METRICS */}
              {activeEditorTab === 'stats' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 size={18} className="text-indigo-600" /> Key Performance Stats & Metrics
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Rendered in a prominent high-impact 4-column metric bar directly above core capabilities.
                    </p>
                  </div>

                  {/* Add Stat Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newStatNumber}
                      onChange={(e) => setNewStatNumber(e.target.value)}
                      placeholder="Value (e.g. 99.9%, 10M+, 3.5x)"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900"
                    />
                    <input
                      type="text"
                      value={newStatLabel}
                      onChange={(e) => setNewStatLabel(e.target.value)}
                      placeholder="Label (e.g. Platform SLA, Processed Volume)"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                    />
                    <button
                      type="button"
                      onClick={addStat}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus size={14} /> Add Metric
                    </button>
                  </div>

                  {/* Stats Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.stats.map((st, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 relative group flex flex-col justify-between"
                      >
                        <button
                          type="button"
                          onClick={() => removeStat(idx)}
                          className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                        <div className="text-2xl font-black mb-1" style={{ color: formData.color }}>
                          {st.number}
                        </div>
                        <div className="text-xs font-bold text-slate-600">
                          {st.label}
                        </div>
                      </div>
                    ))}
                    {formData.stats.length === 0 && (
                      <p className="col-span-full text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-2xl">
                        No stats added. (Optional: Leave empty if you do not want metric numbers on this page).
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('benefits')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to ROI
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('cta')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                    >
                      Next: CTA Banner <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: ENTERPRISE CTA BANNER */}
              {activeEditorTab === 'cta' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Send size={18} className="text-purple-600" /> Bottom Enterprise CTA Banner
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Customize the call-to-action banner shown at the bottom of this official sector landing page.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      CTA Heading
                    </label>
                    <input
                      type="text"
                      value={formData.cta_title}
                      onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
                      placeholder={`Default: Ready to modernize your ${formData.title || 'industry'} operations?`}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-slate-900"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Leave empty to use automatic title.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      CTA Subtitle / Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={formData.cta_subtitle}
                      onChange={(e) => setFormData({ ...formData, cta_subtitle: e.target.value })}
                      placeholder="Default: Connect directly with our industry architects to review blueprints, integration roadmaps, and rapid delivery schedules."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Primary Button Label
                      </label>
                      <input
                        type="text"
                        value={formData.cta_button_text}
                        onChange={(e) => setFormData({ ...formData, cta_button_text: e.target.value })}
                        placeholder="Contact Solution Team"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Primary Button Link
                      </label>
                      <input
                        type="text"
                        value={formData.cta_button_url}
                        onChange={(e) => setFormData({ ...formData, cta_button_url: e.target.value })}
                        placeholder="/contact"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('stats')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to Stats
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('faqs')}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                    >
                      Next: FAQs & Help <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: SECTOR FAQS */}
              {activeEditorTab === 'faqs' && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle size={18} className="text-blue-600" /> Page-Specific FAQs Integration
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Targeted FAQs for this specific sector automatically appear on this official page.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-900 space-y-2 leading-relaxed">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles size={14} /> How Sector FAQs Work:
                    </p>
                    <p>
                      The official page at <code>/industries/{formData.id || 'slug'}</code> automatically checks for FAQs created with the category:
                    </p>
                    <div className="bg-white px-3 py-2 rounded-xl font-mono text-blue-800 font-bold border border-blue-200">
                      Industry - {formData.title || 'Untitled'}
                    </div>
                    <p>
                      If any FAQs exist with that category name in the FAQ tab, they will instantly render with an accordion on this page. If zero FAQs exist, the section gracefully stays hidden.
                    </p>
                  </div>

                  {onJumpToFaq && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onJumpToFaq(`Industry - ${formData.title}`)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                      >
                        <Plus size={15} /> Add FAQ for &quot;{formData.title || 'this sector'}&quot; in FAQ Manager
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveEditorTab('cta')}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to CTA Banner
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveIndustry}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                    >
                      <Save size={14} /> Save Page Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Live Wireframe / Desktop Preview Card (Right Column) */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] sticky top-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye size={13} /> Live Page Preview
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    /industries/{formData.id || 'slug'}
                  </span>
                </div>

                {/* Mini Hero Card */}
                <div
                  className="rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden mb-4"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none -mr-10 -mt-10"
                    style={{ backgroundColor: formData.color }}
                  />

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${formData.color}15`,
                          color: formData.color,
                          borderColor: `${formData.color}30`
                        }}
                      >
                        {formData.badge || 'Badge'}
                      </span>
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${formData.color}12`,
                          borderColor: `${formData.color}25`
                        }}
                      >
                        {renderIcon(formData.icon, formData.color, 16)}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900 leading-tight">
                        {formData.title || 'Sector Title'}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        {formData.subtitle || 'Subtitle / Tagline'}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                      {formData.description || 'Industry overview narrative will appear here...'}
                    </p>
                  </div>
                </div>

                {/* Mini Stats Bar */}
                {formData.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {formData.stats.slice(0, 4).map((st, i) => (
                      <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                        <div className="text-sm font-black" style={{ color: formData.color }}>
                          {st.number}
                        </div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate">
                          {st.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mini Capabilities Pills */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Capabilities ({formData.features.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.features.slice(0, 4).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md truncate max-w-[140px]">
                        ✓ {f}
                      </span>
                    ))}
                    {formData.features.length > 4 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-md">
                        +{formData.features.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini CTA banner */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-2">
                  <div className="text-xs font-bold line-clamp-1">
                    {formData.cta_title || `Ready to modernize your ${formData.title || 'operations'}?`}
                  </div>
                  <div className="inline-block px-3 py-1 bg-white text-slate-900 rounded-full text-[10px] font-black">
                    {formData.cta_button_text || 'Contact Team'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
