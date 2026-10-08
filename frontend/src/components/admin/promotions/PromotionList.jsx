import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function PromotionList({
  promotions = [],
  onEditPromotion,
  onTogglePromotion,
  onDeletePromotion
}) {
  return (
    <div className="xl:col-span-2 space-y-4">
      <h3 className="text-lg font-bold text-slate-900">
        Announcements List ({promotions.length})
      </h3>
      <p className="text-slate-400 text-xs mt-1">
        Note: Only one announcement can be active at a time. Toggling one on will deactivate others.
      </p>

      {promotions.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
          No launch announcements found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {promotions.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex justify-between items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-extrabold text-slate-900">{p.title}</h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                      p.is_active
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2">{p.description}</p>
                {p.cta_link && (
                  <p className="text-xs text-blue-500 mt-1 truncate">Link: {p.cta_link}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditPromotion(p)}
                  className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition cursor-pointer"
                  title="Edit Announcement"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => onTogglePromotion(p.id, p.is_active)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    p.is_active
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                  }`}
                >
                  {p.is_active ? 'Deactivate' : 'Activate Popup'}
                </button>

                <button
                  onClick={() => onDeletePromotion(p.id)}
                  className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                  title="Delete Announcement"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
