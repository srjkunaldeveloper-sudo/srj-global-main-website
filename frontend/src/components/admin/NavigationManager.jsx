import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Link,
  Hash,
  Globe,
  ArrowUp,
  ArrowDown,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Layers,
  Folder,
  CornerDownRight,
  Sparkles,
  ExternalLink,
  Shield,
  Database,
  Cloud,
  Cpu,
  PenTool,
  Smartphone,
  Code,
  Rocket,
  HelpCircle,
  Info,
  FileText,
  Mail,
  Share2,
  RotateCcw,
  Check,
  X,
  ListOrdered
} from 'lucide-react';
import api from '../../config/api';

// Safe Lucide Icon Dictionary Mapping
const ICON_MAP = {
  Rocket,
  Code,
  Smartphone,
  PenTool,
  Cpu,
  Cloud,
  Database,
  Shield,
  Globe,
  Link,
  Hash,
  Compass,
  HelpCircle,
  Info,
  FileText,
  Mail,
  Share2,
  ExternalLink,
  Layers,
  Folder
};

const SUGGESTED_ICONS = [
  'Rocket', 'Code', 'Smartphone', 'PenTool', 'Cpu', 'Cloud',
  'Database', 'Shield', 'Globe', 'FileText', 'Mail', 'Share2', 'Compass'
];

function SafeIcon({ name, className = "w-4 h-4" }) {
  if (!name) return <Link className={className} />;
  const IconComp = ICON_MAP[name] || Link;
  return <IconComp className={className} />;
}

