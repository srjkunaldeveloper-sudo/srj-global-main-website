import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import FaqForm from './FaqForm';
import FaqList from './FaqList';

const STANDARD_CATEGORIES = ['General', 'Pricing', 'Blog', 'About', 'Services', 'Careers'];

export default function FaqManager({ onNotify, initialCategory = null }) {
  const [faqs, setFaqs] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: '',
    category: initialCategory || 'General',
    sort_order: 0,
    is_active: 1
  });
  const [editFaqId, setEditFaqId] = useState(null);
  const [isCustomFaqCategory, setIsCustomFaqCategory] = useState(false);
  const [customFaqCategory, setCustomFaqCategory] = useState('');

  const [faqCategoryFilter, setFaqCategoryFilter] = useState('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchFaqsData = async () => {
    try {
      setLoading(true);
      const [faqsRes, industriesRes] = await Promise.all([
        api.get('/faqs'),
        api.get('/industries/admin').catch(() => ({ data: [] }))
      ]);

      setFaqs(Array.isArray(faqsRes.data) ? faqsRes.data : (faqsRes.data?.faqs || []));
      const indData = industriesRes.data?.industries || industriesRes.data || [];
      setIndustries(Array.isArray(indData) ? indData : []);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      showNotification('error', 'Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqsData();
  }, []);

  useEffect(() => {
    if (initialCategory) {
      const isStandard = STANDARD_CATEGORIES.includes(initialCategory);
      setIsCustomFaqCategory(!isStandard && !initialCategory.startsWith('Industry - '));
      setNewFaq((prev) => ({ ...prev, category: initialCategory }));
      setFaqCategoryFilter('all');
    }
  }, [initialCategory]);

  const handleCreateOrUpdateFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.question.trim()) {
      showNotification('error', 'Question is required');
      return;
    }
    if (!newFaq.answer || !newFaq.answer.trim()) {
      showNotification('error', 'Answer is required');
      return;
    }

    const selectedCategory = isCustomFaqCategory
      ? customFaqCategory && customFaqCategory.trim()
        ? customFaqCategory.trim()
        : 'General'
      : newFaq.category && newFaq.category.trim()
      ? newFaq.category.trim()
      : 'General';

    setLoading(true);
    try {
      const payload = {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
        category: selectedCategory,
        sort_order: parseInt(newFaq.sort_order, 10) || 0,
        is_active: parseInt(newFaq.is_active, 10) === 1 ? 1 : 0
      };

      if (editFaqId) {
        await api.put(`/faqs/${editFaqId}`, payload);
        showNotification('success', 'FAQ updated successfully!');
      } else {
        await api.post('/faqs', payload);
        showNotification('success', 'FAQ created successfully!');
      }

      setNewFaq({ question: '', answer: '', category: 'General', sort_order: 0, is_active: 1 });
      setIsCustomFaqCategory(false);
      setCustomFaqCategory('');
      setEditFaqId(null);
      fetchFaqsData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFaq = (item) => {
    const isStandard = STANDARD_CATEGORIES.includes(item.category);
    const isIndustry = item.category?.startsWith('Industry - ');
    setIsCustomFaqCategory(!isStandard && !isIndustry);
    setCustomFaqCategory(!isStandard && !isIndustry ? item.category || '' : '');
    setNewFaq({
      question: item.question || '',
      answer: item.answer || '',
      category: isStandard || isIndustry ? item.category || 'General' : 'custom',
      sort_order: item.sort_order !== undefined ? item.sort_order : 0,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditFaqId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFaq = async (id) => {
    try {
      await api.put(`/faqs/${id}/toggle`);
      showNotification('success', 'FAQ status updated!');
      fetchFaqsData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ entry?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      showNotification('success', 'FAQ deleted successfully!');
      fetchFaqsData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  const handleCancelEdit = () => {
    setEditFaqId(null);
    setIsCustomFaqCategory(false);
    setCustomFaqCategory('');
    setNewFaq({ question: '', answer: '', category: 'General', sort_order: 0, is_active: 1 });
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <FaqForm
          editFaqId={editFaqId}
          newFaq={newFaq}
          setNewFaq={setNewFaq}
          isCustomFaqCategory={isCustomFaqCategory}
          setIsCustomFaqCategory={setIsCustomFaqCategory}
          customFaqCategory={customFaqCategory}
          setCustomFaqCategory={setCustomFaqCategory}
          industries={industries}
          onSubmit={handleCreateOrUpdateFaq}
          onCancelEdit={handleCancelEdit}
          loading={loading}
        />

        <FaqList
          faqs={faqs}
          faqSearchQuery={faqSearchQuery}
          setFaqSearchQuery={setFaqSearchQuery}
          faqCategoryFilter={faqCategoryFilter}
          setFaqCategoryFilter={setFaqCategoryFilter}
          onEditFaq={handleEditFaq}
          onToggleFaq={handleToggleFaq}
          onDeleteFaq={handleDeleteFaq}
        />
      </div>
    </div>
  );
}
