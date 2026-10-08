import React from 'react';
import {
  Compass, ExternalLink, Plus, Search, RefreshCw, Layers, Eye, Edit, Trash2
} from 'lucide-react';
import { renderIndustryIcon } from './IndustryIcons';

export default function IndustryListGrid({
  industries = [],
  filteredIndustries = [],
  loading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onRefresh,
  onOpenCreate,
  onOpenEdit,
  onToggleStatus,
  onDelete
}) {
  return (
    <>
      {/* Top Banner Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
            <Compass size={14} /> Official Industry Pages CMS
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Industries & Sector Pages Manager
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Configure both the public directory cards on <code>/industries</code> and the complete official sector landing pages on <code>/industries/:slug</code> with custom Hero, Capabilities, ROI Value, Stats, FAQs, and Enterprise CTA.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <a
            href="/industries"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <ExternalLink size={14} /> View Public Directory
          </a>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} /> New Industry Sector
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search industries, slugs, badges..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white"
          >
            <option value="all">All Status ({industries.length})</option>
            <option value="active">Active Only ({industries.filter(i => i.is_active).length})</option>
            <option value="inactive">Inactive Only ({industries.filter(i => !i.is_active).length})</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer self-end sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Industry Cards Grid */}
      {filteredIndustries.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
          <Layers size={36} className="mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-600">No industry sectors found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search filter or click &quot;New Industry Sector&quot; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndustries.map((ind) => {
            const featuresCount = Array.isArray(ind.features) ? ind.features.length : (typeof ind.features === 'string' && ind.features ? JSON.parse(ind.features || '[]').length : 0);
            const benefitsCount = Array.isArray(ind.benefits) ? ind.benefits.length : (typeof ind.benefits === 'string' && ind.benefits ? JSON.parse(ind.benefits || '[]').length : 0);
            const statsCount = Array.isArray(ind.stats) ? ind.stats.length : (typeof ind.stats === 'string' && ind.stats ? JSON.parse(ind.stats || '[]').length : 0);

            return (
              <div
                key={ind.id}
                className={`group bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  ind.is_active
                    ? 'border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1'
                    : 'border-slate-200 bg-slate-50/50 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar: Icon, Title, Active Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${ind.color || '#2563EB'}12`,
                          borderColor: `${ind.color || '#2563EB'}30`
                        }}
                      >
                        {renderIndustryIcon(ind.icon, ind.color, 20)}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 leading-tight">
                          /industries/{ind.id}
                        </div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {ind.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      ind.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {ind.is_active ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  {/* Subtitle & Badge */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {ind.badge && (
                      <span
                        className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${ind.color || '#2563EB'}10`,
                          color: ind.color || '#2563EB',
                          borderColor: `${ind.color || '#2563EB'}25`
                        }}
                      >
                        {ind.badge}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500">
                      {ind.subtitle}
                    </span>
                  </div>

                  {/* Overview Paragraph snippet */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {ind.description}
                  </p>

                  {/* Metric & Module Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold mb-4 pt-3 border-t border-slate-100">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                      ⚡ {featuresCount} Capabilities
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                      📈 {benefitsCount} ROI Values
                    </span>
                    {statsCount > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                        📊 {statsCount} Stats
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 ml-auto">
                      Order: {ind.sort_order || 0}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`/industries/${ind.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 text-xs font-bold transition cursor-pointer"
                      title="Open official industry landing page"
                    >
                      <Eye size={13} /> View Page
                    </a>

                    <button
                      onClick={(e) => onToggleStatus(ind.id, e)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        ind.is_active
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {ind.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenEdit(ind)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Edit size={13} /> Edit Page CMS
                    </button>

                    <button
                      onClick={(e) => onDelete(ind.id, ind.title, e)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                      title="Delete industry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
