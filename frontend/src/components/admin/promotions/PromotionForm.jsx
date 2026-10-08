import React from 'react';
import { Plus } from 'lucide-react';

export default function PromotionForm({
  editPromotionId,
  newPromotion,
  setNewPromotion,
  promotionImagePreview,
  setPromotionImagePreview,
  onSubmit,
  onCancelEdit
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus size={18} />
          {editPromotionId ? 'Edit Announcement' : 'New Launch Banner'}
        </h3>
        {editPromotionId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Launch Title
          </label>
          <input
            type="text"
            required
            value={newPromotion.title}
            onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
            placeholder="Aviator Game Development"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            required
            value={newPromotion.description}
            rows={4}
            onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
            placeholder="Write dynamic details about this product launch..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            CTA Text (Button text)
          </label>
          <input
            type="text"
            value={newPromotion.cta_text}
            onChange={(e) => setNewPromotion({ ...newPromotion, cta_text: e.target.value })}
            placeholder="Learn More"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            CTA Link (URL)
          </label>
          <input
            type="text"
            value={newPromotion.cta_link}
            onChange={(e) => setNewPromotion({ ...newPromotion, cta_link: e.target.value })}
            placeholder="/services or external link"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Banner Image (Optional)
          </label>
          {promotionImagePreview && (
            <div className="mb-2 relative w-fit">
              <img
                src={promotionImagePreview}
                alt="Preview"
                className="h-16 w-32 object-cover rounded-lg border border-slate-200"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">Current Banner Image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setNewPromotion({ ...newPromotion, image: file });
                setPromotionImagePreview(URL.createObjectURL(file));
              }
            }}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer shadow-md"
        >
          {editPromotionId ? 'Update Announcement' : 'Create Announcement'}
        </button>
      </form>
    </div>
  );
}
