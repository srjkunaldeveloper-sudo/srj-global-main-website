import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ToastAlert({ message, onClose }) {
  if (!message || !message.text) return null;

  const isSuccess = message.type === 'success';

  return (
    <div
      className={`p-4 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold transition-all shadow-xs ${
        isSuccess
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          : 'bg-rose-50 text-rose-800 border border-rose-200'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 text-rose-600" />}
        <span>{message.text}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/5 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
