import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Send
} from 'lucide-react';
import {
  FaRocket,
  FaBuilding,
  FaGraduationCap,
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaHeartbeat,
  FaCalendarAlt,
  FaUtensils,
  FaTicketAlt,
  FaBriefcase,
  FaStore
} from 'react-icons/fa';
import api from '../../config/api';
import SEO from '../SEO';
import Faq from '../Faq';

const ICON_MAP = {
  FaRocket,
  FaBuilding,
  FaGraduationCap,
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaHeartbeat,
  FaCalendarAlt,
  FaUtensils,
  FaTicketAlt,
  FaBriefcase,
  FaStore
};

export default function IndustryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndustry = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/industries/${id}`);
        setIndustry(res.data);
      } catch (err) {
        console.error('Error fetching industry details:', err);
        setError('Could not load industry details. The requested sector may not exist or is currently inactive.');
      } finally {
        setLoading(false);
      }
    };

    fetchIndustry();
    window.scrollTo(0, 0);
  }, [id]);

  const renderIcon = (iconName, color = '#2563EB') => {
    const IconComp = ICON_MAP[iconName] || FaRocket;
    return <IconComp size={28} style={{ color }} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium text-sm">Loading industry solutions...</p>
        </div>
      </div>
    );
  }

  if (error || !industry) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex flex-col items-center justify-center px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-lg text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Layers size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Industry Not Found</h2>
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            {error || 'We could not find the industry solution you requested.'}
          </p>
          <button
            onClick={() => navigate('/industries')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-sm transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft size={16} /> Back to All Industries
          </button>
        </div>
      </div>
    );
  }

  const themeColor = industry.color || '#2563EB';
  const featuresList = Array.isArray(industry.features) ? industry.features : [];
  const benefitsList = Array.isArray(industry.benefits) ? industry.benefits : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-24 text-slate-900">
      <SEO
        title={`${industry.title} Digital Solutions | SRJ Global`}
        description={industry.description || industry.subtitle}
        keywords={`${industry.title}, digital transformation, software engineering, SRJ Global, ${featuresList.slice(0, 3).join(', ')}`}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation / Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/industries')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Industries
          </button>

          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Sector ID: <span className="text-slate-700 font-mono">{industry.id}</span>
          </span>
        </div>

        {/* Hero Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-14 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden mb-10"
        >
          {/* Subtle Ambient Background Glow */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none -mr-20 -mt-20"
            style={{ backgroundColor: themeColor }}
          />

          <div className="relative z-10">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {industry.badge && (
                <span
                  className="px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase border shadow-xs"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor,
                    borderColor: `${themeColor}30`
                  }}
                >
                  {industry.badge}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                Enterprise Specialized
              </span>
            </div>

            {/* Title & Icon Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
                  {industry.title}
                </h1>
                <p className="text-lg md:text-xl font-medium text-slate-600 max-w-2xl leading-relaxed">
                  {industry.subtitle}
                </p>
              </div>

              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs"
                style={{
                  backgroundColor: `${themeColor}10`,
                  borderColor: `${themeColor}25`
                }}
              >
                {renderIcon(industry.icon, themeColor)}
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Industry Overview</h2>
              <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-4xl font-normal">
                {industry.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Industry Key Metrics & Stats (if available) */}
        {Array.isArray(industry.stats) && industry.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {industry.stats.map((st, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-center"
              >
                <div className="text-2xl md:text-3xl font-black mb-1" style={{ color: themeColor }}>
                  {st.number || st.value}
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features & Capabilities Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-slate-900" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Core Capabilities & Technical Modules
            </h2>
          </div>

          {featuresList.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 text-slate-400 text-sm">
              Standard digital transformation architectures apply to this sector.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuresList.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-200 transition-all group flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border"
                    style={{
                      backgroundColor: `${themeColor}12`,
                      borderColor: `${themeColor}20`,
                      color: themeColor
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-black">
                      {feature}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Engineered for high performance, compliance, and enterprise resilience.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Strategic Benefits Section */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-emerald-600" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Strategic Business Value & ROI
            </h2>
          </div>

          {benefitsList.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 text-slate-400 text-sm">
              Custom business metrics and ROI models available upon enterprise consultation.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {benefitsList.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-1">
                      {benefit}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Direct operational efficiency boost, risk minimization, and streamlined scale.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Industry Specific FAQs (Renders only when FAQs exist in this category) */}
        <div className="mb-14">
          <Faq 
            category={`Industry - ${industry.title}`} 
            badge={`${industry.title} FAQs`} 
            title="Frequently Asked Questions" 
            subtitle={`Got questions about our ${industry.title} software engineering solutions? Find answers below.`}
          />
        </div>

        {/* Enterprise Call To Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
              Enterprise Consultation
            </span>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
              {industry.cta_title || `Ready to modernize your ${industry.title} operations?`}
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {industry.cta_subtitle || "Connect directly with our industry architects to review blueprints, integration roadmaps, and rapid delivery schedules."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to={industry.cta_button_url || "/contact"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm transition-all cursor-pointer shadow-md"
            >
              <Send size={16} /> {industry.cta_button_text || "Contact Solution Team"}
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all cursor-pointer border border-slate-700"
            >
              Explore Tech Services <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
