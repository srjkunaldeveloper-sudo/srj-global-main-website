import React from 'react';
import { XCircle } from 'lucide-react';

export default function PricingPlanModal({
  isOpen,
  editingPlan,
  planForm,
  setPlanForm,
  onSavePlan,
  onClose,
  actionLoading
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSavePlan} className="space-y-4">
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
                onChange={(e) => setPlanForm({ ...planForm, sort_order: parseInt(e.target.value, 10) || 0 })}
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
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              {actionLoading ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
