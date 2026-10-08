import React from 'react';

export default function PricingInquiriesTable({ inquiries = [] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Enterprise Plan Quotes ({inquiries.length})</h3>
        <span className="text-xs text-slate-400">Leads captured from the Pricing calculator modal</span>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
          No plan inquiries registered in the database yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inquiries.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{p.full_name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{p.email} | {p.phone}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                  {p.plan_name}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-medium">
                <div>
                  <span className="text-slate-400 block">Company:</span>
                  <span className="text-slate-800 font-semibold">{p.company_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Project:</span>
                  <span className="text-slate-800 font-semibold">{p.project_type || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Budget:</span>
                  <span className="text-slate-900 font-extrabold">{p.budget || 'N/A'}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Configuration & Requirements:</span>
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-2xl">{p.requirements}</p>
              </div>
              <span className="text-[10px] text-slate-400 block mt-3 font-semibold">{new Date(p.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
