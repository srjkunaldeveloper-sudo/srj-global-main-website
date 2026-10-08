import React, { useState } from 'react';
import {
  Sparkles,
  Building,
  Compass,
  Award,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Megaphone,
  Layout,
  ExternalLink,
  Edit,
  ArrowLeft,
  Eye,
  Layers,
  Check
} from 'lucide-react';

import HeroManager from './HeroManager';
import PartnerLogoManager from '../PartnerLogoManager';
import ProcessManager from '../ProcessManager';
import TrustPointsManager from '../TrustPointsManager';
import CompanyStatsManager from '../CompanyStatsManager';
import TestimonialManager from '../testimonials/TestimonialManager';
import FaqManager from '../faqs/FaqManager';
import PromotionManager from '../promotions/PromotionManager';

const SECTIONS = [
  {
    id: 'hero',
    label: 'Hero Section',
    icon: Sparkles,
    color: '#2563EB',
    badge: 'FAST TRACK',
    position: 'Top of Home',
    path: '/home/hero-banner',
    order: 1,
    desc: 'Transform first impressions with rotating dynamic headlines, badges, descriptions, and primary CTA action buttons.',
    feature1: '4 Animated Headlines',
    feature2: 'Live Visual Preview'
  },
  {
    id: 'logos',
    label: 'Partner Logos',
    icon: Building,
    color: '#7C3AED',
    badge: 'ENTERPRISE GRADE',
    position: 'Below Hero',
    path: '/home/marquee-ticker',
    order: 2,
    desc: 'Infinite marquee ticker showcasing trusted client brands, partners, and enterprise affiliations with automated fallbacks.',
    feature1: 'Infinite Logo Ticker',
    feature2: 'Auto CDN Fallback'
  },
  {
    id: 'process',
    label: 'Process & Roadmap',
    icon: Compass,
    color: '#4F46E5',
    badge: 'FUTURE READY',
    position: 'Mid Page',
    path: '/home/process-roadmap',
    order: 3,
    desc: 'Structured 4-step engineering roadmap detailing Discovery, UI/UX Architecture, Cloud Implementation, and Deployment.',
    feature1: '4 Execution Steps',
    feature2: 'Dynamic Icon Picker'
  },
  {
    id: 'trust',
    label: 'Trust Points',
    icon: CheckCircle2,
    color: '#059669',
    badge: 'SECURE & COMPLIANT',
    position: 'Why Us Strip',
    path: '/home/trust-points',
    order: 4,
    desc: 'Enterprise security, SLA compliance, around-the-clock support guarantees, and proprietary credibility highlights.',
    feature1: 'Guaranteed SLAs',
    feature2: 'High Trust Badges'
  },
  {
    id: 'stats',
    label: 'Company Stats',
    icon: Award,
    color: '#EA580C',
    badge: 'REVENUE BOOST',
    position: 'Achievements',
    path: '/home/company-stats',
    order: 5,
    desc: 'Key performance indicators and proof metrics like completed projects, client satisfaction rate, and global team strength.',
    feature1: 'Counter Metrics',
    feature2: 'Animated Digits'
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    color: '#0891B2',
    badge: 'COMMUNITY FIRST',
    position: 'Reviews Section',
    path: '/home/testimonials',
    order: 6,
    desc: 'Client reviews, star ratings, verifiable corporate testimonials, client role designations, and company attributions.',
    feature1: 'Verified Reviews',
    feature2: '5-Star Ratings'
  },
  {
    id: 'faqs',
    label: 'Homepage FAQs',
    icon: HelpCircle,
    color: '#E11D48',
    badge: 'INSTANT ANSWERS',
    position: 'Near Footer',
    path: '/home/faqs-accordion',
    order: 7,
    desc: 'Frequently asked customer questions addressing delivery timelines, technology stacks, pricing, and onboarding workflows.',
    feature1: 'Interactive Q&A',
    feature2: 'General Category'
  },
  {
    id: 'announcements',
    label: 'Announcements & Popup',
    icon: Megaphone,
    color: '#C026D3',
    badge: 'GLOBAL OVERLAY',
    position: 'Modal & Banner',
    path: '/home/launch-promos',
    order: 8,
    desc: 'Time-sensitive product launch banners, event popups, promo discount tickers, and direct call-to-action overlays.',
    feature1: 'Modal Popups',
    feature2: 'Launch Banners'
  }
];

