import React from 'react';
import { Users } from 'lucide-react';

export default function JobApplicationsList({ applications = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Users size={18} />
        Job Applications
        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
          {applications.length}
        </span>
      </h3>
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-slate-900">{app.full_name}</h4>
                <p className="text-sm text-slate-500 mt-0.5">
                  {app.email} • {app.phone}
                </p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                {app.job_title}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{app.message}</p>
            </div>
            <div className="mt-3 text-xs text-slate-400 font-medium text-right">
              Received: {new Date(app.created_at).toLocaleString()}
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="text-slate-500 text-center py-6">No applications received yet.</p>
        )}
      </div>
    </div>
  );
}
