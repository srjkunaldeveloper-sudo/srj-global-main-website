import React, { useState } from 'react';
import { 
  Briefcase, 
  Settings, 
  Trash2, 
  Eye, 
  ExternalLink, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ListChecks, 
  Award,
  X
} from 'lucide-react';

export default function JobList({ jobs = [], onEditJob, onDeleteJob }) {
  const [previewJob, setPreviewJob] = useState(null);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" />
              Active Job Postings
            </h3>
            <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {jobs.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Open positions published on the public Careers page (`/careers`).
          </p>
        </div>

        <a
          href="/careers#open-positions"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm flex-shrink-0"
        >
          <span>View Public Careers Page</span>
          <ExternalLink size={12} className="opacity-80" />
        </a>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => {
          const respCount = Array.isArray(job.responsibilities) ? job.responsibilities.length : 0;
          const reqCount = Array.isArray(job.requirements) ? job.requirements.length : 0;
          const perksCount = Array.isArray(job.perks) ? job.perks.length : 0;

          return (
            <div
              key={job.id}
              className="p-5 border border-slate-100 rounded-2xl hover:border-blue-200/80 transition-all bg-slate-50/40 hover:bg-white shadow-[0_2px_12px_rgba(0,0,0,0.01)] group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                      {job.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {job.salary}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{job.id}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {job.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {job.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Briefcase size={13} className="text-slate-400" /> {job.experience}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setPreviewJob(job)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Preview Candidate Detail View"
                  >
                    <Eye size={14} />
                    <span className="hidden md:inline">Preview</span>
                  </button>

                  <button
                    onClick={() => onEditJob(job)}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    title="Edit Job Posting"
                  >
                    <Settings size={14} />
                    <span className="hidden md:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {job.description && (
                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mt-2 mb-3">
                  {job.description}
                </p>
              )}

              {/* Tags & Spec Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(job.tags) &&
                    job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  {respCount > 0 && <span>{respCount} Responsibilities</span>}
                  {reqCount > 0 && <span>{reqCount} Requirements</span>}
                  {perksCount > 0 && <span>{perksCount} Perks</span>}
                </div>
              </div>

            </div>
          );
        })}

        {jobs.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            <Briefcase size={32} className="mx-auto mb-2 opacity-30" />
            <p className="font-bold text-slate-600">No active job postings</p>
            <p className="text-xs mt-1">Use the form to create your first opening.</p>
          </div>
        )}
      </div>

      {/* Candidate-Facing Preview Modal */}
      {previewJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setPreviewJob(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                {previewJob.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                {previewJob.salary}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {previewJob.title}
            </h3>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium pb-4 border-b border-slate-100 mb-6">
              <span>📍 {previewJob.location}</span>
              <span>•</span>
              <span>⏰ {previewJob.type}</span>
              <span>•</span>
              <span>💼 {previewJob.experience}</span>
            </div>

            {previewJob.description && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Role Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {previewJob.description}
                </p>
              </div>
            )}

            {Array.isArray(previewJob.responsibilities) && previewJob.responsibilities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {previewJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(previewJob.requirements) && previewJob.requirements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Qualifications & Skills
                </h4>
                <ul className="space-y-2">
                  {previewJob.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(previewJob.perks) && previewJob.perks.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Role Perks & Benefits
                </h4>
                <ul className="space-y-2">
                  {previewJob.perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="text-indigo-600 font-bold">★</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewJob(null)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
