import React from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';

export default function TestimonialList({
  testimonials = [],
  onEditTestimonial,
  onToggleTestimonial,
  onDeleteTestimonial
}) {
  return (
    <div className="xl:col-span-2 space-y-4">
      <h3 className="text-lg font-bold text-slate-900">
        Testimonials List ({testimonials.length})
      </h3>

      {testimonials.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
          No testimonials found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {t.image && typeof t.image === 'string' ? (
                    <img
                      src={t.image}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-sm">
                      {t.author ? t.author.charAt(0).toUpperCase() : 'T'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">{t.author}</h4>
                    <p className="text-xs text-slate-500">
                      {t.role}
                      {t.company ? ` • ${t.company}` : ''}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                      t.is_active
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {t.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    Order: {t.sort_order || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 my-2">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                  <span className="text-xs text-slate-400 font-medium ml-1">
                    ({t.rating || 5}/5)
                  </span>
                </div>
                <p className="text-slate-600 text-sm italic line-clamp-3">"{t.quote}"</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => onToggleTestimonial(t.id, t.is_active)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    t.is_active
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                  }`}
                >
                  {t.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => onEditTestimonial(t)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                  title="Edit Testimonial"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => onDeleteTestimonial(t.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                  title="Delete Testimonial"
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
