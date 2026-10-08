import React from 'react';
import { Search, UsersRound, Trash2 } from 'lucide-react';

export default function SubscriberTable({
  subscribers = [],
  subscriberSearch,
  setSubscriberSearch,
  onToggleSubscriber,
  onDeleteSubscriber,
  formatSubscriberDate
}) {
  const filteredSubscribers = subscribers.filter((s) =>
    (s.email || '').toLowerCase().includes(subscriberSearch.trim().toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Subscribers List</h3>
          <p className="text-xs text-slate-500 font-medium">
            Manage audience newsletter subscriptions and status
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={subscriberSearch}
            onChange={(e) => setSubscriberSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-2">
          <UsersRound size={40} className="mx-auto text-slate-300 stroke-[1.5]" />
          <h4 className="text-base font-bold text-slate-700">No subscribers yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Newsletter subscriber records will appear here when visitors subscribe through the website footer or blog section.
          </p>
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          No subscribers match search term "{subscriberSearch}".
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Subscribed At</th>
                <th className="py-3 px-4">Unsubscribed At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{sub.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                        sub.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {sub.status ? sub.status.toUpperCase() : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {sub.source || 'website_footer_blog'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {formatSubscriberDate
                      ? formatSubscriberDate(sub.subscribed_at || sub.created_at)
                      : sub.subscribed_at || sub.created_at}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {sub.unsubscribed_at
                      ? formatSubscriberDate
                        ? formatSubscriberDate(sub.unsubscribed_at)
                        : sub.unsubscribed_at
                      : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggleSubscriber(sub.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-xl border transition cursor-pointer ${
                          sub.status === 'active'
                            ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600'
                        }`}
                      >
                        {sub.status === 'active' ? 'Deactivate' : 'Reactivate'}
                      </button>

                      <button
                        onClick={() => onDeleteSubscriber(sub.id, sub.email)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                        title="Delete Subscriber"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
