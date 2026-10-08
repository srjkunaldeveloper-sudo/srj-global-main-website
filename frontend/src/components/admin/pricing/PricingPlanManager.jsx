import React, { useState, useEffect } from 'react';
import {
  Plus,
  Layers,
  Package,
  MessageSquareQuote,
  LayoutTemplate,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import api from '../../../config/api';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import PricingPlansGrid from './PricingPlansGrid';
import PricingPlanModal from './PricingPlanModal';
import PricingAddonsTable from './PricingAddonsTable';
import PricingAddonModal from './PricingAddonModal';
import PricingInquiriesTable from './PricingInquiriesTable';
import PricingContentCms from './PricingContentCms';
import ToastAlert from '../shared/ToastAlert';
import ConfirmDeleteModal from '../shared/ConfirmDeleteModal';

export default function PricingPlanManager({ inquiries: propInquiries = [], onNotify }) {
  const { refreshSettings } = useSiteSettings();
  const [activeSubTab, setActiveSubTab] = useState('plans'); // 'plans' | 'addons' | 'content' | 'inquiries'
  const [plans, setPlans] = useState([]);
  const [addons, setAddons] = useState([]);
  const [inquiries, setInquiries] = useState(propInquiries);
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
    pricing_cta_title: 'Need a custom enterprise architecture?',
    pricing_cta_subtitle: 'Talk to our senior architects to structure a custom proposal, dedicated pod, or RFP evaluation.',
    pricing_cta_button_text: 'Book Architectural Review',
    pricing_cta_button_url: '/#contact'
  });

  // Delete Confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null, title: '' });

  const notify = (type, text) => {
    setMessage({ type, text });
    if (onNotify) onNotify(text, type);
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const [plansRes, addonsRes, settingsRes, inquiriesRes] = await Promise.all([
        api.get('/pricing/plans'),
        api.get('/pricing/addons'),
        api.get('/settings').catch(() => ({ data: {} })),
        api.get('/plans').catch(() => ({ data: [] }))
      ]);

      if (plansRes.data?.plans) setPlans(plansRes.data.plans);
      if (addonsRes.data?.addOns) setAddons(addonsRes.data.addOns);
      if (Array.isArray(inquiriesRes.data)) {
        setInquiries(inquiriesRes.data);
      } else if (propInquiries && propInquiries.length > 0) {
        setInquiries(propInquiries);
      }

      if (settingsRes.data?.settings) {
        const s = settingsRes.data.settings;
        setPageContentForm((prev) => ({
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

  useEffect(() => {
    fetchPricingData();
  }, []);

  const handleSavePageContent = async (e) => {
    if (e) e.preventDefault();
    setActionLoading(true);
    try {
      await api.put('/settings/bulk', { settings: pageContentForm });
      if (refreshSettings) await refreshSettings();
      notify('success', 'Pricing Page Content & CMS saved successfully!');
    } catch (err) {
      console.error(err);
      notify('error', err.response?.data?.message || 'Failed to update page content');
    } finally {
      setActionLoading(false);
    }
  };

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
      sort_order: plans.length + 1,
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
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || ''),
      badge: plan.badge || '',
      is_popular: Boolean(plan.is_popular),
      sort_order: plan.sort_order || 0,
      is_active: Boolean(plan.is_active)
    });
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (e) => {
    if (e) e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: planForm.name.trim(),
        display_name: planForm.display_name.trim(),
        price_display: planForm.price_display.trim(),
        pricing_label: planForm.pricing_label.trim(),
        cta_text: planForm.cta_text.trim(),
        description: planForm.description.trim(),
        features: planForm.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
        badge: planForm.badge.trim(),
        is_popular: planForm.is_popular ? 1 : 0,
        sort_order: parseInt(planForm.sort_order, 10) || 0,
        is_active: planForm.is_active ? 1 : 0
      };

      if (editingPlan) {
        await api.put(`/pricing/plans/${editingPlan.id}`, payload);
        notify('success', 'Plan updated successfully!');
      } else {
        await api.post('/pricing/plans', payload);
        notify('success', 'New plan created successfully!');
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
      sort_order: addons.length + 1,
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
      sort_order: addon.sort_order || 0,
      is_active: Boolean(addon.is_active)
    });
    setAddonModalOpen(true);
  };

  const handleSaveAddon = async (e) => {
    if (e) e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: addonForm.name.trim(),
        price_display: addonForm.price_display.trim(),
        description: addonForm.description.trim(),
        sort_order: parseInt(addonForm.sort_order, 10) || 0,
        is_active: addonForm.is_active ? 1 : 0
      };

      if (editingAddon) {
        await api.put(`/pricing/addons/${editingAddon.id}`, payload);
        notify('success', 'Add-on updated successfully!');
      } else {
        await api.post('/pricing/addons', payload);
        notify('success', 'Add-on created successfully!');
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
      setPlans(plans.map((p) => (p.id === plan.id ? { ...p, is_active: !p.is_active } : p)));
      notify('success', `Plan status changed to ${!plan.is_active ? 'Active' : 'Inactive'}`);
    } catch (err) {
      notify('error', 'Failed to toggle status');
    }
  };

  // Toggle Addon Active
  const handleToggleAddonActive = async (addon) => {
    try {
      await api.put(`/pricing/addons/${addon.id}`, { is_active: !addon.is_active });
      setAddons(addons.map((a) => (a.id === addon.id ? { ...a, is_active: !a.is_active } : a)));
      notify('success', `Add-on status changed to ${!addon.is_active ? 'Active' : 'Inactive'}`);
    } catch (err) {
      notify('error', 'Failed to toggle status');
    }
  };

  const SUB_TABS = [
    {
      id: 'plans',
      label: 'Pricing Plans',
      icon: Layers,
      color: '#2563EB',
      badge: `${plans.length} Tiers`
    },
    {
      id: 'addons',
      label: 'Add-on Packages',
      icon: Package,
      color: '#7C3AED',
      badge: `${addons.length} Add-ons`
    },
    {
      id: 'content',
      label: 'Page Content CMS',
      icon: LayoutTemplate,
      color: '#059669',
      badge: 'Hero & CTA'
    },
    {
      id: 'inquiries',
      label: 'Customer Quotes',
      icon: MessageSquareQuote,
      color: '#EA580C',
      badge: `${inquiries.length} Inquiries`
    }
  ];

  return (
    <div className="space-y-6">
      <ToastAlert message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Top Banner Header with Industries Pattern */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
            <DollarSign size={14} /> Official Pricing & Quotation CMS
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Pricing Plans & Quotations Manager
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Manage your public engagement models on <code>/pricing</code>, configure add-on services, edit Hero and Bottom CTA copy, and review customer calculator quote inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <a
            href="/pricing"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <ExternalLink size={14} /> View Public /pricing
          </a>

          {activeSubTab === 'plans' && (
            <button
              onClick={openPlanCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
            >
              <Plus size={16} /> New Pricing Plan
            </button>
          )}

          {activeSubTab === 'addons' && (
            <button
              onClick={openAddonCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition shadow-md cursor-pointer"
            >
              <Plus size={16} /> New Add-on Package
            </button>
          )}
        </div>
      </div>

      {/* Industries-Style Section Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {SUB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : `${tab.color}15`,
                  color: isActive ? '#FFFFFF' : tab.color
                }}
              >
                <Icon size={14} />
              </div>
              <span>{tab.label}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${tab.color}12`,
                  color: isActive ? '#FFFFFF' : tab.color
                }}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Plans Grid */}
      {activeSubTab === 'plans' && (
        <PricingPlansGrid
          plans={plans}
          loading={loading}
          onOpenEdit={openPlanEdit}
          onToggleActive={handleTogglePlanActive}
          onDeletePlan={(plan) =>
            setDeleteConfirm({ open: true, type: 'plan', id: plan.id, title: plan.display_name })
          }
        />
      )}

      {/* Sub-Tab 2: Addons */}
      {activeSubTab === 'addons' && (
        <PricingAddonsTable
          addons={addons}
          loading={loading}
          onOpenEdit={openAddonEdit}
          onToggleActive={handleToggleAddonActive}
          onDeleteAddon={(addon) =>
            setDeleteConfirm({ open: true, type: 'addon', id: addon.id, title: addon.name })
          }
        />
      )}

      {/* Sub-Tab 3: Inquiries */}
      {activeSubTab === 'inquiries' && <PricingInquiriesTable inquiries={inquiries} />}

      {/* Sub-Tab 4: Content CMS */}
      {activeSubTab === 'content' && (
        <PricingContentCms
          pageContentForm={pageContentForm}
          setPageContentForm={setPageContentForm}
          onSaveContent={handleSavePageContent}
          actionLoading={actionLoading}
        />
      )}

      {/* Modal: Add/Edit Plan */}
      <PricingPlanModal
        isOpen={planModalOpen}
        editingPlan={editingPlan}
        planForm={planForm}
        setPlanForm={setPlanForm}
        onSavePlan={handleSavePlan}
        onClose={() => setPlanModalOpen(false)}
        actionLoading={actionLoading}
      />

      {/* Modal: Add/Edit Addon */}
      <PricingAddonModal
        isOpen={addonModalOpen}
        editingAddon={editingAddon}
        addonForm={addonForm}
        setAddonForm={setAddonForm}
        onSaveAddon={handleSaveAddon}
        onClose={() => setAddonModalOpen(false)}
        actionLoading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirm.open}
        title={`Delete ${deleteConfirm.type === 'plan' ? 'Pricing Plan' : 'Add-on Package'}`}
        message={`Are you sure you want to permanently delete "${deleteConfirm.title}"?`}
        loading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, type: '', id: null, title: '' })}
      />
    </div>
  );
}
