import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function TeamMemberList({
  team = [],
  onEditTeamMember,
  onToggleTeamMember,
  onDeleteTeamMember
}) {
  return (
    <div className="xl:col-span-2 space-y-4">
      <h3 className="text-lg font-bold text-slate-900">
        Team Members ({team.length})
      </h3>

      {team.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center text-slate-400">
          No team members found in database. Use the form on the left to add your first member.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {team.map((m) => (
            <div
              key={m.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Member Avatar */}
                <div className="relative shrink-0">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={m.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg border border-slate-200">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  {m.online === 1 && (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"
                      title="Online Status"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {m.role_class || 'dev'}
                    </span>
                    {m.badge && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {m.badge}
                      </span>
                    )}
                    {m.featured === 1 && (
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        FEATURED
                      </span>
                    )}
                    {m.verified === 1 && (
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        VERIFIED
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ml-auto md:ml-0 ${
                        m.is_active
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {m.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                      Order: {m.sort_order || 0}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    {m.name}
                    <span className="text-xs font-semibold text-slate-500">— {m.role}</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mt-1 mb-2">
                    {m.bio}
                  </p>

                  {/* Social link tags */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
                    {m.linkedin && <span>LI: {m.linkedin}</span>}
                    {m.github && <span>GH: {m.github}</span>}
                    {m.twitter && <span>TW: {m.twitter}</span>}
                    {m.email && <span>EM: {m.email}</span>}
                    {m.website && <span>WEB: {m.website}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => onToggleTeamMember(m.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    m.is_active
                      ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                  }`}
                >
                  {m.is_active ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={() => onEditTeamMember(m)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                  title="Edit Member"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => onDeleteTeamMember(m.id)}
                  className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                  title="Delete Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
