import React from 'react';
import {
  Sparkles, Star, CheckCircle2, Edit2, Trash2
} from 'lucide-react';

export default function PricingPlansGrid({
  plans = [],
  loading,
  onOpenEdit,
  onToggleActive,
  onDeletePlan
}) {
  if (loading && plans.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
        Loading pricing plans...
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
        No pricing plans configured yet. Click "Add Pricing Plan" to create one.
      </div>
    );
  }

  return (
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
          <div>
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
                onClick={() => onToggleActive(plan)}
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
                onClick={() => onOpenEdit(plan)}
                className="p-2 text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                title="Edit Plan"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeletePlan(plan)}
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
  );
}
