import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Link as LinkIcon,
  Globe,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../config/api';

export default function PartnerLogoManager() {
  const [logos, setLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    alt_text: '',
    fallback_domain: '',
    sort_order: 0,
    is_active: 1
  });
  const [logoFile, setLogoFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'

  // Fetch partner logos from Admin API
  const fetchLogos = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get('/partner-logos/admin');
      if (res.data && res.data.success && Array.isArray(res.data.logos)) {
        setLogos(res.data.logos);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch partner logos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingLogo(null);
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      alt_text: '',
      fallback_domain: '',
      sort_order: logos.length > 0 ? Math.max(...logos.map(l => l.sort_order || 0)) + 1 : 1,
      is_active: 1
    });
    setLogoFile(null);
    setUploadMode('url');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (logo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name || '',
      logo_url: logo.logo_url || '',
      website_url: logo.website_url || '',
      alt_text: logo.alt_text || '',
      fallback_domain: logo.fallback_domain || '',
      sort_order: logo.sort_order ?? 0,
      is_active: logo.is_active ?? 1
    });
    setLogoFile(null);
    setUploadMode(logo.logo_url && logo.logo_url.includes('/uploads/') ? 'file' : 'url');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLogo(null);
    setLogoFile(null);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('website_url', formData.website_url);
      body.append('alt_text', formData.alt_text);
      body.append('fallback_domain', formData.fallback_domain);
      body.append('sort_order', formData.sort_order);
      body.append('is_active', formData.is_active);

      if (uploadMode === 'file' && logoFile) {
        body.append('logo', logoFile);
      } else {
        body.append('logo_url', formData.logo_url);
      }

      let res;
      if (editingLogo) {
        res = await api.put(`/partner-logos/${editingLogo.id}`, body);
      } else {
        res = await api.post('/partner-logos', body);
      }

      if (res.data && res.data.success) {
        setSuccessMessage(editingLogo ? 'Logo updated successfully' : 'Logo created successfully');
        handleCloseModal();
        fetchLogos();
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save partner logo');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (logo) => {
    try {
      const res = await api.put(`/partner-logos/${logo.id}/toggle`, {
        is_active: logo.is_active === 1 ? 0 : 1
      });
      if (res.data && res.data.success) {
        setLogos(prev =>
          prev.map(l => (l.id === logo.id ? { ...l, is_active: l.is_active === 1 ? 0 : 1 } : l))
        );
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to toggle logo status');
    }
  };

  // Delete Logo
  const handleDelete = async (logo) => {
    if (!window.confirm(`Are you sure you want to delete "${logo.name}"?`)) return;

    try {
      const res = await api.delete(`/partner-logos/${logo.id}`);
      if (res.data && res.data.success) {
        setLogos(prev => prev.filter(l => l.id !== logo.id));
        setSuccessMessage(`Logo "${logo.name}" deleted successfully`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete logo');
    }
  };

  // Quick Sort Order Adjustment
  const handleSortChange = async (logo, delta) => {
    const newSortOrder = Math.max(0, (logo.sort_order || 0) + delta);
    try {
      const body = new FormData();
      body.append('sort_order', newSortOrder);

      const res = await api.put(`/partner-logos/${logo.id}`, body);
      if (res.data && res.data.success) {
        fetchLogos();
      }
    } catch (err) {
      setErrorMessage('Failed to reorder logo');
    }
  };

  // Filter logos
  const filteredLogos = logos.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.fallback_domain && l.fallback_domain.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeCount = logos.filter(l => l.is_active === 1).length;
  const inactiveCount = logos.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Partner Logos / Trusted Brands</h2>
              <p className="text-sm text-slate-500">
                Manage corporate partner logos rendered on Home Marquee and About Page.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogos}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Partner Logo
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
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Brands</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{logos.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Active Logos</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Inactive Logos</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{inactiveCount}</p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search brand name or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Logos Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            Loading partner logos...
          </div>
        ) : filteredLogos.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No partner logos found. Click "Add Partner Logo" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center w-16">Order</th>
                  <th className="px-4 py-3 w-28">Preview</th>
                  <th className="px-4 py-3">Brand Name</th>
                  <th className="px-4 py-3">Domain / URL</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLogos.map((logo) => (
                  <tr key={logo.id} className="hover:bg-slate-50/80 transition">
                    {/* Sort Order Controls */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-slate-700 text-xs bg-slate-100 px-2 py-1 rounded">
                          {logo.sort_order}
                        </span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleSortChange(logo, -1)}
                            className="p-0.5 text-slate-400 hover:text-slate-700"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleSortChange(logo, 1)}
                            className="p-0.5 text-slate-400 hover:text-slate-700"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Logo Image Preview */}
                    <td className="px-4 py-3">
                      <div className="w-20 h-12 bg-slate-100 border border-slate-200 rounded-md p-1.5 flex items-center justify-center overflow-hidden">
                        <img
                          src={logo.logo_url}
                          alt={logo.alt_text || logo.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            if (logo.fallback_domain) {
                              e.target.src = `https://logo.clearbit.com/${logo.fallback_domain}`;
                            } else {
                              e.target.style.display = 'none';
                            }
                          }}
                        />
                      </div>
                    </td>

                    {/* Brand Name & Alt */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{logo.name}</div>
                      <div className="text-xs text-slate-400">Alt: {logo.alt_text || logo.name}</div>
                    </td>

                    {/* Domain & Links */}
                    <td className="px-4 py-3">
                      <div className="text-xs font-mono text-slate-600">
                        {logo.fallback_domain || '—'}
                      </div>
                      {logo.website_url && (
                        <a
                          href={logo.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mt-0.5"
                        >
                          Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>

                    {/* Active/Inactive Toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(logo)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                          logo.is_active === 1
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {logo.is_active === 1 ? (
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
                          onClick={() => handleOpenEditModal(logo)}
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                          title="Edit Logo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(logo)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                          title="Delete Logo"
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
                {editingLogo ? 'Edit Partner Logo' : 'Add New Partner Logo'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Brand Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Brand / Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Adani Group"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Upload Mode Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Logo Source Strategy
                </label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="uploadMode"
                      value="url"
                      checked={uploadMode === 'url'}
                      onChange={() => setUploadMode('url')}
                      className="text-indigo-600"
                    />
                    <span>External URL / Vector SVG</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="uploadMode"
                      value="file"
                      checked={uploadMode === 'file'}
                      onChange={() => setUploadMode('file')}
                      className="text-indigo-600"
                    />
                    <span>Upload Image File</span>
                  </label>
                </div>

                {uploadMode === 'url' ? (
                  <input
                    type="text"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://upload.wikimedia.org/.../logo.svg"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                )}
              </div>

              {/* Alt Text & Fallback Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    placeholder="e.g. Adani Group Logo"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Fallback Domain
                  </label>
                  <input
                    type="text"
                    value={formData.fallback_domain}
                    onChange={(e) => setFormData({ ...formData, fallback_domain: e.target.value })}
                    placeholder="e.g. adani.com"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://adani.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
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
                      <Save className="w-4 h-4" /> Save Logo
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
