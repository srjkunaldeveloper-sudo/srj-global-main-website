import React from 'react';
import {
  Handshake, Plus, Edit2, Trash2, CheckCircle2, XCircle,
  Lightbulb, Code, Rocket, LineChart, Globe, ShieldCheck,
  Check, Search, RefreshCw, Sparkles, Zap, Layers, Shield
} from 'lucide-react';

const ICON_MAP = {
  Lightbulb, Code, Rocket, LineChart, Globe, 
  ShieldCheck, Sparkles, Zap, Layers, Handshake, Shield
};

export default function CollabModelsGrid({
  models = [],
  filteredModels = [],
  loading,
  actionLoading,
  searchTerm,
  setSearchTerm,
  onOpenAddModal,
  onOpenEditModal,
  onToggleActive,
  onDeleteModel
}) {
  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search models by title or deliverables..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Add Collaboration Model
        </button>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw size={24} className="animate-spin mx-auto text-slate-400 mb-2" />
          <p className="text-xs text-slate-500 font-semibold">Loading collaboration models...</p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <Handshake size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No collaboration models found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? 'No models match your search query.' : 'Click "Add Collaboration Model" to create the first card.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((model) => {
            const IconComponent = ICON_MAP[model.icon] || Lightbulb;
            return (
              <div
                key={model.id}
                className={`bg-white border rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                  model.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* Top Meta: Position & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                      #{model.sort_order}
                    </span>

                    <button
                      onClick={() => onToggleActive(model)}
                      disabled={actionLoading}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                        model.is_active 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {model.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {model.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0">
                      <IconComponent size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{model.title}</h3>
                      <span className="text-[10px] font-mono text-slate-400">icon: {model.icon}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {model.description}
                  </p>

                  {/* Feature Items Pills */}
                  {Array.isArray(model.features) && model.features.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Key Deliverables ({model.features.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {model.features.map((feat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                          >
                            <Check size={10} className="text-slate-500" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onOpenEditModal(model)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit2 size={13} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteModel(model.id, model.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
