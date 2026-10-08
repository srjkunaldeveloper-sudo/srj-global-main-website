import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import PortfolioForm from './PortfolioForm';
import PortfolioList from './PortfolioList';

const INITIAL_PORTFOLIO_STATE = {
  title: '',
  category: '',
  tags: '',
  project_url: '',
  description: '',
  sort_order: 0,
  image: null,
  is_active: 1
};

export default function PortfolioManager({ onNotify }) {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const [newPortfolio, setNewPortfolio] = useState(INITIAL_PORTFOLIO_STATE);
  const [editPortfolioId, setEditPortfolioId] = useState(null);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await api.get('/portfolio');
      setPortfolio(Array.isArray(res.data) ? res.data : (res.data?.portfolio || []));
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      showNotification('error', 'Failed to load portfolio projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleCreateOrUpdatePortfolio = async (e) => {
    e.preventDefault();
    if (!newPortfolio.title || !newPortfolio.title.trim()) {
      showNotification('error', 'Project title is required');
      return;
    }
    if (!newPortfolio.category || !newPortfolio.category.trim()) {
      showNotification('error', 'Category is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(newPortfolio).forEach((key) => {
        if (newPortfolio[key] !== null && newPortfolio[key] !== undefined) {
          formData.append(key, newPortfolio[key]);
        }
      });

      if (editPortfolioId) {
        await api.put(`/portfolio/${editPortfolioId}`, formData);
        showNotification('success', 'Portfolio project updated successfully!');
      } else {
        await api.post('/portfolio', formData);
        showNotification('success', 'Portfolio project created successfully!');
      }

      setNewPortfolio(INITIAL_PORTFOLIO_STATE);
      setEditPortfolioId(null);
      fetchPortfolio();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save portfolio project');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPortfolio = (item) => {
    const formattedTags = Array.isArray(item.tags)
      ? item.tags.join(', ')
      : (typeof item.tags === 'string' ? item.tags : '');

    setNewPortfolio({
      title: item.title || '',
      category: item.category || '',
      tags: formattedTags,
      project_url: item.project_url || '',
      description: item.description || '',
      sort_order: item.sort_order || 0,
      image: item.image || null,
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setEditPortfolioId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePortfolio = async (id, currentStatus) => {
    try {
      await api.put(`/portfolio/${id}/toggle`, { is_active: !currentStatus });
      showNotification('success', 'Portfolio status updated!');
      fetchPortfolio();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!window.confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      showNotification('success', 'Portfolio project deleted successfully!');
      if (editPortfolioId === id) {
        setEditPortfolioId(null);
        setNewPortfolio(INITIAL_PORTFOLIO_STATE);
      }
      fetchPortfolio();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete portfolio project');
    }
  };

  const handleCancelEdit = () => {
    setEditPortfolioId(null);
    setNewPortfolio(INITIAL_PORTFOLIO_STATE);
  };

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <PortfolioForm
          editPortfolioId={editPortfolioId}
          newPortfolio={newPortfolio}
          setNewPortfolio={setNewPortfolio}
          portfolio={portfolio}
          onSubmit={handleCreateOrUpdatePortfolio}
          onCancelEdit={handleCancelEdit}
          onDeletePortfolio={handleDeletePortfolio}
        />

        <PortfolioList
          portfolio={portfolio}
          onEditPortfolio={handleEditPortfolio}
          onTogglePortfolio={handleTogglePortfolio}
          onDeletePortfolio={handleDeletePortfolio}
        />
      </div>
    </div>
  );
}
