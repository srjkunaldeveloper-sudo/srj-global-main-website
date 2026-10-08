import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function PricingAddonsTable({
  addons = [],
  loading,
  onOpenEdit,
  onToggleActive,
  onDeleteAddon
}) {
  if (loading && addons.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
        Loading add-ons...
      </div>
    );
  }

  if (addons.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
        No add-on packages found. Click "Add Add-on" to create one.
      </div>
    );
  }

  return (
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
                onClick={() => onToggleActive(addon)}
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
                onClick={() => onOpenEdit(addon)}
                className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                title="Edit Add-on"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteAddon(addon)}
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
  );
}
