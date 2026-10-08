import React from 'react';
import { Plus } from 'lucide-react';

export default function TestimonialForm({
  editTestimonialId,
  newTestimonial,
  setNewTestimonial,
  onSubmit,
  onCancelEdit
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus size={18} />
          {editTestimonialId ? 'Edit Testimonial' : 'New Testimonial'}
        </h3>
        {editTestimonialId && (
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
            Author Name *
          </label>
          <input
            type="text"
            required
            value={newTestimonial.author}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
            placeholder="e.g. Rajesh Kumar"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Role / Designation *
          </label>
          <input
            type="text"
            required
            value={newTestimonial.role}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
            placeholder="e.g. CEO & Co-Founder"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Company
          </label>
          <input
            type="text"
            value={newTestimonial.company}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
            placeholder="e.g. Apex Global Solutions"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Rating (1 to 5) *
          </label>
          <select
            value={newTestimonial.rating}
            onChange={(e) =>
              setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value, 10) })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
          >
            <option value={5}>5 Stars (★★★★★)</option>
            <option value={4}>4 Stars (★★★★☆)</option>
            <option value={3}>3 Stars (★★★☆☆)</option>
            <option value={2}>2 Stars (★★☆☆☆)</option>
            <option value={1}>1 Star (★☆☆☆☆)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Testimonial Quote *
          </label>
          <textarea
            required
            value={newTestimonial.quote}
            rows={4}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
            placeholder="Write client review / feedback here..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={newTestimonial.sort_order}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  sort_order: parseInt(e.target.value, 10) || 0
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={newTestimonial.is_active}
              onChange={(e) =>
                setNewTestimonial({
                  ...newTestimonial,
                  is_active: parseInt(e.target.value, 10)
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Avatar Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewTestimonial({ ...newTestimonial, image: e.target.files[0] })
            }
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
          />
          {typeof newTestimonial.image === 'string' && newTestimonial.image && (
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>
                Current Image:{' '}
                <a
                  href={newTestimonial.image}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  View Avatar
                </a>
              </span>
              <button
                type="button"
                onClick={() =>
                  setNewTestimonial({ ...newTestimonial, image: 'REMOVE' })
                }
                className="text-red-500 hover:underline font-bold cursor-pointer"
              >
                Remove Avatar
              </button>
            </div>
          )}
          {newTestimonial.image === 'REMOVE' && (
            <p className="text-xs text-amber-600 font-semibold mt-2">
              Avatar will be removed upon saving.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer shadow-md"
        >
          {editTestimonialId ? 'Save Changes' : 'Create Testimonial'}
        </button>
      </form>
    </div>
  );
}
