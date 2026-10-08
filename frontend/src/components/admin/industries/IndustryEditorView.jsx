import React from 'react';
import {
  ArrowLeft, Eye, Save, Compass, Sparkles, CheckCircle2,
  TrendingUp, BarChart3, Send, HelpCircle, ChevronRight, Plus, X, Check, ShieldCheck
} from 'lucide-react';
import { PRESET_ICONS, PRESET_COLORS, renderIndustryIcon } from './IndustryIcons';

export default function IndustryEditorView({
  editorMode,
  editingId,
  formData,
  setFormData,
  activeEditorTab,
  setActiveEditorTab,
  loading,
  onCloseEditor,
  onSaveIndustry,
  newFeatureInput,
  setNewFeatureInput,
  addFeature,
  removeFeature,
  newBenefitInput,
  setNewBenefitInput,
  addBenefit,
  removeBenefit,
  newStatNumber,
  setNewStatNumber,
  newStatLabel,
  setNewStatLabel,
  addStat,
  removeStat,
  onJumpToFaq
}) {
  return (
    <div className="space-y-6">
      {/* Top Bar with Back & Save */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCloseEditor}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            title="Back to Sector List"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {editorMode === 'new' ? 'New Sector' : 'Editing Sector CMS'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                /industries/{formData.id || 'slug'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {formData.title || 'Untitled Industry Sector'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editorMode === 'edit' && (
            <a
              href={`/industries/${editingId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition cursor-pointer"
            >
              <Eye size={14} /> View Live Page
            </a>
          )}
          <button
            onClick={onCloseEditor}
            className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 font-bold text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSaveIndustry}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save size={15} /> Save Page Content
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'identity', label: '1. Sector Identity & URL', icon: Compass },
          { id: 'hero', label: '2. Hero & Overview', icon: Sparkles },
          { id: 'capabilities', label: '3. Technical Capabilities', icon: CheckCircle2 },
          { id: 'benefits', label: '4. Strategic ROI & Value', icon: TrendingUp },
          { id: 'stats', label: '5. Key Performance Stats', icon: BarChart3 },
          { id: 'cta', label: '6. Enterprise CTA Banner', icon: Send },
          { id: 'faqs', label: '7. Sector FAQs', icon: HelpCircle },
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveEditorTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeEditorTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <TabIcon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Area (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: IDENTITY & BRANDING */}
          {activeEditorTab === 'identity' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Compass size={18} className="text-blue-600" /> Sector Identity & Official URL
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sets the unique URL slug, title, badge, brand accent color, and icon for this sector.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Industry Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Ecommerce & Retail"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    URL Slug / ID *
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    disabled={editorMode === 'edit'}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g. ecommerce"
                    className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-900 ${
                      editorMode === 'edit' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    URL: <code>/industries/{formData.id || 'slug'}</code> (lowercase, hyphens only)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Header Badge Label *
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Revenue Boost or Enterprise Ready"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Sort Order & Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
                      placeholder="Sort order"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-900"
                    />
                    <select
                      value={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900"
                    >
                      <option value={1}>Active (Visible)</option>
                      <option value={0}>Draft (Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Brand Accent Color *
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 p-1 cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#2563EB"
                    className="w-28 px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:border-slate-900"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: c })}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                          formData.color === c ? 'border-black scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Sector Icon *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
                  {PRESET_ICONS.map(item => {
                    const IconComp = item.icon;
                    const isSelected = formData.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: item.name })}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <IconComp size={18} style={{ color: isSelected ? formData.color : '#64748B' }} />
                        <span className="text-xs font-bold truncate text-slate-800">
                          {item.name.replace('Fa', '')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('hero')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                >
                  Next: Hero & Overview <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & OVERVIEW */}
          {activeEditorTab === 'hero' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" /> Hero & Overview Section
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Displayed right at the top of the official page <code>/industries/{formData.id || 'slug'}</code>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Tagline / Subtitle *
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Scalable Digital Stores & Payment Gateway Integration"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1">Appears directly beneath the main Industry Title.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Comprehensive Industry Overview *
                </label>
                <textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed overview describing your software engineering capabilities, domain expertise, enterprise architectural approach, and business solutions for this specific industry sector..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-slate-900 resize-none leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This is the main narrative section that enterprise clients read to understand your domain authority.
                </p>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('identity')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  &larr; Back to Identity
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('capabilities')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                >
                  Next: Technical Capabilities <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CAPABILITIES & MODULES */}
          {activeEditorTab === 'capabilities' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-600" /> Core Capabilities & Technical Modules
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Rendered as individual enterprise capability cards with checkmark icons on the official page.
                </p>
              </div>

              {/* Add Capability Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  placeholder="e.g. Microservices-based Architecture, Automated CI/CD Pipelines..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Module
                </button>
              </div>

              {/* Capabilities List */}
              <div className="space-y-2">
                {formData.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl group hover:bg-white hover:border-slate-300 transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs"
                        style={{
                          backgroundColor: `${formData.color}15`,
                          borderColor: `${formData.color}30`,
                          color: formData.color
                        }}
                      >
                        <Check size={14} />
                      </span>
                      <span className="text-xs font-bold text-slate-800">{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Remove capability"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-2xl">
                    No capabilities added yet. Type a capability name above and press Enter.
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('hero')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  &larr; Back to Hero
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('benefits')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                >
                  Next: Strategic ROI <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: STRATEGIC ROI & BENEFITS */}
          {activeEditorTab === 'benefits' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-600" /> Strategic Business Value & ROI Benefits
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Highlights tangible business outcomes, risk reduction, operational cost savings, and scale.
                </p>
              </div>

              {/* Add Benefit Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefitInput}
                  onChange={(e) => setNewBenefitInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                  placeholder="e.g. 40% Reduction in Infrastructure Costs, 99.99% Transaction Security..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={addBenefit}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} /> Add Benefit
                </button>
              </div>

              {/* Benefits List */}
              <div className="space-y-2">
                {formData.benefits.map((ben, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl group hover:bg-white hover:border-emerald-200 transition"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 text-xs">
                        <ShieldCheck size={14} />
                      </span>
                      <span className="text-xs font-bold text-slate-800">{ben}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBenefit(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Remove benefit"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
                {formData.benefits.length === 0 && (
                  <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-2xl">
                    No benefits added yet. Type a benefit above and press Enter.
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('capabilities')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  &larr; Back to Capabilities
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('stats')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                >
                  Next: Key Stats <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: KEY STATS & METRICS */}
          {activeEditorTab === 'stats' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-600" /> Key Performance Stats & Metrics
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Rendered in a prominent high-impact 4-column metric bar directly above core capabilities.
                </p>
              </div>

              {/* Add Stat Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newStatNumber}
                  onChange={(e) => setNewStatNumber(e.target.value)}
                  placeholder="Value (e.g. 99.9%, 10M+, 3.5x)"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900"
                />
                <input
                  type="text"
                  value={newStatLabel}
                  onChange={(e) => setNewStatLabel(e.target.value)}
                  placeholder="Label (e.g. Platform SLA, Processed Volume)"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={addStat}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Add Metric
                </button>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {formData.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 relative group flex flex-col justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      className="absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                    <div className="text-2xl font-black mb-1" style={{ color: formData.color }}>
                      {st.number}
                    </div>
                    <div className="text-xs font-bold text-slate-600">
                      {st.label}
                    </div>
                  </div>
                ))}
                {formData.stats.length === 0 && (
                  <p className="col-span-full text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-2xl">
                    No stats added. (Optional: Leave empty if you do not want metric numbers on this page).
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('benefits')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  &larr; Back to ROI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('cta')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                >
                  Next: CTA Banner <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: ENTERPRISE CTA BANNER */}
          {activeEditorTab === 'cta' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Send size={18} className="text-purple-600" /> Bottom Enterprise CTA Banner
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Customize the call-to-action banner shown at the bottom of this official sector landing page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  CTA Heading
                </label>
                <input
                  type="text"
                  value={formData.cta_title}
                  onChange={(e) => setFormData({ ...formData, cta_title: e.target.value })}
                  placeholder={`Default: Ready to modernize your ${formData.title || 'industry'} operations?`}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-slate-900"
                />
                <p className="text-[11px] text-slate-400 mt-1">Leave empty to use automatic title.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  CTA Subtitle / Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formData.cta_subtitle}
                  onChange={(e) => setFormData({ ...formData, cta_subtitle: e.target.value })}
                  placeholder="Default: Connect directly with our industry architects to review blueprints, integration roadmaps, and rapid delivery schedules."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.cta_button_text}
                    onChange={(e) => setFormData({ ...formData, cta_button_text: e.target.value })}
                    placeholder="Contact Solution Team"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.cta_button_url}
                    onChange={(e) => setFormData({ ...formData, cta_button_url: e.target.value })}
                    placeholder="/contact"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('stats')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  &larr; Back to Stats
                </button>
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('faqs')}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer hover:bg-black"
                >
                  Next: FAQs & Help <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SECTOR FAQS */}
          {activeEditorTab === 'faqs' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle size={18} className="text-blue-600" /> Page-Specific FAQs Integration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Targeted FAQs for this specific sector automatically appear on this official page.
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-900 space-y-2 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles size={14} /> How Sector FAQs Work:
                </p>
                <p>
                  The official page at <code>/industries/{formData.id || 'slug'}</code> automatically checks for FAQs created with the category:
                </p>
                <div className="bg-white px-3 py-2 rounded-xl font-mono text-blue-800 font-bold border border-blue-200">
                  Industry - {formData.title || 'Untitled'}
                </div>
                <p>
                  If any FAQs exist with that category name in the FAQ tab, they will instantly render with an accordion on this page. If zero FAQs exist, the section gracefully stays hidden.
                </p>
              </div>

              {onJumpToFaq && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onJumpToFaq(`Industry - ${formData.title}`)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
                  >
                    <Plus size={15} /> Add FAQ for "{formData.title || 'this sector'}" in FAQ Manager
                  </button>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveEditorTab('cta')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  &larr; Back to CTA Banner
                </button>
                <button
                  type="button"
                  onClick={onSaveIndustry}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  <Save size={14} /> Save Page Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Wireframe / Desktop Preview Card (Right Column) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Eye size={13} /> Live Page Preview
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                /industries/{formData.id || 'slug'}
              </span>
            </div>

            {/* Mini Hero Card */}
            <div
              className="rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden mb-4"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-15 pointer-events-none -mr-10 -mt-10"
                style={{ backgroundColor: formData.color }}
              />

              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${formData.color}15`,
                      color: formData.color,
                      borderColor: `${formData.color}30`
                    }}
                  >
                    {formData.badge || 'Badge'}
                  </span>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${formData.color}12`,
                      borderColor: `${formData.color}25`
                    }}
                  >
                    {renderIndustryIcon(formData.icon, formData.color, 16)}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    {formData.title || 'Sector Title'}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {formData.subtitle || 'Subtitle / Tagline'}
                  </p>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                  {formData.description || 'Industry overview narrative will appear here...'}
                </p>
              </div>
            </div>

            {/* Mini Stats Bar */}
            {formData.stats && formData.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {formData.stats.slice(0, 4).map((st, i) => (
                  <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <div className="text-sm font-black" style={{ color: formData.color }}>
                      {st.number}
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mini Capabilities Pills */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Capabilities ({formData.features?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.features?.slice(0, 4).map((f, i) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md truncate max-w-[140px]">
                    ✓ {f}
                  </span>
                ))}
                {formData.features?.length > 4 && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-md">
                    +{formData.features.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Mini CTA banner */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl text-center space-y-2">
              <div className="text-xs font-bold line-clamp-1">
                {formData.cta_title || `Ready to modernize your ${formData.title || 'operations'}?`}
              </div>
              <div className="inline-block px-3 py-1 bg-white text-slate-900 rounded-full text-[10px] font-black">
                {formData.cta_button_text || 'Contact Team'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