export default function LandingPageManager({ onNotify, initialSection = null }) {
  // If initialSection is passed, open editor directly; otherwise start with overview grid
  const [activeSection, setActiveSection] = useState(initialSection);

  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="space-y-8">
      {/* Top Banner Header with Industries-Style Badge */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 mb-3">
            <Layout size={14} /> Official Homepage Sections CMS
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Landing Page Content Hub
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            All 8 homepage blocks organized section-by-section. Manage headlines, partner tickers, workflow roadmap, trust guarantees, counters, reviews, FAQs, and announcement popups from one unified place.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <ExternalLink size={14} /> Preview Live Homepage
          </a>

          {activeSection && (
            <button
              onClick={() => setActiveSection(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft size={14} /> All 8 Sections Overview
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: ALL 8 SECTIONS OVERVIEW (INDUSTRIES COLORING PATTERN) */}
      {!activeSection ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;

            return (
              <div
                key={sec.id}
                className="group bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_14px_45px_rgba(0,0,0,0.06)] hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar: Colored Icon Box, Title, and Green ACTIVE Pill */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundColor: `${sec.color}15`,
                          borderColor: `${sec.color}35`
                        }}
                      >
                        <Icon size={22} style={{ color: sec.color }} />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 leading-tight">
                          {sec.path}
                        </div>
                        <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {sec.label}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                      ACTIVE
                    </span>
                  </div>

                  {/* Subtitle & Badge with Matching Accent Tint */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${sec.color}12`,
                        color: sec.color,
                        borderColor: `${sec.color}35`
                      }}
                    >
                      {sec.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {sec.position}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                    {sec.desc}
                  </p>

                  {/* Capabilities & ROI Value Style Pills */}
                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium text-[11px]">
                      ⚡ {sec.feature1}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-[11px]">
                      📈 {sec.feature2}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 ml-auto self-center">
                      Order: {sec.order}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setActiveSection(sec.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer group-hover:bg-blue-600"
                  >
                    <Edit size={14} />
                    <span>Edit Section CMS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: ACTIVE SECTION EDITOR WITH TOP COLORFUL SWITCHER */
        <div className="space-y-6">
          {/* Quick Colorful Section Navigation Strip */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-2 overflow-x-auto">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isSelected = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'shadow-xs'
                      : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: `${sec.color}15`,
                          borderColor: `${sec.color}40`,
                          color: sec.color
                        }
                      : {}
                  }
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${sec.color}20`,
                      color: sec.color
                    }}
                  >
                    <Icon size={13} />
                  </div>
                  <span>{sec.label}</span>
                  {isSelected && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold ml-1"
                      style={{
                        backgroundColor: `${sec.color}25`,
                        color: sec.color
                      }}
                    >
                      EDITING
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Section Info Card with Dynamic Color Styling */}
          {currentSectionMeta && (
            <div
              className="bg-white p-5 rounded-3xl border flex items-center justify-between gap-4"
              style={{
                borderColor: `${currentSectionMeta.color}30`,
                boxShadow: `0 8px 30px ${currentSectionMeta.color}08`
              }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${currentSectionMeta.color}15`,
                    borderColor: `${currentSectionMeta.color}35`
                  }}
                >
                  <currentSectionMeta.icon size={22} style={{ color: currentSectionMeta.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      {currentSectionMeta.label}
                    </h3>
                    <span
                      className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${currentSectionMeta.color}12`,
                        color: currentSectionMeta.color,
                        borderColor: `${currentSectionMeta.color}35`
                      }}
                    >
                      {currentSectionMeta.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentSectionMeta.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveSection(null)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200 transition"
              >
                <ArrowLeft size={13} />
                <span>Show All Sections</span>
              </button>
            </div>
          )}

          {/* Render the Active Manager Component */}
          <div className="transition-opacity duration-200">
            {activeSection === 'hero' && <HeroManager onNotify={onNotify} />}
            {activeSection === 'logos' && <PartnerLogoManager />}
            {activeSection === 'process' && <ProcessManager />}
            {activeSection === 'trust' && <TrustPointsManager />}
            {activeSection === 'stats' && <CompanyStatsManager />}
            {activeSection === 'testimonials' && <TestimonialManager onNotify={onNotify} />}
            {activeSection === 'faqs' && <FaqManager onNotify={onNotify} initialCategory="General" />}
            {activeSection === 'announcements' && <PromotionManager onNotify={onNotify} />}
          </div>
        </div>
      )}
    </div>
  );
}
