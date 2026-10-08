import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function PortfolioForm({
  editPortfolioId,
  newPortfolio,
  setNewPortfolio,
  portfolio = [],
  onSubmit,
  onCancelEdit,
  onDeletePortfolio
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus size={18} />
          {editPortfolioId ? 'Edit Portfolio Project' : 'New Portfolio Project'}
        </h3>
        {editPortfolioId && (
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
            Project Title *
          </label>
          <input
            type="text"
            required
            value={newPortfolio.title}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
            placeholder="e.g. Aura Fintech Platform"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Category *
          </label>
          <input
            type="text"
            required
            value={newPortfolio.category}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
            placeholder="e.g. Financial Technology"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Tech Tags (Comma-separated)
          </label>
          <input
            type="text"
            value={newPortfolio.tags}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, tags: e.target.value })}
            placeholder="e.g. React, Next.js, PostgreSQL"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Project / Demo URL (Optional)
          </label>
          <input
            type="text"
            value={newPortfolio.project_url}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, project_url: e.target.value })}
            placeholder="e.g. https://aura-fintech.example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Description (Optional)
          </label>
          <textarea
            value={newPortfolio.description}
            rows={3}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
            placeholder="Short summary of the project architecture and features..."
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
              value={newPortfolio.sort_order}
              onChange={(e) =>
                setNewPortfolio({
                  ...newPortfolio,
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
              value={newPortfolio.is_active}
              onChange={(e) =>
                setNewPortfolio({
                  ...newPortfolio,
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
            Project Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setNewPortfolio({ ...newPortfolio, image: file });
              }
            }}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
          />
          {newPortfolio.image instanceof File && (
            <div className="flex items-center justify-between text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="truncate max-w-[200px] font-medium">
                Selected: {newPortfolio.image.name}
              </span>
              <button
                type="button"
                onClick={() => setNewPortfolio({ ...newPortfolio, image: null })}
                className="text-red-500 hover:text-red-700 font-bold cursor-pointer ml-2"
              >
                Remove
              </button>
            </div>
          )}
          {typeof newPortfolio.image === 'string' &&
            newPortfolio.image &&
            newPortfolio.image !== 'REMOVE' && (
              <div className="flex items-center justify-between text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span>
                  Current Image:{' '}
                  <a
                    href={newPortfolio.image}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline font-semibold"
                  >
                    View Image
                  </a>
                </span>
                <button
                  type="button"
                  onClick={() => setNewPortfolio({ ...newPortfolio, image: 'REMOVE' })}
                  className="text-red-500 hover:text-red-700 font-bold cursor-pointer ml-2"
                >
                  Remove Image
                </button>
              </div>
            )}
          {newPortfolio.image === 'REMOVE' && (
            <div className="flex items-center justify-between text-xs text-amber-700 mt-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span>Image will be removed upon saving.</span>
              <button
                type="button"
                onClick={() => {
                  const existingItem = portfolio.find((p) => p.id === editPortfolioId);
                  setNewPortfolio({ ...newPortfolio, image: existingItem?.image || null });
                }}
                className="text-slate-600 hover:underline font-bold cursor-pointer ml-2"
              >
                Undo
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer shadow-md"
          >
            {editPortfolioId ? 'Save Changes' : 'Create Project'}
          </button>
          {editPortfolioId && (
            <button
              type="button"
              onClick={() => onDeletePortfolio(editPortfolioId)}
              className="px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Delete this portfolio project permanently"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
