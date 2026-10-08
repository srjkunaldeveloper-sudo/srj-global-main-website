import React from 'react';
import { serviceCategories } from '../../../data/servicesData';

export default function ServiceForm({
  newService,
  setNewService,
  onSubmit,
  editServiceId,
  isModal = false
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Service Title
        </label>
        <input
          type="text"
          required
          value={newService.title}
          onChange={(e) => setNewService({ ...newService, title: e.target.value })}
          placeholder="Mobile Development"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
        />
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <input
          type="checkbox"
          id={isModal ? 'is_home_checkbox_modal' : 'is_home_checkbox'}
          checked={newService.is_home}
          onChange={(e) => setNewService({ ...newService, is_home: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
        />
        <label
          htmlFor={isModal ? 'is_home_checkbox_modal' : 'is_home_checkbox'}
          className="text-sm font-semibold text-slate-700 cursor-pointer"
        >
          Show on Home Page Services Section
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Home Sort Order (1-6)
          </label>
          <input
            type="number"
            min="0"
            value={newService.sort_order}
            onChange={(e) =>
              setNewService({ ...newService, sort_order: parseInt(e.target.value, 10) || 0 })
            }
            placeholder="1"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Icon Name (Lucide Icon)
          </label>
          <input
            type="text"
            value={newService.icon}
            onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
            placeholder="Lightbulb, Code, Rocket..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Feature Tags (Comma Separated)
        </label>
        <input
          type="text"
          value={newService.tags}
          onChange={(e) => setNewService({ ...newService, tags: e.target.value })}
          placeholder="Market Research, Feasibility Analysis, MVP Scope"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Category (Optional)
        </label>
        <select
          value={newService.category_id}
          onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
        >
          <option value="">-- No Category (Custom Solutions) --</option>
          {serviceCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Service Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewService({ ...newService, image: e.target.files[0] })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
        />
        {typeof newService.image === 'string' && newService.image && (
          <p className="text-xs text-slate-500 mt-2">
            Current Image:{' '}
            <a href={newService.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">
              View
            </a>
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Short Description
        </label>
        <textarea
          required
          value={newService.short_description}
          rows={3}
          onChange={(e) => setNewService({ ...newService, short_description: e.target.value })}
          placeholder="Brief summary of service features..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          Full Detailed Description
        </label>
        <textarea
          required
          value={newService.full_description}
          rows={5}
          onChange={(e) => setNewService({ ...newService, full_description: e.target.value })}
          placeholder="Long form details of deliverables, roadmap..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black font-semibold text-white transition-all cursor-pointer shadow-md"
      >
        {editServiceId ? 'Update Service' : 'Publish Service'}
      </button>
    </form>
  );
}
