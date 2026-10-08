import React from 'react';
import { Save } from 'lucide-react';

export default function CollabContentCms({
  contentData,
  setContentData,
  onSaveContent,
  contentLoading
}) {
  return (
    <form onSubmit={onSaveContent} className="space-y-6">
      {/* Hero Section Configuration */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Hero Section CMS</h3>
            <p className="text-xs text-slate-500 mt-0.5">Top banner headline, badge, and descriptive paragraph.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Hero Area</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Hero Top Badge
            </label>
            <input
              type="text"
              value={contentData.collab_hero_badge}
              onChange={(e) => setContentData({ ...contentData, collab_hero_badge: e.target.value })}
              placeholder="e.g. Partnership Hub"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Hero Main Heading
            </label>
            <input
              type="text"
              value={contentData.collab_hero_title}
              onChange={(e) => setContentData({ ...contentData, collab_hero_title: e.target.value })}
              placeholder="e.g. Build The Future Together."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Hero Subtitle Paragraph
            </label>
            <textarea
              rows={3}
              value={contentData.collab_hero_subtitle}
              onChange={(e) => setContentData({ ...contentData, collab_hero_subtitle: e.target.value })}
              placeholder="Explain your collaboration philosophy..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Offerings Section Configuration */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Offerings Section Header CMS</h3>
            <p className="text-xs text-slate-500 mt-0.5">Section header above the 6 collaboration model cards.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Grid Area</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Section Small Label
            </label>
            <input
              type="text"
              value={contentData.collab_section_badge}
              onChange={(e) => setContentData({ ...contentData, collab_section_badge: e.target.value })}
              placeholder="e.g. OUR OFFERINGS"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Section Main Heading
            </label>
            <input
              type="text"
              value={contentData.collab_section_title}
              onChange={(e) => setContentData({ ...contentData, collab_section_title: e.target.value })}
              placeholder="e.g. Collaboration Models"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Section Subtitle
            </label>
            <input
              type="text"
              value={contentData.collab_section_subtitle}
              onChange={(e) => setContentData({ ...contentData, collab_section_subtitle: e.target.value })}
              placeholder="e.g. End-to-end technological and strategic support for your business."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner Configuration */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Bottom CTA Banner CMS</h3>
            <p className="text-xs text-slate-500 mt-0.5">Final conversion call-to-action banner at the bottom of the page.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">CTA Area</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              CTA Banner Title
            </label>
            <input
              type="text"
              value={contentData.collab_cta_title}
              onChange={(e) => setContentData({ ...contentData, collab_cta_title: e.target.value })}
              placeholder="e.g. Ready to Transform Your Idea?"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Primary Button Label
            </label>
            <input
              type="text"
              value={contentData.collab_cta_btn_primary}
              onChange={(e) => setContentData({ ...contentData, collab_cta_btn_primary: e.target.value })}
              placeholder="e.g. Discuss Your Project"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              CTA Banner Subtitle
            </label>
            <textarea
              rows={2}
              value={contentData.collab_cta_subtitle}
              onChange={(e) => setContentData({ ...contentData, collab_cta_subtitle: e.target.value })}
              placeholder="e.g. Let's build something extraordinary together..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Secondary Button Label
            </label>
            <input
              type="text"
              value={contentData.collab_cta_btn_secondary}
              onChange={(e) => setContentData({ ...contentData, collab_cta_btn_secondary: e.target.value })}
              placeholder="e.g. Explore Services"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={contentLoading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save size={16} />
          {contentLoading ? 'Saving Settings...' : 'Save Collaboration Page Settings'}
        </button>
      </div>
    </form>
  );
}
