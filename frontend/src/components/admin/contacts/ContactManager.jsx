import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import ContactStats from './ContactStats';
import ContactTable from './ContactTable';
import ContactDetailModal from './ContactDetailModal';

export default function ContactManager({ onNotify }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('all');
  const [selectedContactModal, setSelectedContactModal] = useState(null);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/contact');
      setContacts(res.data.contacts || res.data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      showNotification('error', 'Failed to load contact inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateContactStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/contact/${id}/status`, { status: newStatus });
      showNotification('success', `Contact status updated to "${newStatus}"`);
      setContacts((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                status: newStatus,
                updated_at: res.data.contact?.updated_at || new Date().toISOString()
              }
            : c
        )
      );
      if (selectedContactModal && selectedContactModal.id === id) {
        setSelectedContactModal((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update contact status');
    }
  };

  const handleDeleteContact = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete contact inquiry from "${name}"?`)) return;
    try {
      await api.delete(`/contact/${id}`);
      showNotification('success', 'Contact inquiry deleted successfully!');
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selectedContactModal && selectedContactModal.id === id) {
        setSelectedContactModal(null);
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete contact inquiry');
    }
  };

  const formatContactDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      {/* Stats Header */}
      <ContactStats contacts={contacts} />

      {/* Table & Filters */}
      <ContactTable
        contacts={contacts}
        contactSearch={contactSearch}
        setContactSearch={setContactSearch}
        contactStatusFilter={contactStatusFilter}
        setContactStatusFilter={setContactStatusFilter}
        onUpdateStatus={handleUpdateContactStatus}
        onDeleteContact={handleDeleteContact}
        onViewContactDetails={setSelectedContactModal}
        formatContactDate={formatContactDate}
      />

      {/* Inquiry Detail Modal */}
      <ContactDetailModal
        selectedContact={selectedContactModal}
        onClose={() => setSelectedContactModal(null)}
        onUpdateStatus={handleUpdateContactStatus}
        onDeleteContact={handleDeleteContact}
        formatContactDate={formatContactDate}
      />
    </div>
  );
}
