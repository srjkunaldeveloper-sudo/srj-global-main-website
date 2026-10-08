import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function PortfolioList({
  portfolio = [],
  onEditPortfolio,
  onTogglePortfolio,
  onDeletePortfolio
}) {
  return (
    <div className="xl:col-span-2 space-y-4">
      <h3 className="text-lg font-bold text-slate-900">
        Portfolio Projects ({portfolio.length})
      </h3>

      {portfolio.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
          No portfolio projects found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {portfolio.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  {p.image && typeof p.image === 'string' ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-xs">
                      No Img
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {p.category}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{p.title}</h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                      p.is_active
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    Order: {p.sort_order || 0}
                  </span>
                </div>

                {p.description && (
                  <p className="text-slate-600 text-sm mt-2 line-clamp-2">{p.description}</p>
                )}

                {/* Tags list */}
                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {p.project_url && (
                  <p className="text-xs text-blue-600 mt-2 truncate">
                    URL:{' '}
                    <a
                      href={p.project_url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      {p.project_url}
                    </a>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                <button
                  onClick={() => onTogglePortfolio(p.id, p.is_active)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    p.is_active
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                  }`}
                >
                  {p.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => onEditPortfolio(p)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs transition cursor-pointer"
                  title="Edit Portfolio Project"
                >
                  <Edit size={14} />
                  Edit
                </button>

                <button
                  onClick={() => onDeletePortfolio(p.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs transition cursor-pointer"
                  title="Delete Portfolio Project"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
