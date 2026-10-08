import React from 'react';
import { Handshake, X, Save, Lightbulb, Code, Rocket, LineChart, Globe, ShieldCheck, Sparkles, Zap, Layers, Shield } from 'lucide-react';

const POPULAR_ICONS = [
  'Lightbulb', 'Code', 'Rocket', 'LineChart', 'Globe', 
  'ShieldCheck', 'Sparkles', 'Zap', 'Layers', 'Handshake', 'Shield'
];

const ICON_MAP = {
  Lightbulb, Code, Rocket, LineChart, Globe, 
  ShieldCheck, Sparkles, Zap, Layers, Handshake, Shield
};

export default function CollabModelModal({
  isOpen,
  editingModel,
  formData,
  setFormData,
  newFeatureInput,
  setNewFeatureInput,
  onAddFeature,
  onRemoveFeature,
  onSave,
  onClose,
  actionLoading
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSave} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
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
            
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddFeature();
                  }
                }}
                placeholder="Type deliverable and click Add (e.g. Market Research)..."
                className="flex-1 px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={onAddFeature}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                Add
              </button>
            </div>

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
                      onClick={() => onRemoveFeature(idx)}
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
              onClick={onClose}
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
  );
}
