import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import TestimonialForm from './TestimonialForm';
import TestimonialList from './TestimonialList';

const INITIAL_TESTIMONIAL_STATE = {
  quote: '',
  author: '',
  role: '',
  company: '',
  rating: 5,
  sort_order: 0,
  image: null,
  is_active: 1
};

export default function TestimonialManager({ onNotify }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newTestimonial, setNewTestimonial] = useState(INITIAL_TESTIMONIAL_STATE);
  const [editTestimonialId, setEditTestimonialId] = useState(null);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await api.get('/testimonials');
      setTestimonials(Array.isArray(res.data) ? res.data : (res.data?.testimonials || []));
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      showNotification('error', 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleCreateOrUpdateTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(newTestimonial).forEach((key) => {
        if (newTestimonial[key] !== null && newTestimonial[key] !== undefined) {
          formData.append(key, newTestimonial[key]);
        }
      });

      if (editTestimonialId) {
        await api.put(`/testimonials/${editTestimonialId}`, formData);
        showNotification('success', 'Testimonial updated successfully!');
      } else {
        await api.post('/testimonials', formData);
        showNotification('success', 'Testimonial created successfully!');
      }

      setNewTestimonial(INITIAL_TESTIMONIAL_STATE);
      setEditTestimonialId(null);
      fetchTestimonials();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTestimonial = (item) => {
    setNewTestimonial({
      quote: item.quote || '',
      author: item.author || '',
      role: item.role || '',
      company: item.company || '',
      rating: item.rating || 5,
      sort_order: item.sort_order || 0,
      image: item.image || null,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditTestimonialId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTestimonial = async (id, currentStatus) => {
    try {
      await api.put(`/testimonials/${id}/toggle`, { is_active: !currentStatus });
      showNotification('success', 'Testimonial status updated!');
      fetchTestimonials();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      showNotification('success', 'Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete testimonial');
    }
  };

  const handleCancelEdit = () => {
    setEditTestimonialId(null);
    setNewTestimonial(INITIAL_TESTIMONIAL_STATE);
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <TestimonialForm
          editTestimonialId={editTestimonialId}
          newTestimonial={newTestimonial}
          setNewTestimonial={setNewTestimonial}
          onSubmit={handleCreateOrUpdateTestimonial}
          onCancelEdit={handleCancelEdit}
        />

        <TestimonialList
          testimonials={testimonials}
          onEditTestimonial={handleEditTestimonial}
          onToggleTestimonial={handleToggleTestimonial}
          onDeleteTestimonial={handleDeleteTestimonial}
        />
      </div>
    </div>
  );
}
