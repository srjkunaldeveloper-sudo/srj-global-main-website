import React from 'react';
import { Plus } from 'lucide-react';

export default function TeamMemberForm({
  editTeamId,
  newTeam,
  setNewTeam,
  teamImageFile,
  teamImagePreview,
  handleTeamImageChange,
  handleRemoveTeamImage,
  onSubmit,
  onCancelEdit,
  loading
}) {
  return (
    <div className="xl:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Plus size={18} />
          {editTeamId ? 'Edit Team Member' : 'New Team Member'}
        </h3>
        {editTeamId && (
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
            Full Name *
          </label>
          <input
            type="text"
            required
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
            placeholder="John Anderson"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Role / Position *
          </label>
          <input
            type="text"
            required
            value={newTeam.role}
            onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
            placeholder="Chief Executive Officer"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Role Class
            </label>
            <input
              type="text"
              value={newTeam.role_class}
              onChange={(e) => setNewTeam({ ...newTeam, role_class: e.target.value })}
              placeholder="ceo, cto, dev, design"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Special Badge Tag
            </label>
            <input
              type="text"
              value={newTeam.badge}
              onChange={(e) => setNewTeam({ ...newTeam, badge: e.target.value })}
              placeholder="Team Lead, AI Expert"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Biography *
          </label>
          <textarea
            required
            value={newTeam.bio}
            rows={4}
            onChange={(e) => setNewTeam({ ...newTeam, bio: e.target.value })}
            placeholder="Short professional biography..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 resize-none text-xs"
          />
        </div>

        {/* Image Input & Preview */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Profile Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleTeamImageChange}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900 text-xs mb-2"
          />
          {teamImagePreview && teamImagePreview !== 'REMOVE' && (
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
              <img src={teamImagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {teamImageFile ? teamImageFile.name : 'Current Profile Image'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveTeamImage}
                className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
          {newTeam.image === 'REMOVE' && (
            <p className="text-xs text-amber-600 font-medium">Image marked for removal on save.</p>
          )}
        </div>

        {/* Social Links */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Social Links</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">LinkedIn</label>
              <input
                type="text"
                value={newTeam.linkedin}
                onChange={(e) => setNewTeam({ ...newTeam, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/... or #"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">GitHub</label>
              <input
                type="text"
                value={newTeam.github}
                onChange={(e) => setNewTeam({ ...newTeam, github: e.target.value })}
                placeholder="https://github.com/... or #"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Twitter / X</label>
              <input
                type="text"
                value={newTeam.twitter}
                onChange={(e) => setNewTeam({ ...newTeam, twitter: e.target.value })}
                placeholder="https://twitter.com/... or #"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email</label>
              <input
                type="text"
                value={newTeam.email}
                onChange={(e) => setNewTeam({ ...newTeam, email: e.target.value })}
                placeholder="john@example.com or #"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
              Personal / Portfolio Website
            </label>
            <input
              type="text"
              value={newTeam.website}
              onChange={(e) => setNewTeam({ ...newTeam, website: e.target.value })}
              placeholder="https://john.dev or #"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Checkboxes / Toggles for Featured, Online, Verified */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!newTeam.featured}
              onChange={(e) => setNewTeam({ ...newTeam, featured: e.target.checked ? 1 : 0 })}
              className="rounded border-slate-300 text-slate-900 focus:ring-0"
            />
            Featured
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!newTeam.online}
              onChange={(e) => setNewTeam({ ...newTeam, online: e.target.checked ? 1 : 0 })}
              className="rounded border-slate-300 text-slate-900 focus:ring-0"
            />
            Online
          </label>
          <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={!!newTeam.verified}
              onChange={(e) => setNewTeam({ ...newTeam, verified: e.target.checked ? 1 : 0 })}
              className="rounded border-slate-300 text-slate-900 focus:ring-0"
            />
            Verified
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <input
              type="number"
              value={newTeam.sort_order}
              onChange={(e) =>
                setNewTeam({ ...newTeam, sort_order: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={newTeam.is_active}
              onChange={(e) =>
                setNewTeam({ ...newTeam, is_active: parseInt(e.target.value, 10) })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-slate-900"
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black disabled:bg-slate-400 font-semibold text-white transition-all cursor-pointer shadow-md"
        >
          {editTeamId ? 'Save Changes' : 'Create Team Member'}
        </button>
      </form>
    </div>
  );
}
