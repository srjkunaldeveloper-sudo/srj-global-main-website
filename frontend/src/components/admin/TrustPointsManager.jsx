import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  Award,
  Shield,
  ShieldCheck,
  Zap,
  Star,
  Target,
  Sparkles,
  Heart,
  Globe,
  Lock,
  ThumbsUp,
  CheckCircle,
  Lightbulb,
  Compass,
  Users
} from 'lucide-react';
import api from '../../config/api';

const AVAILABLE_ICONS = [
  { name: 'CheckCircle2', icon: CheckCircle2 },
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Shield', icon: Shield },
  { name: 'Award', icon: Award },
  { name: 'Zap', icon: Zap },
  { name: 'Star', icon: Star },
  { name: 'Target', icon: Target },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Heart', icon: Heart },
  { name: 'Globe', icon: Globe },
  { name: 'Lock', icon: Lock },
  { name: 'ThumbsUp', icon: ThumbsUp },
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Compass', icon: Compass },
  { name: 'Users', icon: Users }
];

export function renderLucideIcon(iconName, size = 18, className = '') {
  const iconObj = AVAILABLE_ICONS.find(i => i.name.toLowerCase() === (iconName || '').toLowerCase());
  const IconComp = iconObj ? iconObj.icon : CheckCircle2;
  return <IconComp size={size} className={className} />;
}

export default function TrustPointsManager() {
  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'CheckCircle2',
    sort_order: 0,
    is_active: 1
  });

  const fetchPoints = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get('/trust-points/admin');
      if (res.data && res.data.success && Array.isArray(res.data.points)) {
        setPoints(res.data.points);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch trust points');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPoint(null);
    setFormData({
      title: '',
      description: '',
      icon_name: 'CheckCircle2',
      sort_order: points.length + 1,
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (point) => {
    setEditingPoint(point);
    setFormData({
      title: point.title || '',
      description: point.description || '',
      icon_name: point.icon_name || 'CheckCircle2',
      sort_order: point.sort_order || 0,
      is_active: point.is_active === 1 || point.is_active === true ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPoint(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      ...formData,
      sort_order: parseInt(formData.sort_order, 10) || 0
    };

    try {
      if (editingPoint) {
        const res = await api.put(`/trust-points/${editingPoint.id}`, payload);
        if (res.data && res.data.success) {
          setSuccessMessage('Trust point updated successfully');
          fetchPoints();
          handleCloseModal();
        }
      } else {
        const res = await api.post('/trust-points', payload);
        if (res.data && res.data.success) {
          setSuccessMessage('Trust point created successfully');
          fetchPoints();
          handleCloseModal();
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save trust point');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const handleToggleActive = async (point) => {
    try {
      const res = await api.patch(`/trust-points/${point.id}/toggle`);
      if (res.data && res.data.success) {
        setPoints(prev => prev.map(p => p.id === point.id ? { ...p, is_active: p.is_active === 1 ? 0 : 1 } : p));
        setSuccessMessage(res.data.message || 'Status updated');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to toggle point status');
    }
  };

  const handleDelete = async (point) => {
    if (!window.confirm(`Are you sure you want to delete "${point.title}"?`)) return;
    try {
      const res = await api.delete(`/trust-points/${point.id}`);
      if (res.data && res.data.success) {
        setPoints(prev => prev.filter(p => p.id !== point.id));
        setSuccessMessage('Trust point deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete trust point');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const newPoints = [...points];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newPoints.length) return;

    const temp = newPoints[index];
    newPoints[index] = newPoints[targetIndex];
    newPoints[targetIndex] = temp;

    const reordered = newPoints.map((item, idx) => ({
      ...item,
      sort_order: idx + 1
    }));

    setPoints(reordered);

    try {
      await api.patch('/trust-points/reorder', {
        items: reordered.map(item => ({ id: item.id, sort_order: item.sort_order }))
      });
    } catch (err) {
      console.error('Failed to reorder trust points:', err);
      fetchPoints();
    }
  };

  const filteredPoints = points.filter(p =>
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = points.length;
  const activeCount = points.filter(p => p.is_active === 1).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="space-y-6">
      {/* Header Summary Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Trust & Differentiator Cards</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-2xl">
            Manage the value proposition cards displayed in the Home Page Trust section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPoints}
            className="p-3 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-200"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Trust Card</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Cards</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Cards</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inactive Cards</p>
            <p className="text-2xl font-black text-slate-400 mt-1">{inactiveCount}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="text-sm font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search trust cards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600">
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading trust cards...</p>
        </div>
      ) : filteredPoints.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Trust Cards Found</h3>
          <p className="text-slate-500 text-sm mb-4">No cards match your search or none have been added yet.</p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition"
          >
            Add First Card
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Icon</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPoints.map((point, idx) => (
                  <tr key={point.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs text-slate-400 w-5">{point.sort_order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === filteredPoints.length - 1}
                            className="text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                        {renderLucideIcon(point.icon_name, 20)}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                      {point.title}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs max-w-xs leading-relaxed">
                      {point.description}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(point)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          point.is_active === 1
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {point.is_active === 1 ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(point)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          title="Edit Card"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(point)}
                          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Delete Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingPoint ? 'Edit Trust Card' : 'Add New Trust Card'}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Card Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End-to-End Product Development"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Card Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. From idea validation to post-launch growth..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Lucide Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = formData.icon_name.toLowerCase() === item.name.toLowerCase();
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon_name: item.name })}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                        title={item.name}
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Visibility Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value={1}>Active (Visible)</option>
                    <option value={0}>Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingPoint ? 'Save Changes' : 'Create Card'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
