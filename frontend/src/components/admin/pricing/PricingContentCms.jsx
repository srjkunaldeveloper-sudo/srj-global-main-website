import React from 'react';
import { Sparkles, ExternalLink, Layers, Save } from 'lucide-react';

export default function PricingContentCms({
  pageContentForm,
  setPageContentForm,
  onSaveContent,
  actionLoading
}) {
  return (
    <form onSubmit={onSaveContent} className="space-y-6">
      {/* Hero Section Configuration */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Pricing Hero Section
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Customize the top headline, badge, subtitle, and primary call-to-action on /pricing
            </p>
          </div>
          <a
            href="/pricing"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl transition"
          >
            View Page <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hero Top Badge Text
            </label>
            <input
              type="text"
              value={pageContentForm.pricing_hero_badge}
              onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_badge: e.target.value })}
              placeholder="e.g. Transparent Pricing"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hero Main Heading
            </label>
            <input
              type="text"
              value={pageContentForm.pricing_hero_title}
              onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_title: e.target.value })}
              placeholder="e.g. Flexible Pricing That Grows With You"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Hero Subtitle Description
          </label>
          <textarea
            rows="3"
            value={pageContentForm.pricing_hero_subtitle}
            onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_subtitle: e.target.value })}
            placeholder="Detailed paragraph explaining the pricing philosophy..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hero Consultation Button Text
            </label>
            <input
              type="text"
              value={pageContentForm.pricing_hero_cta_text}
              onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_cta_text: e.target.value })}
              placeholder="e.g. Schedule Consultation"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hero Consultation Button Target URL
            </label>
            <input
              type="text"
              value={pageContentForm.pricing_hero_cta_url}
              onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_hero_cta_url: e.target.value })}
              placeholder="e.g. /#contact, /contact, or Calendly URL"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner Configuration */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Bottom CTA Banner Section
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure the call-to-action banner displayed at the bottom of the pricing page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Banner Main Title
            </label>
            <input
              type="text"
              value={pageContentForm.pricing_cta_title}
              onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_title: e.target.value })}
              placeholder="e.g. Need a custom enterprise architecture?"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Button Text
            </label>
            <input
              type="text"
              value={pageContentForm.pricing_cta_button_text}
              onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_button_text: e.target.value })}
              placeholder="e.g. Book Architectural Review"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Banner Subtitle Description
          </label>
          <textarea
            rows="2"
            value={pageContentForm.pricing_cta_subtitle}
            onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_subtitle: e.target.value })}
            placeholder="Talk to our senior architects to structure a custom proposal..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Button Target URL
          </label>
          <input
            type="text"
            value={pageContentForm.pricing_cta_button_url}
            onChange={(e) => setPageContentForm({ ...pageContentForm, pricing_cta_button_url: e.target.value })}
            placeholder="e.g. /#contact, /contact, etc."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={actionLoading}
            className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {actionLoading ? 'Saving Changes...' : 'Save Pricing Page Content'}
          </button>
        </div>
      </div>
    </form>
  );
}
