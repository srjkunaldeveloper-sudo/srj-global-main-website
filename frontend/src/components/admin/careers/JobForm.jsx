import React, { useState } from 'react';
import { 
  Plus, 
  Briefcase, 
  FileText, 
  ListChecks, 
  Award, 
  Sparkles,
  Check,
  X
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'requirements'

  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] h-fit sticky top-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Briefcase size={18} className="text-blue-600" />
            {editJobId ? `Edit Job #${editJobId}` : 'Create Job Opening'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Define role overview, responsibilities, and requirements.
          </p>
        </div>

        {editJobId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 px-3 py-1 bg-rose-50 rounded-lg cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-1 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText size={13} />
          <span>Basic & Compensation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requirements')}
          className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'requirements'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ListChecks size={13} />
          <span>Detailed Specs & Perks</span>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        
        {/* ================= TAB 1: BASIC INFORMATION ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={newJob.title || ''}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="e.g. Senior Full-Stack Cloud Engineer"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                {!isCustomCategory ? (
                  <select
                    value={newJob.category || ''}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomCategory(true);
                      } else {
                        setNewJob({ ...newJob, category: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    {STANDARD_JOB_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Custom Category...</option>
                  </select>
                ) : (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Custom category..."
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(false);
                        setCustomCategory('');
                      }}
                      className="p-2 text-slate-400 hover:text-slate-600"
                      title="Back to list"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Employment Type *
                </label>
                <select
                  value={newJob.type || ''}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={newJob.location || ''}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  placeholder="Remote / Mumbai / Hybrid"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Experience Level *
                </label>
                <input
                  type="text"
                  required
                  value={newJob.experience || ''}
                  onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                  placeholder="e.g. 3-5 Years / Senior"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Salary Package / Compensation *
              </label>
              <input
                type="text"
                required
                value={newJob.salary || ''}
                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                placeholder="e.g. ₹18 - ₹28 LPA or Competitive"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Skills & Tech Stack Tags
              </label>
              <input
                type="text"
                value={newJob.tags || ''}
                onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
                placeholder="React, Node.js, AWS, Docker (comma separated)"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Role Summary / Overview
              </label>
              <textarea
                value={newJob.description || ''}
                rows={3}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                placeholder="Brief summary of the role, team context, and key challenges..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 2: DETAILED SPECS & PERKS ================= */}
        {activeTab === 'requirements' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Key Responsibilities</span>
                <span className="text-[10px] font-normal text-slate-400">1 bullet point per line</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">
                What the candidate will do day-to-day:
              </p>
              <textarea
                value={newJob.responsibilities || ''}
                rows={5}
                onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                placeholder="Architect and deploy scalable microservices using Node.js&#10;Design performant React interfaces with atomic state management&#10;Collaborate with cross-functional product and DevOps teams"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Required Skills & Qualifications</span>
                <span className="text-[10px] font-normal text-slate-400">1 qualification per line</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">
                Must-have technical competencies and experience:
              </p>
              <textarea
                value={newJob.requirements || ''}
                rows={5}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                placeholder="4+ years of professional backend engineering with TypeScript/Node.js&#10;Hands-on experience with PostgreSQL, Docker, and AWS services&#10;Strong problem-solving ability and clean architecture fundamentals"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Role Perks & Benefits</span>
                <span className="text-[10px] font-normal text-slate-400">1 benefit per line</span>
              </label>
              <p className="text-[11px] text-slate-400 mb-1.5">
                Special perks offered for this role:
              </p>
              <textarea
                value={newJob.perks || ''}
                rows={4}
                onChange={(e) => setNewJob({ ...newJob, perks: e.target.value })}
                placeholder="Remote-first work flexibility with home office allowance&#10;Competitive equity and annual performance bonuses&#10;Annual learning budget for certifications and conferences"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>{editJobId ? 'Save & Update Job' : 'Publish Job Opening'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
