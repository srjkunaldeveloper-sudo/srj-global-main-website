import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  Lightbulb,
  Palette,
  Code2,
  FlaskConical,
  Send,
  TrendingUp,
  Maximize2,
  Rocket,
  Cpu,
  Shield,
  Zap,
  Database,
  Sparkles
} from 'lucide-react';
import api from '../../config/api';

const AVAILABLE_ICONS = [
  { name: 'Lightbulb', icon: Lightbulb },
  { name: 'Search', icon: Search },
  { name: 'Compass', icon: Compass },
  { name: 'Palette', icon: Palette },
  { name: 'Code2', icon: Code2 },
  { name: 'FlaskConical', icon: FlaskConical },
  { name: 'Send', icon: Send },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Maximize2', icon: Maximize2 },
  { name: 'Rocket', icon: Rocket },
  { name: 'Cpu', icon: Cpu },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Database', icon: Database },
  { name: 'Sparkles', icon: Sparkles }
];

export function renderLucideIcon(iconName, size = 16, className = '') {
  const iconObj = AVAILABLE_ICONS.find(i => i.name.toLowerCase() === (iconName || '').toLowerCase());
  const IconComp = iconObj ? iconObj.icon : Lightbulb;
  return <IconComp size={size} className={className} />;
}

export default function ProcessManager() {
  const [steps, setSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Lightbulb',
    sort_order: 0,
    is_active: 1
  });

  const fetchSteps = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get('/process-steps/admin');
      if (res.data && res.data.success && Array.isArray(res.data.steps)) {
        setSteps(res.data.steps);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch process steps');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingStep(null);
    setFormData({
      title: '',
      description: '',
      icon_name: 'Lightbulb',
      sort_order: steps.length > 0 ? Math.max(...steps.map(s => s.sort_order || 0)) + 1 : 1,
      is_active: 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (step) => {
    setEditingStep(step);
    setFormData({
      title: step.title || '',
      description: step.description || '',
      icon_name: step.icon_name || 'Lightbulb',
      sort_order: step.sort_order ?? 0,
      is_active: step.is_active ?? 1
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStep(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let res;
      if (editingStep) {
        res = await api.put(`/process-steps/${editingStep.id}`, formData);
      } else {
        res = await api.post('/process-steps', formData);
      }

      if (res.data && res.data.success) {
        setSuccessMessage(editingStep ? 'Process step updated successfully' : 'Process step created successfully');
        handleCloseModal();
        fetchSteps();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save process step');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (step) => {
    try {
      const res = await api.put(`/process-steps/${step.id}/toggle`, {
        is_active: step.is_active === 1 ? 0 : 1
      });
      if (res.data && res.data.success) {
        setSteps(prev =>
          prev.map(s => (s.id === step.id ? { ...s, is_active: s.is_active === 1 ? 0 : 1 } : s))
        );
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to toggle step status');
    }
  };

  const handleDelete = async (step) => {
    if (!window.confirm(`Are you sure you want to delete step "${step.title}"?`)) return;

    try {
      const res = await api.delete(`/process-steps/${step.id}`);
      if (res.data && res.data.success) {
        setSteps(prev => prev.filter(s => s.id !== step.id));
        setSuccessMessage(`Process step "${step.title}" deleted successfully`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete process step');
    }
  };

  const handleSortChange = async (step, delta) => {
    const newSortOrder = Math.max(0, (step.sort_order || 0) + delta);
    try {
      const res = await api.put(`/process-steps/${step.id}`, { sort_order: newSortOrder });
      if (res.data && res.data.success) {
        fetchSteps();
      }
    } catch (err) {
      setErrorMessage('Failed to reorder process step');
    }
  };

  const filteredSteps = steps.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = steps.filter(s => s.is_active === 1).length;
  const inactiveCount = steps.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Process & Delivery Roadmap Manager</h2>
              <p className="text-sm text-slate-500">
                Manage Home Page delivery roadmap phases, descriptions, icons, and ordering.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSteps}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Refresh Steps"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Process Step
          </button>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Steps</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{steps.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Active Steps</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Inactive Steps</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{inactiveCount}</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search step title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Steps Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            Loading process steps...
          </div>
        ) : filteredSteps.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No process steps found. Click "Add Process Step" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center w-16">Order</th>
                  <th className="px-4 py-3 w-16 text-center">Step #</th>
                  <th className="px-4 py-3 w-14 text-center">Icon</th>
                  <th className="px-4 py-3">Phase Title</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSteps.map((step, idx) => (
                  <tr key={step.id} className="hover:bg-slate-50/80 transition">
                    {/* Sort Order Controls */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-slate-700 text-xs bg-slate-100 px-2 py-1 rounded">
                          {step.sort_order}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleSortChange(step, -1)}
                            className="p-0.5 text-slate-400 hover:text-slate-700"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleSortChange(step, 1)}
                            className="p-0.5 text-slate-400 hover:text-slate-700"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Step Number Display */}
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">
                      {String(idx + 1).padStart(2, '0')}
                    </td>

                    {/* Icon Preview */}
                    <td className="px-4 py-3 text-center">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mx-auto">
                        {renderLucideIcon(step.icon_name, 16)}
                      </div>
                    </td>

                    {/* Phase Title */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{step.title}</div>
                      <div className="text-xs text-slate-400 font-mono">Icon: {step.icon_name}</div>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 max-w-md">
                      <p className="text-xs text-slate-600 line-clamp-2">{step.description}</p>
                    </td>

                    {/* Active/Inactive Toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(step)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                          step.is_active === 1
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {step.is_active === 1 ? (
                          <>
                            <Eye className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(step)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                          title="Edit Step"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(step)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                          title="Delete Step"
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
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingStep ? 'Edit Process Step' : 'Add New Process Step'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Phase Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Idea, Consultation, Planning"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed explanation of what occurs in this delivery roadmap phase..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Select Lucide Icon
                </label>
                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-lg">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formData.icon_name === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon_name: item.name })}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-600 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <IconComp size={18} />
                        <span className="text-[10px] mt-1 truncate w-full text-center">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort Order & Active Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active === 1}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Active Visible</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Step
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
