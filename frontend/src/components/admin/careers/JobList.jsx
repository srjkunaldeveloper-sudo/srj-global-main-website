import React from 'react';
import { Briefcase, Settings, Trash2 } from 'lucide-react';

export default function JobList({ jobs = [], onEditJob, onDeleteJob }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Briefcase size={18} />
        Active Job Postings
        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
          {jobs.length}
        </span>
      </h3>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-5 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors bg-slate-50/50"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-1">
                  <span>{job.location}</span> • <span>{job.type}</span> • <span>{job.experience}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditJob(job)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit Job"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={() => onDeleteJob(job.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Job"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold">
                {job.category}
              </span>
              {Array.isArray(job.tags) &&
                job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="text-slate-500 text-center py-6">No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
}
