import React from 'react';
import { Mail, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactStats({ contacts = [] }) {
  const total = contacts.length;
  const newCount = contacts.filter((c) => c.status === 'new').length;
  const contactedCount = contacts.filter((c) => c.status === 'contacted').length;
  const resolvedCount = contacts.filter((c) => c.status === 'resolved').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-slate-100 text-slate-700 shrink-0">
          <Mail size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Inquiries</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{total}</h4>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
          <Sparkles size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{newCount}</h4>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
          <Clock size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contacted</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{contactedCount}</h4>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex items-center gap-4">
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
          <h4 className="text-2xl font-extrabold text-slate-900">{resolvedCount}</h4>
        </div>
      </div>
    </div>
  );
}
