import React from 'react';
import { Plus } from 'lucide-react';

export default function FaqForm({
  editFaqId,
  newFaq,
  setNewFaq,
  isCustomFaqCategory,
  setIsCustomFaqCategory,
  customFaqCategory,
  setCustomFaqCategory,
  industries = [],
  onSubmit,
  onCancelEdit,
  loading
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus size={18} />
          {editFaqId ? 'Edit FAQ Entry' : 'New FAQ Entry'}
        </h3>
        {editFaqId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-400 hover:text-red-500 font-bold cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Question *
          </label>
          <textarea
            required
            value={newFaq.question}
            rows={2}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            placeholder="e.g. What is your typical project timeline?"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Answer *
          </label>
          <textarea
            required
            value={newFaq.answer}
            rows={4}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            placeholder="Detailed answer explanation..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none text-sm"
          />
        </div>

        {/* Target Page / Category Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Target Page / Placement *
          </label>
          <select
            value={isCustomFaqCategory ? 'custom' : newFaq.category}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomFaqCategory(true);
                setNewFaq({ ...newFaq, category: 'custom' });
              } else {
                setIsCustomFaqCategory(false);
                setNewFaq({ ...newFaq, category: e.target.value });
              }
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-medium text-xs focus:outline-none focus:border-slate-900"
          >
            <optgroup label="🌐 Main Pages">
              <option value="General">🏠 Home Page (General FAQs)</option>
              <option value="Pricing">🏷️ Pricing Page FAQs</option>
              <option value="Blog">📰 Blog Page FAQs</option>
              <option value="About">🏢 About Us Page FAQs</option>
              <option value="Services">⚙️ Services Page FAQs</option>
              <option value="Careers">💼 Careers Page FAQs</option>
            </optgroup>
            <optgroup label="🏢 Industry Official Pages">
              {industries.map((ind) => (
                <option key={ind.id} value={`Industry - ${ind.title}`}>
                  🚀 {ind.title} Official Page (/industries/{ind.id})
                </option>
              ))}
            </optgroup>
            <optgroup label="🧩 Custom Topic">
              <option value="custom">➕ Custom Topic / Page</option>
            </optgroup>
          </select>

          {isCustomFaqCategory && (
            <div className="mt-2.5">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Custom Topic Name * (e.g. Security, AI, Mobile)
              </label>
              <input
                type="text"
                required
                value={customFaqCategory}
                onChange={(e) => setCustomFaqCategory(e.target.value)}
                placeholder="Enter custom category name..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-slate-900"
              />
            </div>
          )}

          {/* Placement helper badge */}
          <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <span className="font-bold text-blue-600">📍 Displayed on:</span>
            {isCustomFaqCategory
              ? `Custom Page/Component with category="${customFaqCategory || 'Custom'}"`
              : newFaq.category?.startsWith('Industry - ')
              ? `${newFaq.category.replace('Industry - ', '')} Official Landing Page (/industries/...)`
              : newFaq.category === 'General'
              ? 'Home Page Help Center (/)'
              : newFaq.category === 'Pricing'
              ? 'Pricing Page (/pricing)'
              : newFaq.category === 'Blog'
              ? 'Blog Page (/blog)'
              : newFaq.category === 'About'
              ? 'About Us Page (/about)'
              : newFaq.category === 'Services'
              ? 'Services Page (/services)'
              : newFaq.category === 'Careers'
              ? 'Careers Page (/careers)'
              : newFaq.category}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={newFaq.sort_order}
              onChange={(e) =>
                setNewFaq({ ...newFaq, sort_order: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
            />
            <p className="text-[10px] text-slate-400 mt-1">Lower = appears first</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={newFaq.is_active}
              onChange={(e) =>
                setNewFaq({ ...newFaq, is_active: parseInt(e.target.value, 10) })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900 text-xs"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-400 font-semibold text-white transition-all cursor-pointer text-xs shadow-md"
        >
          {editFaqId ? 'Save Changes' : 'Create FAQ'}
        </button>
      </form>
    </div>
  );
}
