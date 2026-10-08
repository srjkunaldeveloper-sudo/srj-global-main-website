import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import SubscriberStats from './SubscriberStats';
import SubscriberTable from './SubscriberTable';

export default function SubscriberManager({ onNotify }) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subscribers');
      setSubscribers(Array.isArray(res.data) ? res.data : (res.data?.subscribers || []));
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      showNotification('error', 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleToggleSubscriber = async (id) => {
    try {
      const res = await api.put(`/subscribers/${id}/toggle`);
      showNotification('success', 'Subscriber status updated!');
      if (res.data && res.data.subscriber) {
        setSubscribers((prev) => prev.map((s) => (s.id === id ? res.data.subscriber : s)));
      } else {
        fetchSubscribers();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle subscriber status');
    }
  };

  const handleDeleteSubscriber = async (id, email) => {
    if (!window.confirm(`Are you sure you want to delete subscriber "${email}"?`)) return;
    try {
      await api.delete(`/subscribers/${id}`);
      showNotification('success', 'Subscriber deleted successfully!');
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete subscriber');
    }
  };

  const formatSubscriberDate = (dateStr) => {
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

      <SubscriberStats subscribers={subscribers} />

      <SubscriberTable
        subscribers={subscribers}
        subscriberSearch={subscriberSearch}
        setSubscriberSearch={setSubscriberSearch}
        onToggleSubscriber={handleToggleSubscriber}
        onDeleteSubscriber={handleDeleteSubscriber}
        formatSubscriberDate={formatSubscriberDate}
      />
    </div>
  );
}
