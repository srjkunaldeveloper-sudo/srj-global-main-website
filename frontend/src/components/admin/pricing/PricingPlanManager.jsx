import React, { useState, useEffect } from 'react';
import {
  Plus, Layers, Package, MessageSquareQuote, LayoutTemplate
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

export default function PricingPlanManager({ inquiries = [] }) {
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

  useEffect(() => {
    fetchPricingData();
  }, []);

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
      <ToastAlert message={message} onClose={() => setMessage({ type: '', text: '' })} />

      {/* Header and Sub Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab('plans')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'inquiries'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            Customer Quotes ({inquiries.length})
          </button>
        </div>

        <div>
          {activeSubTab === 'plans' && (
            <button
              onClick={openPlanCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Pricing Plan
            </button>
          )}

          {activeSubTab === 'addons' && (
            <button
              onClick={openAddonCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Add-on
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tab 1: Plans Grid */}
      {activeSubTab === 'plans' && (
        <PricingPlansGrid
          plans={plans}
          loading={loading}
          onOpenEdit={openPlanEdit}
          onToggleActive={handleTogglePlanActive}
          onDeletePlan={(plan) => setDeleteConfirm({ open: true, type: 'plan', id: plan.id, title: plan.display_name })}
        />
      )}

      {/* Sub-Tab 2: Addons */}
      {activeSubTab === 'addons' && (
        <PricingAddonsTable
          addons={addons}
          loading={loading}
          onOpenEdit={openAddonEdit}
          onToggleActive={handleToggleAddonActive}
          onDeleteAddon={(addon) => setDeleteConfirm({ open: true, type: 'addon', id: addon.id, title: addon.name })}
        />
      )}

      {/* Sub-Tab 3: Inquiries */}
      {activeSubTab === 'inquiries' && (
        <PricingInquiriesTable inquiries={inquiries} />
      )}

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
