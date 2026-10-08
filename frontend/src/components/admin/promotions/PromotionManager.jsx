import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import PromotionForm from './PromotionForm';
import PromotionList from './PromotionList';

const INITIAL_PROMOTION_STATE = {
  title: '',
  description: '',
  cta_text: 'Learn More',
  cta_link: '',
  image: null
};

export default function PromotionManager({ onNotify }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newPromotion, setNewPromotion] = useState(INITIAL_PROMOTION_STATE);
  const [editPromotionId, setEditPromotionId] = useState(null);
  const [promotionImagePreview, setPromotionImagePreview] = useState(null);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/promotions');
      setPromotions(Array.isArray(res.data) ? res.data : (res.data?.promotions || []));
    } catch (err) {
      console.error('Error fetching promotions:', err);
      showNotification('error', 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreateOrUpdatePromotion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', (newPromotion.title || '').trim());
      formData.append('description', (newPromotion.description || '').trim());
      formData.append('cta_text', (newPromotion.cta_text || 'Learn More').trim());
      formData.append('cta_link', (newPromotion.cta_link || '').trim());
      if (newPromotion.image instanceof File) {
        formData.append('image', newPromotion.image);
      } else if (typeof newPromotion.image === 'string' && newPromotion.image) {
        formData.append('image_url', newPromotion.image);
      }

      if (editPromotionId) {
        await api.put(`/promotions/${editPromotionId}`, formData);
        showNotification('success', 'Announcement updated successfully!');
      } else {
        await api.post('/promotions', formData);
        showNotification('success', 'Announcement created successfully!');
      }

      setNewPromotion(INITIAL_PROMOTION_STATE);
      setEditPromotionId(null);
      setPromotionImagePreview(null);
      fetchPromotions();
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPromotion = (p) => {
    setNewPromotion({
      title: p.title || '',
      description: p.description || '',
      cta_text: p.cta_text || 'Learn More',
      cta_link: p.cta_link || '',
      image: p.image_url || null
    });
    setPromotionImagePreview(p.image_url || null);
    setEditPromotionId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePromotion = async (id, currentStatus) => {
    try {
      await api.put(`/promotions/${id}/toggle`, { is_active: !currentStatus });
      showNotification('success', 'Announcement launch status toggled!');
      fetchPromotions();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle launch status');
    }
  };

  const handleDeletePromotion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this launch announcement?')) return;
    try {
      await api.delete(`/promotions/${id}`);
      showNotification('success', 'Announcement deleted successfully!');
      fetchPromotions();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  const handleCancelEdit = () => {
    setEditPromotionId(null);
    setPromotionImagePreview(null);
    setNewPromotion(INITIAL_PROMOTION_STATE);
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <PromotionForm
          editPromotionId={editPromotionId}
          newPromotion={newPromotion}
          setNewPromotion={setNewPromotion}
          promotionImagePreview={promotionImagePreview}
          setPromotionImagePreview={setPromotionImagePreview}
          onSubmit={handleCreateOrUpdatePromotion}
          onCancelEdit={handleCancelEdit}
        />

        <PromotionList
          promotions={promotions}
          onEditPromotion={handleEditPromotion}
          onTogglePromotion={handleTogglePromotion}
          onDeletePromotion={handleDeletePromotion}
        />
      </div>
    </div>
  );
}
