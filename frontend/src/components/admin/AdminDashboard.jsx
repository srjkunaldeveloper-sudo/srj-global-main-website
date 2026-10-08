import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import ToastAlert from './shared/ToastAlert';

// Domain Managers
import LandingPageManager from './landing/LandingPageManager';
import BlogManager from './blogs/BlogManager';
import ServiceManager from './services/ServiceManager';
import ContactManager from './contacts/ContactManager';
import PricingPlanManager from './pricing/PricingPlanManager';
import CollaborationManager from './collaboration/CollaborationManager';
import CareerManager from './careers/CareerManager';
import PromotionManager from './promotions/PromotionManager';
import TestimonialManager from './testimonials/TestimonialManager';
import PortfolioManager from './portfolio/PortfolioManager';
import FaqManager from './faqs/FaqManager';
import IndustryManager from './industries/IndustryManager';
import TeamManager from './team/TeamManager';
import SubscriberManager from './subscribers/SubscriberManager';

// Standalone Config Managers
import AdminUserManager from './AdminUserManager';
import SiteSettingsManager from './SiteSettingsManager';
import NavigationManager from './NavigationManager';
import PartnerLogoManager from './PartnerLogoManager';
import ProcessManager from './ProcessManager';
import CompanyStatsManager from './CompanyStatsManager';
import TrustPointsManager from './TrustPointsManager';
import FooterManager from './footer/FooterManager';
import LegalPoliciesManager from './legal/LegalPoliciesManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [notification, setNotification] = useState(null);
  const [targetFaqCategory, setTargetFaqCategory] = useState(null);

  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{"name": "Administrator"}');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleJumpToFaq = (categoryName) => {
    setTargetFaqCategory(categoryName);
    setActiveTab('faqs');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* Reusable Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'faqs') {
            setTargetFaqCategory(null);
          }
        }}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <ToastAlert notification={notification} />

        {/* Section Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
            {activeTab === 'landing-page'
              ? 'Landing Page Content Hub'
              : activeTab === 'partner-logos'
              ? 'Partner Logos'
              : activeTab === 'process-steps'
              ? 'Process & Roadmap'
              : activeTab === 'company-stats'
              ? 'Company Stats'
              : activeTab === 'trust-points'
              ? 'Trust Points'
              : activeTab === 'plans'
              ? 'Pricing & Plans'
              : activeTab === 'promotions'
              ? 'Announcements & Promo'
              : activeTab === 'footer'
              ? 'Footer & Socials Manager'
              : activeTab === 'legal-pages'
              ? 'Legal & Compliance Policies'
              : `${activeTab} Management`}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {activeTab === 'landing-page'
              ? 'Configure and manage all visual sections across the homepage.'
              : 'Add, update, or remove live entries from your database.'}
          </p>
        </div>

        {/* Dynamic Domain Tab Modules */}
        <div className="space-y-10">
          {activeTab === 'landing-page' && <LandingPageManager onNotify={showNotification} />}
          {activeTab === 'blogs' && <BlogManager onNotify={showNotification} />}
          {activeTab === 'services' && <ServiceManager onNotify={showNotification} />}
          {activeTab === 'contacts' && <ContactManager onNotify={showNotification} />}
          {activeTab === 'plans' && <PricingPlanManager onNotify={showNotification} />}
          {activeTab === 'collaboration' && <CollaborationManager onNotify={showNotification} />}
          {activeTab === 'careers' && <CareerManager onNotify={showNotification} />}
          {activeTab === 'promotions' && <PromotionManager onNotify={showNotification} />}
          {activeTab === 'testimonials' && <TestimonialManager onNotify={showNotification} />}
          {activeTab === 'portfolio' && <PortfolioManager onNotify={showNotification} />}
          {activeTab === 'faqs' && (
            <FaqManager onNotify={showNotification} initialCategory={targetFaqCategory} />
          )}
          {activeTab === 'industries' && (
            <IndustryManager onNotify={showNotification} onJumpToFaq={handleJumpToFaq} />
          )}
          {activeTab === 'team' && <TeamManager onNotify={showNotification} />}
          {activeTab === 'subscribers' && <SubscriberManager onNotify={showNotification} />}
          {activeTab === 'legal-pages' && <LegalPoliciesManager onNotify={showNotification} />}

          {/* Standalone System Settings & Integrations */}
          {activeTab === 'footer' && <FooterManager onNotify={showNotification} />}
          {activeTab === 'users' && <AdminUserManager onNotify={showNotification} />}
          {activeTab === 'settings' && <SiteSettingsManager onNotify={showNotification} />}
          {activeTab === 'navigation' && <NavigationManager onNotify={showNotification} />}
          {activeTab === 'partner-logos' && <PartnerLogoManager onNotify={showNotification} />}
          {activeTab === 'process-steps' && <ProcessManager onNotify={showNotification} />}
          {activeTab === 'company-stats' && <CompanyStatsManager onNotify={showNotification} />}
          {activeTab === 'trust-points' && <TrustPointsManager onNotify={showNotification} />}
        </div>
      </main>
    </div>
  );
}
