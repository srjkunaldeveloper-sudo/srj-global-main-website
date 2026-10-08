import React from 'react';
import {
  Sparkles, FileText, Briefcase, Mail, DollarSign, Handshake,
  MessageSquare, Folder, HelpCircle, Layers, Users, UsersRound,
  Settings, Compass, Building, Award, CheckCircle2, LogOut
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  adminUser = {},
  onLogout
}) {
  const NAV_ITEMS = [
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'contacts', label: 'Contact Inquiries', icon: Mail },
    { id: 'plans', label: 'Pricing & Plans', icon: DollarSign },
    { id: 'collaboration', label: 'Collaboration', icon: Handshake },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'promotions', label: 'Announcements', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'portfolio', label: 'Portfolio', icon: Folder },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'industries', label: 'Industries', icon: Layers },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'subscribers', label: 'Subscribers', icon: UsersRound },
    { id: 'users', label: 'Admin Users', icon: Users },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'navigation', label: 'Navigation Manager', icon: Compass },
    { id: 'partner-logos', label: 'Partner Logos', icon: Building },
    { id: 'process-steps', label: 'Process & Roadmap', icon: Compass },
    { id: 'company-stats', label: 'Company Stats', icon: Award },
    { id: 'trust-points', label: 'Trust Points', icon: CheckCircle2 }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-150 flex flex-col justify-between shrink-0 select-none">
      <div className="p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-slate-900 text-white shadow-xs">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 leading-snug">SRJ Global Technologies</h2>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control Panel</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
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
