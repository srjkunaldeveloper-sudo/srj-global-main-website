import React from 'react';
import { Mail, Search, Filter, Building, Eye, Trash2 } from 'lucide-react';

export default function ContactTable({
  contacts = [],
  contactSearch,
  setContactSearch,
  contactStatusFilter,
  setContactStatusFilter,
  onUpdateStatus,
  onDeleteContact,
  onViewContactDetails,
  formatContactDate
}) {
  const filteredContacts = contacts.filter((c) => {
    if (contactStatusFilter !== 'all' && c.status !== contactStatusFilter) return false;
    const q = contactSearch.trim().toLowerCase();
    if (!q) return true;
    const fullName = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const company = (c.company || '').toLowerCase();
    const service = (c.service || '').toLowerCase();
    return (
      fullName.includes(q) ||
      email.includes(q) ||
      phone.includes(q) ||
      company.includes(q) ||
      service.includes(q)
    );
  });

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Contact Inquiries</h3>
          <p className="text-xs text-slate-500 font-medium">
            View, filter, track status, and manage client direct inquiry messages
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={contactStatusFilter}
              onChange={(e) => setContactStatusFilter(e.target.value)}
              className="w-full sm:w-40 pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 cursor-pointer appearance-none"
            >
              <option value="all">All Statuses ({contacts.length})</option>
              <option value="new">New ({contacts.filter((c) => c.status === 'new').length})</option>
              <option value="contacted">
                Contacted ({contacts.filter((c) => c.status === 'contacted').length})
              </option>
              <option value="resolved">
                Resolved ({contacts.filter((c) => c.status === 'resolved').length})
              </option>
            </select>
            <Filter
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Search name, email, phone, company..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>
      </div>

      {/* List / Table */}
      {contacts.length === 0 ? (
        <div className="p-12 text-center text-slate-400 space-y-2">
          <Mail size={40} className="mx-auto text-slate-300 stroke-[1.5]" />
          <h4 className="text-base font-bold text-slate-700">No contact inquiries yet</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Inquiries submitted by clients via the contact form will appear here in real time.
          </p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs space-y-2">
          <p>No contact inquiries match your search and filter criteria.</p>
          <button
            onClick={() => {
              setContactSearch('');
              setContactStatusFilter('all');
            }}
            className="text-blue-600 font-semibold hover:underline text-xs cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Company & Service</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredContacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {c.first_name} {c.last_name}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="text-slate-800 font-medium">{c.email}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.phone}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {c.service || 'General'}
                      </span>
                      {c.company && (
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Building size={11} className="text-slate-400" />
                          {c.company}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {c.budget ? c.budget : <span className="text-slate-400 font-normal">—</span>}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed" title={c.message}>
                      {c.message}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={c.status || 'new'}
                      onChange={(e) => onUpdateStatus(c.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border cursor-pointer focus:outline-none transition-colors ${
                        c.status === 'new'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          : c.status === 'contacted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <option value="new" className="bg-white text-slate-900 font-medium">
                        NEW
                      </option>
                      <option value="contacted" className="bg-white text-slate-900 font-medium">
                        CONTACTED
                      </option>
                      <option value="resolved" className="bg-white text-slate-900 font-medium">
                        RESOLVED
                      </option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap font-medium">
                    {formatContactDate ? formatContactDate(c.created_at) : c.created_at}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewContactDetails(c)}
                        className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteContact(c.id, `${c.first_name} ${c.last_name}`)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-100 hover:border-red-100 transition cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={15} />
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
