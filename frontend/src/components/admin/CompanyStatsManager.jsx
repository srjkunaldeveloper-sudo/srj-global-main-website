import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  Users,
  Shield,
  Clock,
  Sparkles,
  TrendingUp,
  BarChart2,
  Star,
  Target,
  Zap,
  Briefcase,
  Layers,
  Heart,
  Globe,
  Smile
} from 'lucide-react';
import api from '../../config/api';

const AVAILABLE_ICONS = [
  { name: 'CheckCircle', icon: CheckCircle },
  { name: 'Users', icon: Users },
  { name: 'Award', icon: Award },
  { name: 'Shield', icon: Shield },
  { name: 'Clock', icon: Clock },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'BarChart2', icon: BarChart2 },
  { name: 'Star', icon: Star },
  { name: 'Target', icon: Target },
  { name: 'Zap', icon: Zap },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Layers', icon: Layers },
  { name: 'Heart', icon: Heart },
  { name: 'Globe', icon: Globe },
  { name: 'Smile', icon: Smile }
];

export function renderLucideIcon(iconName, size = 18, className = '') {
  const iconObj = AVAILABLE_ICONS.find(i => i.name.toLowerCase() === (iconName || '').toLowerCase());
  const IconComp = iconObj ? iconObj.icon : Award;
  return <IconComp size={size} className={className} />;
}

export default function CompanyStatsManager() {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    metric_key: '',
    target_value: 0,
    prefix: '',
    suffix: '+',
    label: '',
    icon_name: 'Award',
    sort_order: 0,
    is_active: 1
  });

  const fetchStats = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get('/company-stats/admin');
      if (res.data && res.data.success && Array.isArray(res.data.stats)) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch company statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingStat(null);
    setFormData({
      metric_key: '',
      target_value: 0,
      prefix: '',
      suffix: '+',
      label: '',
      icon_name: 'Award',
      sort_order: stats.length + 1,
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (stat) => {
    setEditingStat(stat);
    setFormData({
      metric_key: stat.metric_key || '',
      target_value: stat.target_value !== undefined ? stat.target_value : 0,
      prefix: stat.prefix || '',
      suffix: stat.suffix !== undefined && stat.suffix !== null ? stat.suffix : '+',
      label: stat.label || '',
      icon_name: stat.icon_name || 'Award',
      sort_order: stat.sort_order || 0,
      is_active: stat.is_active === 1 || stat.is_active === true ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStat(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      ...formData,
      target_value: parseInt(formData.target_value, 10) || 0,
      sort_order: parseInt(formData.sort_order, 10) || 0
    };

    try {
      if (editingStat) {
        const res = await api.put(`/company-stats/${editingStat.id}`, payload);
        if (res.data && res.data.success) {
          setSuccessMessage('Metric updated successfully');
          fetchStats();
          handleCloseModal();
        }
      } else {
        const res = await api.post('/company-stats', payload);
        if (res.data && res.data.success) {
          setSuccessMessage('Metric created successfully');
          fetchStats();
          handleCloseModal();
        }
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save metric');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const handleToggleActive = async (stat) => {
    try {
      const res = await api.patch(`/company-stats/${stat.id}/toggle`);
      if (res.data && res.data.success) {
        setStats(prev => prev.map(s => s.id === stat.id ? { ...s, is_active: s.is_active === 1 ? 0 : 1 } : s));
        setSuccessMessage(res.data.message || 'Status updated');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to toggle metric status');
    }
  };

  const handleDelete = async (stat) => {
    if (!window.confirm(`Are you sure you want to delete "${stat.label}"?`)) return;
    try {
      const res = await api.delete(`/company-stats/${stat.id}`);
      if (res.data && res.data.success) {
        setStats(prev => prev.filter(s => s.id !== stat.id));
        setSuccessMessage('Metric deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete metric');
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const newStats = [...stats];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStats.length) return;

    const temp = newStats[index];
    newStats[index] = newStats[targetIndex];
    newStats[targetIndex] = temp;

    const reordered = newStats.map((item, idx) => ({
      ...item,
      sort_order: idx + 1
    }));

    setStats(reordered);

    try {
      await api.patch('/company-stats/reorder', {
        items: reordered.map(item => ({ id: item.id, sort_order: item.sort_order }))
      });
    } catch (err) {
      console.error('Failed to reorder:', err);
      fetchStats();
    }
  };

  const filteredStats = stats.filter(s =>
    (s.label || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.metric_key || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = stats.length;
  const activeCount = stats.filter(s => s.is_active === 1).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="space-y-6">
      {/* Header Summary Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Company Statistics & Achievements</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-2xl">
            Manage key company metrics displayed across the Home and About pages. All changes automatically sync globally.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-3 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-200"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Metric</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Metrics</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Metrics</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Inactive Metrics</p>
            <p className="text-2xl font-black text-slate-400 mt-1">{inactiveCount}</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toast Feedback Messages */}
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
          placeholder="Search by label or metric key..."
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

      {/* Metrics Table / Grid */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading statistics data...</p>
        </div>
      ) : filteredStats.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Statistics Found</h3>
          <p className="text-slate-500 text-sm mb-4">No metrics match your search or none have been added yet.</p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition"
          >
            Add First Metric
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
                  <th className="py-4 px-6">Metric Key</th>
                  <th className="py-4 px-6">Display Value</th>
                  <th className="py-4 px-6">Label</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStats.map((stat, idx) => (
                  <tr key={stat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs text-slate-400 w-5">{stat.sort_order}</span>
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
                            disabled={idx === filteredStats.length - 1}
                            className="text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        {renderLucideIcon(stat.icon_name, 20)}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold">
                        {stat.metric_key}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-bold text-slate-900">
                        {stat.prefix || ''}{Number(stat.target_value).toLocaleString()}{stat.suffix || ''}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {stat.label}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(stat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          stat.is_active === 1
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {stat.is_active === 1 ? (
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
                          onClick={() => handleOpenEditModal(stat)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          title="Edit Metric"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(stat)}
                          className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                          title="Delete Metric"
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

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingStat ? 'Edit Statistic Metric' : 'Add New Statistic Metric'}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Metric Key <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. happy_clients"
                    value={formData.metric_key}
                    onChange={(e) => setFormData({ ...formData, metric_key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Unique, lowercase, underscores only</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Target Value <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.target_value}
                    onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Prefix (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $ or #"
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Suffix (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. + or /7"
                    value={formData.suffix}
                    onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Metric Label <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projects Completed"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
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
                            ? 'bg-blue-600 text-white shadow-md'
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Visibility Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
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
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingStat ? 'Save Changes' : 'Create Metric'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
