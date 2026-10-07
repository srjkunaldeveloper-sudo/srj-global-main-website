import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, CheckCircle2, XCircle, Star, Sparkles,
  Layers, Package, MessageSquareQuote, Check, AlertCircle, RefreshCw,
  LayoutTemplate, Save, ExternalLink
} from 'lucide-react';
import api from '../../config/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const PricingPlanManager = ({ inquiries = [] }) => {
  const { refreshSettings } = useSiteSettings();
  const [activeSubTab, setActiveSubTab] = useState('plans'); // 'plans' | 'addons' | 'content' | 'inquiries'
  const [plans, setPlans] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Plan Modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    display_name: '',
    price_display: '',
    pricing_label: 'Estimated Investment',
    cta_text: 'Discuss Your Project',
    description: '',
    featuresText: '',
    badge: '',
    is_popular: false,
    sort_order: 0,
    is_active: true
  });

  // Addon Modal state
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [addonForm, setAddonForm] = useState({
    name: '',
    price_display: '',
    description: '',
    sort_order: 0,
    is_active: true
  });

  // Page Content / CMS state
  const [pageContentForm, setPageContentForm] = useState({
    pricing_hero_badge: 'Transparent Pricing',
    pricing_hero_title: 'Flexible Pricing That Grows With You',
    pricing_hero_subtitle: 'Choose the engagement model that fits your business. From startups to enterprise organizations, we provide scalable software solutions with transparent pricing and no hidden costs.',
    pricing_hero_cta_text: 'Schedule Consultation',
    pricing_hero_cta_url: '/#contact',
    pricing_cta_title: "Need a custom enterprise architecture?",
    pricing_cta_subtitle: "Talk to our senior architects to structure a custom proposal, dedicated pod, or RFP evaluation.",
    pricing_cta_button_text: "Book Architectural Review",
    pricing_cta_button_url: "/#contact"
  });

  // Delete Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null, title: '' });

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const [plansRes, addonsRes, settingsRes] = await Promise.all([
        api.get('/pricing/plans'),
        api.get('/pricing/addons'),
        api.get('/settings').catch(() => ({ data: {} }))
      ]);
      if (plansRes.data?.plans) setPlans(plansRes.data.plans);
      if (addonsRes.data?.addOns) setAddons(addonsRes.data.addOns);

      if (settingsRes.data?.settings) {
        const s = settingsRes.data.settings;
        setPageContentForm(prev => ({
          pricing_hero_badge: s.pricing_hero_badge || prev.pricing_hero_badge,
          pricing_hero_title: s.pricing_hero_title || prev.pricing_hero_title,
          pricing_hero_subtitle: s.pricing_hero_subtitle || prev.pricing_hero_subtitle,
          pricing_hero_cta_text: s.pricing_hero_cta_text || prev.pricing_hero_cta_text,
          pricing_hero_cta_url: s.pricing_hero_cta_url || prev.pricing_hero_cta_url,
          pricing_cta_title: s.pricing_cta_title || prev.pricing_cta_title,
          pricing_cta_subtitle: s.pricing_cta_subtitle || prev.pricing_cta_subtitle,
          pricing_cta_button_text: s.pricing_cta_button_text || prev.pricing_cta_button_text,
          pricing_cta_button_url: s.pricing_cta_button_url || prev.pricing_cta_button_url
        }));
      }
    } catch (err) {
      console.error('Error fetching pricing data:', err);
      notify('error', 'Failed to load pricing data from server');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageContent = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put('/settings/bulk', pageContentForm);
      if (refreshSettings) await refreshSettings();
      notify('success', 'Pricing Page Content & CMS saved successfully!');
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to update page content');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingData();
  }, []);

  // Open Plan Modal
  const openPlanCreate = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      display_name: '',
      price_display: '',
      pricing_label: 'Estimated Investment',
      cta_text: 'Discuss Your Project',
      description: '',
      featuresText: '',
      badge: '',
      is_popular: false,
      sort_order: (plans.length + 1),
      is_active: true
    });
    setPlanModalOpen(true);
  };

  const openPlanEdit = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || '',
      display_name: plan.display_name || '',
      price_display: plan.price_display || '',
      pricing_label: plan.pricing_label || 'Estimated Investment',
      cta_text: plan.cta_text || 'Discuss Your Project',
      description: plan.description || '',
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      badge: plan.badge || '',
      is_popular: Boolean(plan.is_popular),
      sort_order: plan.sort_order ?? 0,
      is_active: Boolean(plan.is_active)
    });
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const features = planForm.featuresText
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

      const payload = {
        name: planForm.name,
        display_name: planForm.display_name,
        price_display: planForm.price_display,
        pricing_label: planForm.pricing_label,
        cta_text: planForm.cta_text,
        description: planForm.description,
        features,
        badge: planForm.badge,
        is_popular: planForm.is_popular,
        sort_order: parseInt(planForm.sort_order, 10) || 0,
        is_active: planForm.is_active
      };

      if (editingPlan) {
        await api.put(`/pricing/plans/${editingPlan.id}`, payload);
        notify('success', 'Plan updated successfully!');
      } else {
        await api.post('/pricing/plans', payload);
        notify('success', 'New pricing plan created successfully!');
      }

      setPlanModalOpen(false);
      fetchPricingData();
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Error saving plan');
    } finally {
      setActionLoading(false);
    }
  };

  // Open Addon Modal
  const openAddonCreate = () => {
    setEditingAddon(null);
    setAddonForm({
      name: '',
      price_display: '',
      description: '',
      sort_order: (addons.length + 1),
      is_active: true
    });
    setAddonModalOpen(true);
  };

  const openAddonEdit = (addon) => {
    setEditingAddon(addon);
    setAddonForm({
      name: addon.name || '',
      price_display: addon.price_display || '',
      description: addon.description || '',
      sort_order: addon.sort_order ?? 0,
      is_active: Boolean(addon.is_active)
    });
    setAddonModalOpen(true);
  };

  const handleSaveAddon = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: addonForm.name,
        price_display: addonForm.price_display,
        description: addonForm.description,
        sort_order: parseInt(addonForm.sort_order, 10) || 0,
        is_active: addonForm.is_active
      };

      if (editingAddon) {
        await api.put(`/pricing/addons/${editingAddon.id}`, payload);
        notify('success', 'Add-on updated successfully!');
      } else {
        await api.post('/pricing/addons', payload);
        notify('success', 'New add-on package created successfully!');
      }

      setAddonModalOpen(false);
      fetchPricingData();
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Error saving add-on');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Action
  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setActionLoading(true);
    try {
      if (deleteConfirm.type === 'plan') {
        await api.delete(`/pricing/plans/${deleteConfirm.id}`);
        notify('success', 'Plan deleted successfully!');
      } else if (deleteConfirm.type === 'addon') {
        await api.delete(`/pricing/addons/${deleteConfirm.id}`);
        notify('success', 'Add-on deleted successfully!');
      }
      setDeleteConfirm({ open: false, type: '', id: null, title: '' });
      fetchPricingData();
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Plan Active
  const handleTogglePlanActive = async (plan) => {
    try {
      await api.put(`/pricing/plans/${plan.id}`, { is_active: !plan.is_active });
      setPlans(plans.map(p => p.id === plan.id ? { ...p, is_active: !p.is_active } : p));
      notify('success', `Plan status changed to ${!plan.is_active ? 'Active' : 'Inactive'}`);
    } catch (err) {
      notify('error', 'Failed to toggle status');
    }
  };

  // Toggle Addon Active
  const handleToggleAddonActive = async (addon) => {
    try {
      await api.put(`/pricing/addons/${addon.id}`, { is_active: !addon.is_active });
      setAddons(addons.map(a => a.id === addon.id ? { ...a, is_active: !a.is_active } : a));
      notify('success', `Add-on status changed to ${!addon.is_active ? 'Active' : 'Inactive'}`);
    } catch (err) {
      notify('error', 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Notification */}
      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold transition-all shadow-sm ${
          message.type === 'error'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header and Sub Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'plans'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Pricing Plans ({plans.length})
          </button>

          <button
            onClick={() => setActiveSubTab('addons')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'addons'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            Add-on Packages ({addons.length})
          </button>

          <button
            onClick={() => setActiveSubTab('content')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'content'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Page Content (CMS)
          </button>

          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            Customer Quotes ({inquiries.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPricingData}
            disabled={loading}
            className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {activeSubTab === 'plans' && (
            <button
              onClick={openPlanCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Add Pricing Plan
            </button>
          )}

          {activeSubTab === 'addons' && (
            <button
              onClick={openAddonCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Add Add-on
            </button>
          )}
        </div>
      </div>

      {/* SUB-TAB 1: PRICING PLANS */}
      {activeSubTab === 'plans' && (
        <div className="space-y-4">
          {loading && plans.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
              Loading pricing plans...
            </div>
          ) : plans.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
              No pricing plans configured yet. Click "Add Pricing Plan" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative ${
                    plan.is_popular
                      ? 'border-blue-400 shadow-[0_12px_40px_rgba(59,130,246,0.12)]'
                      : 'border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
                  } ${!plan.is_active ? 'opacity-60 bg-slate-50/50' : ''}`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                        {plan.name}
                      </span>
                      {plan.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 flex items-center gap-1 border border-blue-200">
                          <Sparkles className="w-2.5 h-2.5" />
                          {plan.badge}
                        </span>
                      )}
                      {plan.is_popular && !plan.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 flex items-center gap-1 border border-amber-200">
                          <Star className="w-2.5 h-2.5" />
                          Popular
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleTogglePlanActive(plan)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                        plan.is_active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Plan Name & Pricing */}
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900 leading-tight">
                      {plan.display_name}
                    </h4>
                    <div className="mt-3">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {plan.price_display}
                      </span>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        {plan.pricing_label || 'Estimated Investment'}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Features list */}
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Features ({plan.features?.length || 0}):</p>
                      <ul className="space-y-1.5 text-xs text-slate-600 max-h-36 overflow-y-auto pr-1">
                        {plan.features?.map((f, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="leading-tight">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Order: #{plan.sort_order}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openPlanEdit(plan)}
                        className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                        title="Edit Plan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ open: true, type: 'plan', id: plan.id, title: plan.display_name })}
                        className="p-2 text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ADD-ON PACKAGES */}
      {activeSubTab === 'addons' && (
        <div className="space-y-4">
          {loading && addons.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
              Loading add-ons...
            </div>
          ) : addons.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
              No add-on packages found. Click "Add Add-on" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all ${
                    !addon.is_active ? 'opacity-60 bg-slate-50/50' : 'border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-slate-900 text-base leading-tight">
                        {addon.name}
                      </h4>
                      <button
                        onClick={() => handleToggleAddonActive(addon)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer shrink-0 transition ${
                          addon.is_active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {addon.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div className="mt-2 text-blue-600 font-extrabold text-sm">
                      {addon.price_display}
                    </div>

                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {addon.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Order: #{addon.sort_order}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openAddonEdit(addon)}
                        className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                        title="Edit Add-on"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ open: true, type: 'addon', id: addon.id, title: addon.name })}
                        className="p-2 text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Delete Add-on"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: CUSTOMER QUOTATION INQUIRIES */}
      {activeSubTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Enterprise Plan Quotes ({inquiries.length})</h3>
            <span className="text-xs text-slate-400">Leads captured from the Pricing calculator modal</span>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
              No plan inquiries registered in the database yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inquiries.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{p.full_name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{p.email} | {p.phone}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                      {p.plan_name}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-medium">
                    <div>
                      <span className="text-slate-400 block">Company:</span>
                      <span className="text-slate-800 font-semibold">{p.company_name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Project:</span>
                      <span className="text-slate-800 font-semibold">{p.project_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Budget:</span>
                      <span className="text-slate-900 font-extrabold">{p.budget || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Configuration & Requirements:</span>
                    <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-2xl">{p.requirements}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-3 font-semibold">{new Date(p.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: PAGE CONTENT & HERO (CMS) */}
      {activeSubTab === 'content' && (
        <form onSubmit={handleSavePageContent} className="space-y-6">
          {/* Hero Section Configuration */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Pricing Hero Section
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the top headline, badge, subtitle, and primary call-to-action on /pricing
                </p>
              </div>
              <a
                href="/pricing"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl transition"
              >
                View Page <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Top Badge Text
                </label>
                <input
                  type="text"
                  value={pageContentForm.pricing_hero_badge}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_badge: e.target.value })}
                  placeholder="e.g. Transparent Pricing"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={pageContentForm.pricing_hero_title}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_title: e.target.value })}
                  placeholder="e.g. Flexible Pricing That Grows With You"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Hero Subtitle Description
              </label>
              <textarea
                rows="3"
                value={pageContentForm.pricing_hero_subtitle}
                onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_subtitle: e.target.value })}
                placeholder="Detailed paragraph explaining the pricing philosophy..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Consultation Button Text
                </label>
                <input
                  type="text"
                  value={pageContentForm.pricing_hero_cta_text}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_cta_text: e.target.value })}
                  placeholder="e.g. Schedule Consultation"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Consultation Button Target URL
                </label>
                <input
                  type="text"
                  value={pageContentForm.pricing_hero_cta_url}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_cta_url: e.target.value })}
                  placeholder="e.g. /#contact, /contact, or Calendly URL"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner Configuration */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Bottom CTA Banner Section
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure the call-to-action banner displayed at the bottom of the pricing page
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Banner Main Title
                </label>
                <input
                  type="text"
                  value={pageContentForm.pricing_cta_title}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_title: e.target.value })}
                  placeholder="e.g. Need a custom enterprise architecture?"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Button Text
                </label>
                <input
                  type="text"
                  value={pageContentForm.pricing_cta_button_text}
                  onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_button_text: e.target.value })}
                  placeholder="e.g. Book Architectural Review"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Banner Subtitle Description
              </label>
              <textarea
                rows="2"
                value={pageContentForm.pricing_cta_subtitle}
                onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_subtitle: e.target.value })}
                placeholder="Talk to our senior architects to structure a custom proposal..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Button Target URL
              </label>
              <input
                type="text"
                value={pageContentForm.pricing_cta_button_url}
                onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_button_url: e.target.value })}
                placeholder="e.g. /#contact, /contact, etc."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {actionLoading ? 'Saving Changes...' : 'Save Pricing Page Content'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* MODAL: ADD / EDIT PRICING PLAN */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure plan pricing, features list, and call-to-action details
                </p>
              </div>
              <button
                onClick={() => setPlanModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Plan Code Name * <span className="text-slate-400 font-normal">(e.g. Basic, Standard, Advanced)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    placeholder="e.g. Basic"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Display Title * <span className="text-slate-400 font-normal">(e.g. Starter Scope, Enterprise)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.display_name}
                    onChange={(e) => setPlanForm({ ...planForm, display_name: e.target.value })}
                    placeholder="e.g. Starter Scope"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Price Range Display * <span className="text-slate-400 font-normal">(e.g. ₹20K – ₹40K)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.price_display}
                    onChange={(e) => setPlanForm({ ...planForm, price_display: e.target.value })}
                    placeholder="e.g. ₹20K – ₹40K"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pricing Label <span className="text-slate-400 font-normal">(Sub-tag under price)</span>
                  </label>
                  <input
                    type="text"
                    value={planForm.pricing_label}
                    onChange={(e) => setPlanForm({ ...planForm, pricing_label: e.target.value })}
                    placeholder="e.g. Estimated Investment"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={planForm.cta_text}
                    onChange={(e) => setPlanForm({ ...planForm, cta_text: e.target.value })}
                    placeholder="e.g. Discuss Your Project"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Badge Text <span className="text-slate-400 font-normal">(Optional, e.g. Most Popular)</span>
                  </label>
                  <input
                    type="text"
                    value={planForm.badge}
                    onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                    placeholder="e.g. Most Popular, Best Value"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  placeholder="Short description of who this plan is tailored for..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Features List (One feature per line) *
                </label>
                <textarea
                  rows="4"
                  value={planForm.featuresText}
                  onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                  placeholder="4–5 Core Modules / Pages&#10;Responsive UI/UX Architecture&#10;API & Contact Form Integration&#10;Basic SEO & Performance Setup"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={planForm.sort_order}
                    onChange={(e) => setPlanForm({ ...planForm, sort_order: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.is_popular}
                      onChange={(e) => setPlanForm({ ...planForm, is_popular: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Highlight as Popular</span>
                  </label>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={planForm.is_active}
                      onChange={(e) => setPlanForm({ ...planForm, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Active (Visible)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ADDON */}
      {addonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingAddon ? 'Edit Add-on Package' : 'Create New Add-on'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure extra services available for users to select
                </p>
              </div>
              <button
                onClick={() => setAddonModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Add-on Title *
                </label>
                <input
                  type="text"
                  required
                  value={addonForm.name}
                  onChange={(e) => setAddonForm({ ...addonForm, name: e.target.value })}
                  placeholder="e.g. Chatbot (Web/App)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Price Display *
                </label>
                <input
                  type="text"
                  required
                  value={addonForm.price_display}
                  onChange={(e) => setAddonForm({ ...addonForm, price_display: e.target.value })}
                  placeholder="e.g. +₹3K – ₹5K (Est.)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={addonForm.description}
                  onChange={(e) => setAddonForm({ ...addonForm, description: e.target.value })}
                  placeholder="Short description of this add-on package..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={addonForm.sort_order}
                    onChange={(e) => setAddonForm({ ...addonForm, sort_order: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addonForm.is_active}
                      onChange={(e) => setAddonForm({ ...addonForm, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Active (Visible)</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddonModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : editingAddon ? 'Update Add-on' : 'Create Add-on'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-lg">Are you sure?</h4>
            <p className="text-xs text-slate-500 mt-2">
              Do you really want to delete <strong className="text-slate-800">"{deleteConfirm.title}"</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm({ open: false, type: '', id: null, title: '' })}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={actionLoading}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-2xl transition shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPlanManager;
