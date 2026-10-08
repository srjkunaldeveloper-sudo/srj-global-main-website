import React, { useState } from 'react';
import {
  Sparkles,
  Layout,
  FileText,
  Briefcase,
  Mail,
  DollarSign,
  Handshake,
  MessageSquare,
  Folder,
  HelpCircle,
  Layers,
  Users,
  UsersRound,
  Settings,
  Compass,
  Building,
  Award,
  CheckCircle2,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  adminUser = {},
  onLogout
}) {
  const [isLandingOpen, setIsLandingOpen] = useState(true);

  const LANDING_SUB_ITEMS = [
    { id: 'partner-logos', label: 'Partner Logos', icon: Building },
    { id: 'process-steps', label: 'Process & Roadmap', icon: Compass },
    { id: 'trust-points', label: 'Trust Points', icon: CheckCircle2 },
    { id: 'company-stats', label: 'Company Stats', icon: Award },
    { id: 'promotions', label: 'Announcements', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle }
  ];

  const OTHER_SECTIONS = [
    {
      title: 'Pages & Content',
      items: [
        { id: 'blogs', label: 'Blogs', icon: FileText },
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'portfolio', label: 'Portfolio', icon: Folder },
        { id: 'plans', label: 'Pricing & Plans', icon: DollarSign },
        { id: 'industries', label: 'Industries', icon: Layers },
        { id: 'collaboration', label: 'Collaboration', icon: Handshake },
        { id: 'careers', label: 'Careers', icon: Briefcase },
        { id: 'team', label: 'Team', icon: Users }
      ]
    },
    {
      title: 'Audience & Leads',
      items: [
        { id: 'contacts', label: 'Contact Inquiries', icon: Mail },
        { id: 'subscribers', label: 'Subscribers', icon: UsersRound },
        { id: 'users', label: 'Admin Users', icon: Users }
      ]
    },
    {
      title: 'Settings & System',
      items: [
        { id: 'settings', label: 'Site Settings', icon: Settings },
        { id: 'navigation', label: 'Navigation Manager', icon: Compass }
      ]
    }
  ];

  const isLandingActive =
    activeTab === 'landing-page' || LANDING_SUB_ITEMS.some((item) => item.id === activeTab);

  return (
    <aside className="w-64 bg-white border-r border-slate-150 flex flex-col justify-between shrink-0 select-none">
      <div className="p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 leading-snug">SRJ Global Technologies</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control Panel</span>
          </div>
        </div>

        {/* Section-Wise Navigation List */}
        <nav className="space-y-5">
          {/* 1. HOMEPAGE & LANDING (ACCORDION / DROPDOWN) */}
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pb-1.5 flex items-center justify-between">
              <span>Homepage & Landing</span>
              <div className="h-px bg-slate-100 flex-1 ml-2" />
            </div>

            <div className="space-y-1">
              {/* Landing Page Hub Master Button with Dropdown Chevron */}
              <div
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'landing-page'
                    ? 'bg-slate-900 text-white shadow-md'
                    : isLandingActive
                    ? 'bg-blue-50/70 text-blue-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                onClick={() => {
                  setActiveTab('landing-page');
                  setIsLandingOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <Layout
                    size={16}
                    className={
                      activeTab === 'landing-page'
                        ? 'text-white'
                        : isLandingActive
                        ? 'text-blue-600'
                        : 'text-slate-400'
                    }
                  />
                  <span>Landing Page Hub</span>
                </div>

                {/* Dropdown Toggle Arrow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLandingOpen(!isLandingOpen);
                  }}
                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'landing-page'
                      ? 'hover:bg-white/20 text-white'
                      : 'hover:bg-slate-200/70 text-slate-500'
                  }`}
                  title={isLandingOpen ? 'Hide landing sections' : 'Show landing sections'}
                >
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      isLandingOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>
              </div>

              {/* Collapsible Landing Page Sub-Sections */}
              {isLandingOpen && (
                <div className="pl-3.5 ml-3 border-l-2 border-slate-100 space-y-1 pt-1 pb-1 transition-all">
                  {LANDING_SUB_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. OTHER SECTIONS (PAGES & CMS, AUDIENCE, SETTINGS) */}
          {OTHER_SECTIONS.map((section, idx) => (
            <div key={section.title || idx}>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 pb-1.5 flex items-center justify-between">
                <span>{section.title}</span>
                <div className="h-px bg-slate-100 flex-1 ml-2" />
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-800 truncate">{adminUser?.name || 'Administrator'}</p>
          <p className="text-xs text-slate-400 truncate">{adminUser?.email || 'admin@srjglobal.com'}</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-all cursor-pointer"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
