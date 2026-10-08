import React from 'react';
import { Sparkles, Save, Layers, Plus, Edit, Trash2 } from 'lucide-react';

export default function HomeCapabilitiesView({
  homeServicesSettings,
  setHomeServicesSettings,
  savingHomeSettings,
  onSaveHomeServicesSettings,
  services = [],
  onOpenAddHomeCard,
  onToggleHomeService,
  onEditService,
  onDeleteService
}) {
  const homePillars = services
    .filter((s) => s.is_home)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="space-y-6">
      {/* Header CMS Editor */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
        <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              Homepage Capabilities Section Header (CMS)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Controls the Badge, Title, and Subtitle shown above the cards on the Homepage.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            Target: /#services
          </span>
        </div>

        <form onSubmit={onSaveHomeServicesSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Section Eyebrow / Badge Label *
              </label>
              <input
                type="text"
                required
                value={homeServicesSettings.badge}
                onChange={(e) =>
                  setHomeServicesSettings({ ...homeServicesSettings, badge: e.target.value })
                }
                placeholder="CAPABILITIES"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-slate-900 uppercase"
              />
              <p className="text-[10px] text-slate-400 mt-1">Default: CAPABILITIES</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Main Section Heading *
              </label>
              <input
                type="text"
                required
                value={homeServicesSettings.title}
                onChange={(e) =>
                  setHomeServicesSettings({ ...homeServicesSettings, title: e.target.value })
                }
                placeholder="Premium Engineering Services"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">Default: Premium Engineering Services</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Subtitle Description *
            </label>
            <textarea
              rows={2}
              required
              value={homeServicesSettings.subtitle}
              onChange={(e) =>
                setHomeServicesSettings({ ...homeServicesSettings, subtitle: e.target.value })
              }
              placeholder="We deliver state-of-the-art technological solutions built to drive growth and efficiency."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingHomeSettings}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition shadow-md cursor-pointer disabled:bg-slate-400"
            >
              <Save size={14} />
              {savingHomeSettings ? 'Saving...' : 'Save Header Content'}
            </button>
          </div>
        </form>
      </div>

      {/* Featured Home Cards Manager */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-emerald-600" />
              Featured Home Capability Cards ({homePillars.length} Pillars)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              These cards appear in a 3-column grid directly under "Premium Engineering Services" on the Homepage.
            </p>
          </div>

          <button
            onClick={onOpenAddHomeCard}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition shadow-xs cursor-pointer shrink-0"
          >
            <Plus size={15} /> Add Home Capability Card
          </button>
        </div>

        {/* Home Cards Grid */}
        {homePillars.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
            <Layers size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-600">No services currently featured on the Home Page</p>
            <p className="text-xs text-slate-400 mt-1">
              Click "Add Home Capability Card" above, or switch to "All Services Directory" and toggle "Show on Home" on any service.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {homePillars.map((s, idx) => (
              <div
                key={s.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.015)] hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs">
                      #{s.sort_order || idx + 1}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Pillar #{s.sort_order || idx + 1}
                      </span>
                      {s.icon && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-500">
                          {s.icon}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {s.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {s.short_description}
                  </p>

                  {/* Feature Tags */}
                  {Array.isArray(s.tags) && s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {s.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleHomeService(s)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 text-xs font-bold transition cursor-pointer"
                    title="Remove from Homepage capabilities"
                  >
                    Remove from Home
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEditService(s)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Edit size={13} /> Edit Card
                    </button>

                    <button
                      onClick={() => onDeleteService(s.id)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
