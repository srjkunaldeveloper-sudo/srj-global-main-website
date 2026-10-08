import React from 'react';
import { Plus } from 'lucide-react';

export const STANDARD_JOB_CATEGORIES = [
  'Engineering',
  'Product & Design',
  'Operations',
  'Marketing',
  'Customer Experience'
];

export default function JobForm({
  editJobId,
  newJob,
  setNewJob,
  isCustomCategory,
  setIsCustomCategory,
  customCategory,
  setCustomCategory,
  onSubmit,
  onCancelEdit
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus size={18} />
          {editJobId ? 'Edit Job Posting' : 'New Job Posting'}
        </h3>
        {editJobId && (
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
            Job Title
          </label>
          <input
            type="text"
            required
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            placeholder="e.g. Senior Frontend Engineer"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <input
              type="text"
              required
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              placeholder="Remote / Mumbai"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Type
            </label>
            <input
              type="text"
              required
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              placeholder="Full-time"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Experience
            </label>
            <input
              type="text"
              required
              value={newJob.experience}
              onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
              placeholder="3-5 Years"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Salary
            </label>
            <input
              type="text"
              required
              value={newJob.salary}
              onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              placeholder="Competitive"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            required
            value={isCustomCategory ? 'Other' : newJob.category}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'Other') {
                setIsCustomCategory(true);
                setNewJob((prev) => ({ ...prev, category: customCategory || '' }));
              } else {
                setIsCustomCategory(false);
                setNewJob((prev) => ({ ...prev, category: val }));
              }
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
          >
            <option value="">Select Category</option>
            {STANDARD_JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {isCustomCategory && (
            <div className="mt-2.5">
              <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                Mention Category Name
              </label>
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  setNewJob((prev) => ({ ...prev, category: e.target.value }));
                }}
                placeholder="e.g. Cyber Security, Human Resources, Sales"
                className="w-full px-4 py-2.5 rounded-xl border border-blue-400 bg-blue-50/30 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Tags (Comma Separated)
          </label>
          <input
            type="text"
            value={newJob.tags}
            onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
            placeholder="React, Node.js, AWS"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md mt-4 cursor-pointer"
        >
          {editJobId ? 'Update Job' : 'Publish Job'}
        </button>
      </form>
    </div>
  );
}
