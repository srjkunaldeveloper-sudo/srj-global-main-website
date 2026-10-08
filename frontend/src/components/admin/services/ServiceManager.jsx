import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Gamepad2,
  FileText,
  ExternalLink,
  Plus
} from 'lucide-react';
import api from '../../../config/api';
import ToastAlert from '../shared/ToastAlert';
import HomeCapabilitiesView from './HomeCapabilitiesView';
import ServiceDirectoryView from './ServiceDirectoryView';
import ServicesPageHeaderEditor from './ServicesPageHeaderEditor';
import GameDevelopmentManager from './GameDevelopmentManager';
import ServiceModal from './ServiceModal';

const INITIAL_SERVICE_STATE = {
  title: '',
  icon: 'Lightbulb',
  image: '',
  short_description: '',
  full_description: '',
  category_id: '',
  price: '',
  is_home: false,
  tags: '',
  sort_order: 0
};

export default function ServiceManager({ onNotify }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Active Main Tab: 'catalog' | 'page-content' | 'game-dev' | 'home-pillars'
  const [serviceViewMode, setServiceViewMode] = useState('catalog');
  const [activeServiceTab, setActiveServiceTab] = useState('all');

  const [homeServicesSettings, setHomeServicesSettings] = useState({
    badge: 'CAPABILITIES',
    title: 'Premium Engineering Services',
    subtitle: 'We deliver state-of-the-art technological solutions built to drive growth and efficiency.'
  });
  const [savingHomeSettings, setSavingHomeSettings] = useState(false);

  const [newService, setNewService] = useState(INITIAL_SERVICE_STATE);
  const [editServiceId, setEditServiceId] = useState(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  const showNotification = (type, message) => {
    if (onNotify) {
      onNotify(type, message);
    } else {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const fetchServicesData = async () => {
    try {
      setLoading(true);
      const [servicesRes, settingsRes] = await Promise.all([
        api.get('/services'),
        api.get('/settings').catch(() => ({ data: {} }))
      ]);

      setServices(servicesRes.data.services || servicesRes.data || []);
      if (settingsRes.data) {
        setHomeServicesSettings({
          badge: settingsRes.data.home_services_badge || 'CAPABILITIES',
          title: settingsRes.data.home_services_title || 'Premium Engineering Services',
          subtitle:
            settingsRes.data.home_services_subtitle ||
            'We deliver state-of-the-art technological solutions built to drive growth and efficiency.'
        });
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      showNotification('error', 'Failed to load services data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  const handleSaveHomeServicesSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingHomeSettings(true);
    try {
      await api.put('/settings/bulk', {
        settings: {
          home_services_badge: homeServicesSettings.badge.trim(),
          home_services_title: homeServicesSettings.title.trim(),
          home_services_subtitle: homeServicesSettings.subtitle.trim()
        }
      });
      showNotification('success', 'Homepage Capabilities header updated successfully!');
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update homepage settings');
    } finally {
      setSavingHomeSettings(false);
    }
  };

  const handleToggleHomeService = async (service) => {
    try {
      const newStatus = service.is_home ? 0 : 1;
      await api.put(`/services/${service.id}`, { is_home: newStatus });
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_home: Boolean(newStatus) } : s))
      );
      showNotification(
        'success',
        service.is_home ? `Removed "${service.title}" from Home Page` : `Added "${service.title}" to Home Page`
      );
    } catch (err) {
      showNotification('error', 'Failed to toggle home visibility');
    }
  };

  const handleCreateOrUpdateService = async (e) => {
    if (e) e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newService).forEach((key) => {
        if (newService[key] !== null && newService[key] !== undefined && newService[key] !== '') {
          formData.append(key, newService[key]);
        }
      });

      if (editServiceId) {
        await api.put(`/services/${editServiceId}`, formData);
        showNotification('success', 'Service updated successfully!');
      } else {
        await api.post('/services', formData);
        showNotification('success', 'Service created successfully!');
      }

      setNewService(INITIAL_SERVICE_STATE);
      setEditServiceId(null);
      setIsEditServiceModalOpen(false);
      fetchServicesData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEditService = (service) => {
    setNewService({
      title: service.title || '',
      icon: service.icon || '',
      image: service.image || '',
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      category_id: service.category_id || '',
      price: service.price || '',
      is_home: Boolean(service.is_home),
      tags: Array.isArray(service.tags) ? service.tags.join(', ') : (service.tags || ''),
      sort_order: service.sort_order || 0
    });
    setEditServiceId(service.id);
    setIsEditServiceModalOpen(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      showNotification('success', 'Service deleted successfully!');
      fetchServicesData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleOpenAddHomeCard = () => {
    const homeCount = services.filter((s) => s.is_home).length;
    setNewService({
      ...INITIAL_SERVICE_STATE,
      is_home: true,
      sort_order: homeCount + 1
    });
    setEditServiceId(null);
    setIsEditServiceModalOpen(true);
  };

  const VIEW_TABS = [
    {
      id: 'catalog',
      label: 'All Services Catalog',
      icon: Layers,
      color: '#2563EB',
      badge: `${services.length} Services`
    },
    {
      id: 'page-content',
      label: 'Services Page Content',
      icon: FileText,
      color: '#7C3AED',
      badge: 'Hero & Intro CMS'
    },
    {
      id: 'game-dev',
      label: 'Game Development',
      icon: Gamepad2,
      color: '#EA580C',
      badge: '16 Games'
    },
    {
      id: 'home-pillars',
      label: 'Homepage Capabilities',
      icon: Sparkles,
      color: '#059669',
      badge: `${services.filter((s) => s.is_home).length} Home Pillars`
    }
  ];

  return (
    <div className="space-y-6">
      <ToastAlert notification={notification} />

      {/* Top Banner Header with Industries Pattern */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
            <Layers size={14} /> Official Engineering & Services CMS
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Services & Capabilities Manager
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            Manage your complete technical services catalog across 8 categories, customize the <code>/services</code> landing page hero & intro, inspect the 16 game development solutions, and control homepage capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <a
            href="/services"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <ExternalLink size={14} /> View /services Page
          </a>
          <button
            onClick={() => {
              setNewService(INITIAL_SERVICE_STATE);
              setEditServiceId(null);
              setIsEditServiceModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} /> New Service
          </button>
        </div>
      </div>

      {/* Industries-Style Section Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {VIEW_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = serviceViewMode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setServiceViewMode(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : `${tab.color}15`,
                  color: isActive ? '#FFFFFF' : tab.color
                }}
              >
                <Icon size={14} />
              </div>
              <span>{tab.label}</span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wider"
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${tab.color}12`,
                  color: isActive ? '#FFFFFF' : tab.color
                }}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ALL SERVICES CATALOG */}
      {serviceViewMode === 'catalog' && (
        <ServiceDirectoryView
          services={services}
          activeServiceTab={activeServiceTab}
          setActiveServiceTab={setActiveServiceTab}
          newService={newService}
          setNewService={setNewService}
          onCreateService={handleCreateOrUpdateService}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
        />
      )}

      {/* TAB 2: SERVICES PAGE HERO & INTRO CONTENT */}
      {serviceViewMode === 'page-content' && (
        <ServicesPageHeaderEditor onNotify={showNotification} />
      )}

      {/* TAB 3: GAME DEVELOPMENT SHOWCASE */}
      {serviceViewMode === 'game-dev' && <GameDevelopmentManager />}

      {/* TAB 4: HOMEPAGE CAPABILITIES PILLARS */}
      {serviceViewMode === 'home-pillars' && (
        <HomeCapabilitiesView
          homeServicesSettings={homeServicesSettings}
          setHomeServicesSettings={setHomeServicesSettings}
          savingHomeSettings={savingHomeSettings}
          onSaveHomeServicesSettings={handleSaveHomeServicesSettings}
          services={services}
          onOpenAddHomeCard={handleOpenAddHomeCard}
          onToggleHomeService={handleToggleHomeService}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
        />
      )}

      {/* Edit Service Modal */}
      <ServiceModal
        isOpen={isEditServiceModalOpen}
        editServiceId={editServiceId}
        newService={newService}
        setNewService={setNewService}
        onSubmit={handleCreateOrUpdateService}
        onClose={() => {
          setIsEditServiceModalOpen(false);
          setEditServiceId(null);
          setNewService(INITIAL_SERVICE_STATE);
        }}
      />
    </div>
  );
}
