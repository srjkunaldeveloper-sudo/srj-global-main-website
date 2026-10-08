import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ContactDetailModal({
  selectedContact,
  onClose,
  onUpdateStatus,
  onDeleteContact,
  formatContactDate
}) {
  if (!selectedContact) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border mb-2 ${
                selectedContact.status === 'new'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : selectedContact.status === 'contacted'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              STATUS: {(selectedContact.status || 'new').toUpperCase()}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              {selectedContact.first_name} {selectedContact.last_name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Inquiry ID: #{selectedContact.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-semibold text-sm p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Grid details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Email Address
            </span>
            <a
              href={`mailto:${selectedContact.email}`}
              className="text-blue-600 font-semibold hover:underline break-all"
            >
              {selectedContact.email}
            </a>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Phone Number
            </span>
            <a
              href={`tel:${selectedContact.phone}`}
              className="text-slate-800 font-semibold hover:underline"
            >
              {selectedContact.phone}
            </a>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Company
            </span>
            <span className="text-slate-800 font-semibold">
              {selectedContact.company || '—'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Service Required
            </span>
            <span className="text-slate-800 font-semibold">
              {selectedContact.service || '—'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Project Budget
            </span>
            <span className="text-slate-800 font-semibold">
              {selectedContact.budget || '—'}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
              Submitted Date
            </span>
            <span className="text-slate-800 font-semibold">
              {formatContactDate ? formatContactDate(selectedContact.created_at) : selectedContact.created_at}
            </span>
          </div>
        </div>

        {/* Status Selector in Modal */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Update Inquiry Status</span>
            <span className="text-[11px] text-slate-500">Select new status to update database record</span>
          </div>
          <select
            value={selectedContact.status || 'new'}
            onChange={(e) => onUpdateStatus(selectedContact.id, e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:outline-none focus:border-slate-900 cursor-pointer shadow-sm"
          >
            <option value="new">Mark as NEW</option>
            <option value="contacted">Mark as CONTACTED</option>
            <option value="resolved">Mark as RESOLVED</option>
          </select>
        </div>

        {/* Full Message content */}
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Full Inquiry Message
          </span>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {selectedContact.message}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <button
            onClick={() =>
              onDeleteContact(
                selectedContact.id,
                `${selectedContact.first_name} ${selectedContact.last_name}`
              )
            }
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Trash2 size={14} />
            Delete Inquiry
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
