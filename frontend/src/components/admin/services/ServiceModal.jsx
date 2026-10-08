import React from 'react';
import ServiceForm from './ServiceForm';

export default function ServiceModal({
  isOpen,
  editServiceId,
  newService,
  setNewService,
  onSubmit,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold text-slate-900">
            {editServiceId ? 'Edit Capability / Service Card' : 'New Service'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 font-semibold text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
        <ServiceForm
          newService={newService}
          setNewService={setNewService}
          onSubmit={onSubmit}
          editServiceId={editServiceId}
          isModal={true}
        />
      </div>
    </div>
  );
}
