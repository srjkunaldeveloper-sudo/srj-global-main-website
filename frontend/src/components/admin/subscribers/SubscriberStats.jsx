import React from 'react';
import { UsersRound, UserCheck, UserX } from 'lucide-react';

export default function SubscriberStats({ subscribers = [] }) {
  const total = subscribers.length;
  const activeCount = subscribers.filter((s) => s.status === 'active').length;
  const unsubscribedCount = subscribers.filter((s) => s.status === 'unsubscribed').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <UsersRound size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{total}</h4>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
          <UserCheck size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{activeCount}</h4>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
          <UserX size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unsubscribed</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{unsubscribedCount}</h4>
        </div>
      </div>
    </div>
  );
}