export default function NavigationManager() {
  const [items, setItems] = useState([]);
  const [activeGroupTab, setActiveGroupTab] = useState('all'); // 'all', 'header', 'footer_quick', 'footer_legal'
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null for create, object for edit
  const [formData, setFormData] = useState({
    group_location: 'header',
    parent_id: '',
    label: '',
    url: '',
    item_type: 'route',
    target: '_self',
    icon_name: '',
    description: '',
    sort_order: 0,
    is_active: 1
  });
  const [formError, setFormError] = useState(null);

  // Delete Confirmation Modal State
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all navigation items for admin
  const fetchNavigation = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.get('/navigation/admin');
      if (res.data && res.data.success && Array.isArray(res.data.navigation)) {
        setItems(res.data.navigation);
      } else if (res.data && Array.isArray(res.data.data)) {
        setItems(res.data.data);
      } else {
        setErrorMessage('Failed to parse navigation data from server.');
      }
    } catch (err) {
      console.error('Error fetching navigation items:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to load navigation items. Please check backend connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  // Compute eligible top-level header parents
  const eligibleParents = useMemo(() => {
    return items.filter((item) => {
      // Must belong to header
      if (item.group_location !== 'header') return false;
      // Must be top-level (parent_id is null)
      if (item.parent_id !== null) return false;
      // If editing an existing item, cannot be itself
      if (editingItem && item.id === editingItem.id) return false;
      return true;
    });
  }, [items, editingItem]);

  // Compute child count map to identify parents with children
  const parentChildCountMap = useMemo(() => {
    const map = {};
    items.forEach((item) => {
      if (item.parent_id) {
        map[item.parent_id] = (map[item.parent_id] || 0) + 1;
      }
    });
    return map;
  }, [items]);

  // Group items by group_location & parent_id hierarchy
  const structuredData = useMemo(() => {
    const headerTopLevel = items.filter((i) => i.group_location === 'header' && !i.parent_id);
    const headerChildrenMap = {};
    items.filter((i) => i.group_location === 'header' && i.parent_id).forEach((child) => {
      if (!headerChildrenMap[child.parent_id]) {
        headerChildrenMap[child.parent_id] = [];
      }
      headerChildrenMap[child.parent_id].push(child);
    });

    const footerQuick = items.filter((i) => i.group_location === 'footer_quick');
    const footerLegal = items.filter((i) => i.group_location === 'footer_legal');

    return {
      headerTopLevel,
      headerChildrenMap,
      footerQuick,
      footerLegal
    };
  }, [items]);

  // Open Create Modal
  const handleOpenCreateModal = (defaultGroup = 'header', defaultParentId = '') => {
    setEditingItem(null);
    setFormData({
      group_location: defaultGroup,
      parent_id: defaultParentId ? String(defaultParentId) : '',
      label: '',
      url: '',
      item_type: 'route',
      target: '_self',
      icon_name: '',
      description: '',
      sort_order: 0,
      is_active: 1
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      group_location: item.group_location || 'header',
      parent_id: item.parent_id ? String(item.parent_id) : '',
      label: item.label || '',
      url: item.url || '',
      item_type: item.item_type || 'route',
      target: item.target || '_self',
      icon_name: item.icon_name || '',
      description: item.description || '',
      sort_order: item.sort_order !== undefined ? item.sort_order : 0,
      is_active: item.is_active === 1 || item.is_active === true ? 1 : 0
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Form Submit (Create / Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Client-side Validation
    if (!formData.label.trim()) {
      setFormError('Label is required.');
      return;
    }
    if (formData.label.trim().length > 100) {
      setFormError('Label must be at most 100 characters.');
      return;
    }
    if (!formData.url.trim()) {
      setFormError('URL is required.');
      return;
    }
    if (formData.url.trim().length > 255) {
      setFormError('URL must be at most 255 characters.');
      return;
    }

    const payload = {
      group_location: formData.group_location,
      parent_id: formData.group_location === 'header' && formData.parent_id ? parseInt(formData.parent_id, 10) : null,
      label: formData.label.trim(),
      url: formData.url.trim(),
      item_type: formData.item_type,
      target: formData.target,
      icon_name: formData.icon_name.trim() || null,
      description: formData.description.trim() || null,
      sort_order: parseInt(formData.sort_order, 10) || 0,
      is_active: parseInt(formData.is_active, 10) === 1 ? 1 : 0
    };

    setIsSaving(true);

    try {
      if (editingItem) {
        // PUT update
        const res = await api.put(`/navigation/${editingItem.id}`, payload);
        if (res.data && res.data.success) {
          setSuccessMessage(`Navigation item '${payload.label}' updated successfully!`);
          setTimeout(() => setSuccessMessage(null), 4000);
          setIsModalOpen(false);
          fetchNavigation();
        } else {
          setFormError(res.data?.message || 'Failed to update navigation item.');
        }
      } else {
        // POST create
        const res = await api.post('/navigation', payload);
        if (res.data && res.data.success) {
          setSuccessMessage(`Navigation item '${payload.label}' created successfully!`);
          setTimeout(() => setSuccessMessage(null), 4000);
          setIsModalOpen(false);
          fetchNavigation();
        } else {
          setFormError(res.data?.message || 'Failed to create navigation item.');
        }
      }
    } catch (err) {
      console.error('Form submit error:', err);
      setFormError(
        err.response?.data?.message || 'Server error occurred while saving navigation item.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Item Active Status
  const handleToggleStatus = async (item) => {
    setTogglingId(item.id);
    const newStatus = item.is_active === 1 ? 0 : 1;
    try {
      const res = await api.patch(`/navigation/${item.id}/toggle`, { is_active: newStatus });
      if (res.data && res.data.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_active: newStatus } : i))
        );
        setSuccessMessage(`'${item.label}' ${newStatus === 1 ? 'activated' : 'deactivated'}.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      setErrorMessage(
        err.response?.data?.message || `Failed to toggle status for '${item.label}'.`
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Delete Item Handler
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const res = await api.delete(`/navigation/${deletingItem.id}`);
      if (res.data && res.data.success) {
        setSuccessMessage(`Navigation item '${deletingItem.label}' deleted successfully.`);
        setTimeout(() => setSuccessMessage(null), 4000);
        setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
        setDeletingItem(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMessage(
        err.response?.data?.message || `Failed to delete '${deletingItem.label}'.`
      );
      setDeletingItem(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Reorder helper: Move item up or down within its sibling array
  const handleMoveOrder = async (siblingList, index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === siblingList.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedList = [...siblingList];
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[targetIndex];
    reorderedList[targetIndex] = temp;

    // Recalculate sort_order sequentially (e.g. 10, 20, 30...)
    const updatePayload = reorderedList.map((item, idx) => ({
      id: item.id,
      sort_order: (idx + 1) * 10
    }));

    setIsReordering(true);
    try {
      const res = await api.patch('/navigation/reorder', { items: updatePayload });
      if (res.data && res.data.success) {
        setSuccessMessage('Navigation ordering updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchNavigation();
      }
    } catch (err) {
      console.error('Reorder error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to update reorder sequence.'
      );
    } finally {
      setIsReordering(false);
    }
  };

  // Render individual navigation card/row
  const renderItemCard = (item, isChild = false, parentLabel = '', siblingList = [], index = 0) => {
    const hasChildren = parentChildCountMap[item.id] > 0;
    const isToggling = togglingId === item.id;

    return (
      <div
        key={item.id}
        className={`bg-white rounded-2xl border transition-all ${
          isChild
            ? 'border-slate-100 bg-slate-50/40 ml-4 md:ml-8 border-l-4 border-l-blue-500'
            : 'border-slate-200 shadow-sm hover:border-slate-300'
        } p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div className="flex items-start md:items-center gap-3 min-w-0">
          {/* Visual Indicator Icon */}
          <div
            className={`p-2.5 rounded-xl flex-shrink-0 flex items-center justify-center ${
              item.is_active === 1
                ? isChild
                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                  : 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            <SafeIcon name={item.icon_name} className="w-4 h-4" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {isChild && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                  <CornerDownRight size={10} /> Submenu of {parentLabel}
                </span>
              )}
              <h4 className={`text-sm font-extrabold truncate ${item.is_active === 1 ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                {item.label}
              </h4>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase border border-slate-200">
                {item.item_type || 'route'}
              </span>
              {item.target === '_blank' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                  <ExternalLink size={10} /> _blank
                </span>
              )}
              {hasChildren && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {parentChildCountMap[item.id]} child item(s)
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-mono truncate max-w-md">
              {item.url}
            </p>

            {item.description && (
              <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Right side actions & controls */}
        <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
          {/* Order Sort Badge */}
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
            Order: {item.sort_order}
          </span>

          {/* Move Up / Move Down Reorder Controls */}
          {siblingList.length > 1 && (
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
              <button
                onClick={() => handleMoveOrder(siblingList, index, 'up')}
                disabled={index === 0 || isReordering}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 disabled:text-slate-300 hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
                title="Move Up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                onClick={() => handleMoveOrder(siblingList, index, 'down')}
                disabled={index === siblingList.length - 1 || isReordering}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 disabled:text-slate-300 hover:bg-white transition cursor-pointer disabled:cursor-not-allowed"
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>
            </div>
          )}

          {/* Active Status Toggle Button */}
          <button
            onClick={() => handleToggleStatus(item)}
            disabled={isToggling}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
              item.is_active === 1
                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500'
            }`}
          >
            {isToggling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : item.is_active === 1 ? (
              <>
                <Eye size={13} /> Active
              </>
            ) : (
              <>
                <EyeOff size={13} /> Inactive
              </>
            )}
          </button>

          {/* Add Child Submenu Action (Header Parents only) */}
          {item.group_location === 'header' && !item.parent_id && (
            <button
              onClick={() => handleOpenCreateModal('header', item.id)}
              className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              title={`Add Submenu Item to ${item.label}`}
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Add Submenu</span>
            </button>
          )}

          {/* Edit Action */}
          <button
            onClick={() => handleOpenEditModal(item)}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Edit Navigation Item"
          >
            <Edit size={14} />
          </button>

          {/* Delete Action */}
          <button
            onClick={() => setDeletingItem(item)}
            className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition cursor-pointer"
            title="Delete Navigation Item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-2/3"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-20"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error Failure State
  if (errorMessage && items.length === 0) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-red-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-extrabold text-slate-900">Failed to Load Navigation Items</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">{errorMessage}</p>
        <button
          onClick={fetchNavigation}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-md"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Main Action Bar */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-sm">
              <Compass size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Navigation Manager</h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Manage public website header links, submenus, footer quick links, legal navigation, active states, and display order.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateModal('header')}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md self-start md:self-auto"
        >
          <Plus size={16} />
          Add Navigation Item
        </button>
      </div>

      {/* Global Toast / Alert Banners */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-900 font-bold text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/60 no-scrollbar">
        <button
          onClick={() => setActiveGroupTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeGroupTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Items ({items.length})
        </button>
        <button
          onClick={() => setActiveGroupTab('header')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeGroupTab === 'header'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers size={14} />
          Header Navigation ({structuredData.headerTopLevel.length} parents, {items.filter(i => i.group_location === 'header' && i.parent_id).length} submenus)
        </button>
        <button
          onClick={() => setActiveGroupTab('footer_quick')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeGroupTab === 'footer_quick'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Link size={14} />
          Footer Quick Links ({structuredData.footerQuick.length})
        </button>
        <button
          onClick={() => setActiveGroupTab('footer_legal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeGroupTab === 'footer_legal'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Shield size={14} />
          Footer Legal Links ({structuredData.footerLegal.length})
        </button>
      </div>

      {/* Content Rendering Sections */}
      <div className="space-y-8">
        {/* HEADER NAVIGATION SECTION */}
        {(activeGroupTab === 'all' || activeGroupTab === 'header') && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Header Navigation</h2>
                  <p className="text-xs text-slate-500">Top-level navbar items and nested 2-level submenus.</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenCreateModal('header')}
                className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus size={14} />
                Add Header Item
              </button>
            </div>

            {structuredData.headerTopLevel.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold">
                No header navigation items found. Click 'Add Header Item' to create one.
              </div>
            ) : (
              <div className="space-y-4">
                {structuredData.headerTopLevel.map((parent, pIdx) => {
                  const children = structuredData.headerChildrenMap[parent.id] || [];

                  return (
                    <div key={parent.id} className="space-y-3">
                      {/* Render Parent Item */}
                      {renderItemCard(parent, false, '', structuredData.headerTopLevel, pIdx)}

                      {/* Render Children Submenu Items under Parent */}
                      {children.length > 0 && (
                        <div className="space-y-2 pl-2 md:pl-4 border-l-2 border-slate-200/80 my-2">
                          {children.map((child, cIdx) =>
                            renderItemCard(child, true, parent.label, children, cIdx)
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* FOOTER QUICK LINKS SECTION */}
        {(activeGroupTab === 'all' || activeGroupTab === 'footer_quick') && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Link size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Footer Quick Links</h2>
                  <p className="text-xs text-slate-500">Links rendered under the Quick Links column in website footer.</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenCreateModal('footer_quick')}
                className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 border border-amber-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus size={14} />
                Add Quick Link
              </button>
            </div>

            {structuredData.footerQuick.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold">
                No footer quick links found.
              </div>
            ) : (
              <div className="space-y-3">
                {structuredData.footerQuick.map((item, idx) =>
                  renderItemCard(item, false, '', structuredData.footerQuick, idx)
                )}
              </div>
            )}
          </div>
        )}

        {/* FOOTER LEGAL LINKS SECTION */}
        {(activeGroupTab === 'all' || activeGroupTab === 'footer_legal') && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">Footer Legal Links</h2>
                  <p className="text-xs text-slate-500">Policy and terms links rendered at the bottom of the footer.</p>
                </div>
              </div>

              <button
                onClick={() => handleOpenCreateModal('footer_legal')}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus size={14} />
                Add Legal Link
              </button>
            </div>

            {structuredData.footerLegal.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold">
                No footer legal links found.
              </div>
            ) : (
              <div className="space-y-3">
                {structuredData.footerLegal.map((item, idx) =>
                  renderItemCard(item, false, '', structuredData.footerLegal, idx)
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT ITEM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {editingItem ? 'Edit Navigation Item' : 'Create Navigation Item'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingItem ? `Updating #${editingItem.id} (${editingItem.label})` : 'Add a new header or footer link.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Error Banner */}
            {formError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* Edit Hierarchy Constraints Warning */}
            {editingItem && parentChildCountMap[editingItem.id] > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <Info size={16} className="text-amber-600 flex-shrink-0" />
                  Parent Item Restriction
                </div>
                <p>
                  This item has active child submenus. It must remain a top-level Header item and cannot be assigned a parent or moved to footer.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Group Location Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Group / Location <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.group_location}
                  disabled={editingItem && parentChildCountMap[editingItem.id] > 0}
                  onChange={(e) => {
                    const newLoc = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      group_location: newLoc,
                      // Clear parent_id if moving to footer
                      parent_id: newLoc === 'header' ? prev.parent_id : ''
                    }));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="header">Header Navigation</option>
                  <option value="footer_quick">Footer Quick Links</option>
                  <option value="footer_legal">Footer Legal Links</option>
                </select>
              </div>

              {/* Parent Selector (Header Only) */}
              {formData.group_location === 'header' && (
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Parent Item (Submenu Nested Level)
                  </label>
                  <select
                    value={formData.parent_id}
                    disabled={editingItem && parentChildCountMap[editingItem.id] > 0}
                    onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">None (Top-Level Header Item)</option>
                    {eligibleParents.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        Nested under: {parent.label} (#{parent.id})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Select a parent item to make this a 2nd-level submenu item. Maximum 2 levels supported.
                  </p>
                </div>
              )}

              {/* Label */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Navigation Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Services, Game Development, Privacy Policy"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition"
                  maxLength={100}
                  required
                />
              </div>

              {/* Item Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Item Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.item_type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, item_type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition cursor-pointer"
                  >
                    <option value="route">route (Internal relative path starting with /)</option>
                    <option value="hash">hash (Path containing # anchor)</option>
                    <option value="external">external (Absolute URL starting with http/https/mailto/tel)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Target Frame <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData((prev) => ({ ...prev, target: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition cursor-pointer"
                  >
                    <option value="_self">_self (Same window)</option>
                    <option value="_blank">_blank (New tab)</option>
                  </select>
                </div>
              </div>

              {/* URL Field with Helper Guidance */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  URL / Target Path <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder={
                    formData.item_type === 'route'
                      ? '/services or /about'
                      : formData.item_type === 'hash'
                      ? '/services#game-development or #contact'
                      : 'https://example.com'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-mono font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition"
                  maxLength={255}
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {formData.item_type === 'route' && 'Route URLs must start with "/" (e.g. /services, /blogs).'}
                  {formData.item_type === 'hash' && 'Hash URLs must contain "#" (e.g. /services#game-development).'}
                  {formData.item_type === 'external' && 'External URLs must start with http://, https://, mailto:, or tel:.'}
                </p>
              </div>

              {/* Icon Name Field & Suggestions */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Icon Name</span>
                  {formData.icon_name && (
                    <span className="flex items-center gap-1 text-[11px] font-normal text-slate-500">
                      Preview: <SafeIcon name={formData.icon_name} className="w-3.5 h-3.5 text-slate-900" />
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.icon_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon_name: e.target.value }))}
                  placeholder="e.g. Rocket, Code, Smartphone, Shield"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition"
                  maxLength={50}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 mr-1 self-center">Suggestions:</span>
                  {SUGGESTED_ICONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, icon_name: iconName }))}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border flex items-center gap-1 transition cursor-pointer ${
                        formData.icon_name === iconName
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <SafeIcon name={iconName} className="w-3 h-3" />
                      {iconName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Submenu Description / Tooltip (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description shown in mega-menus or tooltips..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-medium focus:outline-none focus:border-slate-900 focus:bg-white transition"
                  maxLength={255}
                />
              </div>

              {/* Sort Order & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Sort Order Priority
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.sort_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Status State
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: parseInt(e.target.value, 10) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition cursor-pointer"
                  >
                    <option value={1}>Active (Visible on Website)</option>
                    <option value={0}>Inactive (Hidden from Website)</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Saving Item...
                    </>
                  ) : (
                    <>
                      <Check size={15} />
                      {editingItem ? 'Update Navigation Item' : 'Create Navigation Item'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={28} />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Delete Navigation Item?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900">'{deletingItem.label}'</strong> (#{deletingItem.id})?
              </p>
              {parentChildCountMap[deletingItem.id] > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-semibold text-left flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <span>
                    This item currently has {parentChildCountMap[deletingItem.id]} child submenu item(s). The backend API will reject deletion until child items are reassigned or deleted.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md disabled:bg-red-300"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
