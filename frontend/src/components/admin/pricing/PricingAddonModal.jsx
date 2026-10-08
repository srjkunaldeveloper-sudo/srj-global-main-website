import React from 'react';
import { XCircle } from 'lucide-react';

export default function PricingAddonModal({
  isOpen,
  editingAddon,
  addonForm,
  setAddonForm,
  onSaveAddon,
  onClose,
  actionLoading
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
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
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSaveAddon} className="space-y-4">
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
                onChange={(e) => setAddonForm({ ...addonForm, sort_order: parseInt(e.target.value, 10) || 0 })}
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
              {actionLoading ? 'Saving...' : editingAddon ? 'Update Add-on' : 'Create Add-on'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
