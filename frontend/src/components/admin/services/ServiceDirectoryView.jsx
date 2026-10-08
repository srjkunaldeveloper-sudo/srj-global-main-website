import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { serviceCategories } from '../../../data/servicesData';
import ServiceForm from './ServiceForm';

export default function ServiceDirectoryView({
  services = [],
  activeServiceTab,
  setActiveServiceTab,
  newService,
  setNewService,
  onCreateService,
  onEditService,
  onDeleteService
}) {
  const filteredServices = services.filter((s) => {
    if (activeServiceTab === 'all') return true;
    if (activeServiceTab === 'uncategorized') return !s.category_id;
    return s.category_id === activeServiceTab;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Form to Create Service */}
      <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Plus size={18} />
            New Service
          </h3>
        </div>
        <ServiceForm
          newService={newService}
          setNewService={setNewService}
          onSubmit={onCreateService}
          editServiceId={null}
        />
      </div>

      {/* List of Services */}
      <div className="xl:col-span-2 space-y-4">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            Active Services ({services.length})
          </h3>

          {/* Category Tabs */}
          <div
            className="flex gap-2 overflow-x-auto pb-2 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button
              onClick={() => setActiveServiceTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeServiceTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Services
            </button>
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveServiceTab(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeServiceTab === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.title}
              </button>
            ))}
            <button
              onClick={() => setActiveServiceTab('uncategorized')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeServiceTab === 'uncategorized'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Custom / Uncategorized
            </button>
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
            No services found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredServices.map((s) => (
              <div
                key={s.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex justify-between items-start gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 mb-2">
                    {s.category_id && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                        {serviceCategories.find((c) => c.id === s.category_id)?.title || s.category_id}
                      </span>
                    )}
                    {s.is_home && (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Home Pillar #{s.sort_order}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900">{s.title}</h4>
                  <p className="text-slate-500 text-sm mt-2">{s.short_description}</p>
                  {Array.isArray(s.tags) && s.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3">
                    {s.icon && (
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        Icon: {s.icon}
                      </span>
                    )}
                  </div>
                </div>

                {s.image && (
                  <img
                    src={s.image}
                    alt={s.title}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                  />
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onEditService(s)}
                    className="p-2.5 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-100 transition cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteService(s.id)}
                    className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                    title="Delete service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
