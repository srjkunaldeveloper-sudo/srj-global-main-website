import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaCheckCircle,
  FaCalculator,
  FaBolt,
  FaStar,
  FaFire,
  FaGem,
  FaRocket,
  FaShieldAlt,
  FaChevronDown,
  FaArrowRight,
  FaChartLine,
  FaCogs,
  FaHeadset,
  FaRegLightbulb,
  FaGlobe
} from "react-icons/fa";
import {
  Lightbulb, Rocket, Zap, Bot, ShieldCheck, CheckCircle2, Users,
  MessageCircleMore, LayoutDashboard, Server, FilePenLine, Mail,
  SearchCheck, Languages, PlugZap, Headphones, BarChart3, Database,
  Cloud, CalendarDays, UsersRound, Fingerprint, Shield, Receipt
} from "lucide-react";
import "../../styles/Pricing.css";
import { plans, addOns } from "../../config/pricing";
import PricingHero from "./PricingHero";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from 'axios';
import api, { API_BASE_URL } from "../../config/api";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_OPTIONS = [
  { label: "12 Weeks", value: 12, multiplier: 1.0 },
  { label: "8 Weeks", value: 8, multiplier: 1.1 },
  { label: "6 Weeks", value: 6, multiplier: 1.25 },
  { label: "4 Weeks", value: 4, multiplier: 1.5 },
  { label: "2 Weeks", value: 2, multiplier: 2.0 },
];

const INSIGHTS = [
  { icon: Lightbulb, title: "Advanced ROI", desc: "Our Advanced Plan delivers the highest return on investment for growing businesses.", badge: "01" },
  { icon: Rocket, title: "Payment Ready", desc: "Includes secure Payment Gateway integration with a complete Admin Dashboard.", badge: "02" },
  { icon: Zap, title: "Fast Delivery", desc: "Rush delivery available in as little as two weeks for urgent launches.", badge: "03" },
  { icon: Bot, title: "AI Automation", desc: "Add AI chatbot integration to automate customer support and improve response time.", badge: "04" }
];

const PARTNER_POINTS = [
  { icon: ShieldCheck, title: "Transparent Pricing", desc: "No hidden fees, no surprises.", badge: "01" },
  { icon: CheckCircle2, title: "Enterprise Quality", desc: "Code built to scale securely.", badge: "02" },
  { icon: Users, title: "Dedicated Team", desc: "Direct access to senior engineers.", badge: "03" },
  { icon: Rocket, title: "Lifetime Support", desc: "We maintain what we build.", badge: "04" }
];

// FAQ_DATA replaced by API data (/api/faqs?category=Pricing)

const Pricing = () => {
  const navigate = useNavigate();
  const openCalendly = () => {
    window.location.href = "/#contact";
  };
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to Standard
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[1]); // Default 8 weeks
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Pricing FAQs API State
  const [pricingFaqs, setPricingFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [faqsError, setFaqsError] = useState(false);

  useEffect(() => {
    const fetchPricingFaqs = async () => {
      try {
        const res = await api.get('/faqs?category=Pricing');
        if (res.data && res.data.success && Array.isArray(res.data.faqs)) {
          setPricingFaqs(res.data.faqs);
        } else if (Array.isArray(res.data)) {
          setPricingFaqs(res.data);
        } else {
          setPricingFaqs([]);
        }
      } catch (err) {
        console.error('Error fetching Pricing FAQs:', err);
        setFaqsError(true);
        setPricingFaqs([]);
      } finally {
        setFaqsLoading(false);
      }
    };

    fetchPricingFaqs();
  }, []);
  
  // Custom Inquiry Modal State
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // New GSAP Refs for Redesign
  const addonsSectionRef = useRef(null);
  const addonsHeaderRef = useRef(null);
  const addonsCardsRef = useRef([]);
  const timelineSectionRef = useRef(null);
  const timelineLineRef = useRef(null);
  const summarySectionRef = useRef(null);
  const summaryLeftRef = useRef(null);
  const estimateCardRef = useRef(null);
  const ctaBtnRef = useRef(null);

  const insightsRef = useRef(null);
  const insightsHeaderRef = useRef(null);
  const insightsSubtitleRef = useRef(null);
  const insightsCardsRef = useRef([]);

  const partnerRef = useRef(null);
  const partnerHeaderRef = useRef(null);
  const partnerCardsRef = useRef([]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP animation for Pricing Insights & Why Partner Sections & Redesigned Sections
  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // -- REDESIGNED SECTIONS ANIMATIONS -- //
      
      // Add-on Modules Animation
      if (addonsSectionRef.current) {
        gsap.fromTo(addonsHeaderRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: addonsSectionRef.current,
              start: "top 80%",
            }
          }
        );

        gsap.fromTo(".luxury-addon-card", 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power4.out",
            scrollTrigger: {
              trigger: addonsSectionRef.current,
              start: "top 85%",
            }
          }
        );
      }

      // Timeline Animation
      if (timelineSectionRef.current) {
        gsap.fromTo(timelineLineRef.current,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: timelineSectionRef.current,
              start: "top 75%",
            }
          }
        );
      }

      // Summary & Estimate Card Animation
      if (summarySectionRef.current) {
        gsap.fromTo(summaryLeftRef.current,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: summarySectionRef.current,
              start: "top 75%",
            }
          }
        );

        gsap.fromTo(estimateCardRef.current,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: summarySectionRef.current,
              start: "top 75%",
            }
          }
        );
        
        gsap.fromTo(ctaBtnRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: summarySectionRef.current,
              start: "top 75%",
            }
          }
        );
      }

      // 1. Pricing Insights Animation
      if (insightsRef.current) {
        gsap.fromTo(insightsHeaderRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: insightsRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );

        gsap.fromTo(insightsSubtitleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: insightsRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );

        gsap.fromTo(insightsCardsRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            delay: 0.3,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: insightsRef.current,
              start: "top 75%",
              toggleActions: "play none none none"
            }
          }
        );
      }

      // 2. Why Partner Section Animation
      if (partnerRef.current) {
        gsap.fromTo(partnerHeaderRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: partnerRef.current,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );

        gsap.fromTo(partnerCardsRef.current,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            delay: 0.25,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: partnerRef.current,
              start: "top 75%",
              toggleActions: "play none none none"
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Handlers
  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const getAddonIcon = (name) => {
    switch (name) {
      case "Chatbot (Web/App)": return <Bot size={22} strokeWidth={2} />;
      case "WhatsApp Automation": return <MessageCircleMore size={22} strokeWidth={2} />;
      case "Payment Gateway Integration": return <ShieldCheck size={22} strokeWidth={2} />;
      case "Admin Panel": return <LayoutDashboard size={22} strokeWidth={2} />;
      case "Hosting + Domain (1 yr)": return <Server size={22} strokeWidth={2} />;
      case "Content Writing (per page)": return <FilePenLine size={22} strokeWidth={2} />;
      case "Email Setup + SMTP": return <Mail size={22} strokeWidth={2} />;
      case "SEO Optimization & Analytics": return <SearchCheck size={22} strokeWidth={2} />;
      case "Multi-Language Support": return <Languages size={22} strokeWidth={2} />;
      case "Third-party API Integration": return <PlugZap size={22} strokeWidth={2} />;
      case "Mobile App (Basic)": return <LayoutDashboard size={22} strokeWidth={2} />;
      case "Priority Support (1 yr)": return <Headphones size={22} strokeWidth={2} />;
      default: return <PlugZap size={22} strokeWidth={2} />;
    }
  };
  
  // Calculations

  // Calculations
  const basePrice = selectedPlan.price;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const subtotal = basePrice + addonsTotal;
  const finalTotal = subtotal * timeline.multiplier;

  // Animations
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="pricing-page pt-4">
      
      <PricingHero />

      {/* 2. PLAN SELECTION */}
      <section className="relative py-24 px-6 bg-[#fafafa] font-sans flex flex-col items-center">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wLjUgMHY0MCIgc3Ryb2tlPSJyZ2JhKDAsIDAsIDAsIDAuMDMpIi8+PC9zdmc+')] opacity-60 z-0"></div>

        <motion.div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <span className="inline-block px-4 py-1.5 rounded-full border border-slate-200 bg-white text-[10px] font-bold tracking-widest text-slate-800 uppercase shadow-sm mb-6">
            CHOOSE YOUR FOUNDATION
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">
            Select Base Architecture
          </h2>
          <p className="text-slate-500 text-base md:text-lg">
            Choose the foundation of your software project.
          </p>
        </motion.div>
        
        <motion.div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
          {plans.map((plan, idx) => {
            const isStandard = plan.name === "Standard";
            const isPremium = plan.name === "Premium";
            const isSelected = selectedPlan.name === plan.name;
            
            return (
              <motion.div 
                key={plan.name}
                variants={fadeUp}
                className={`relative flex flex-col bg-white rounded-[24px] p-8 cursor-pointer transition-all duration-300 ${
                  isSelected ? 'border-2 border-black shadow-lg scale-105 z-10' : 'border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                {/* Badges */}
                {isStandard && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                
                {isPremium && (
                  <div className="absolute top-6 right-6 border border-slate-200 bg-white text-slate-800 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                    <FaGem size={10} /> Premium
                  </div>
                )}
                
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center bg-slate-50 text-slate-800 mb-6">
                  {idx === 0 ? <Rocket size={20} /> : idx === 1 ? <Shield size={20} /> : idx === 2 ? <Zap size={20} /> : <FaGem size={20} />}
                </div>
                
                {/* Plan Details */}
                <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-black text-black">₹{plan.price.toLocaleString()}</span>
                </div>
                <span className="text-sm font-medium text-slate-400 mb-6">/ project</span>
                
                {/* Divider */}
                <div className="w-full h-px bg-slate-100 mb-6" />
                
                {/* Features */}
                <ul className="flex flex-col gap-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-[13px] font-semibold text-slate-600">
                      <div className="bg-black rounded-full p-0.5 mt-0.5">
                        <CheckCircle2 size={12} className="text-white fill-black" strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Action Button */}
                <button className={`w-full py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-black text-white hover:bg-black/90' 
                    : 'bg-white text-black border border-slate-200 hover:bg-slate-50'
                }`}>
                  {isSelected ? "Selected" : "Choose Plan"}
                  <FaArrowRight size={12} className={isSelected ? "text-white" : "text-slate-400"} />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Bottom Guarantee */}
        <motion.div className="relative z-10 flex justify-center mt-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Shield size={16} className="text-slate-700" />
            All plans include 30 days support and 100% satisfaction guarantee.
          </div>
        </motion.div>
      </section>

      <div style={{ backgroundColor: '#ffffff', color: '#0f172a', paddingBottom: '40px' }}>
      {/* 4. ADD-ON MODULES (REDESIGNED) */}
      <section ref={addonsSectionRef} className="pricing-section luxury-addons-section">
        <div className="luxury-section-bg-gradient"></div>
        <div ref={addonsHeaderRef} className="luxury-section-header">
          <span className="luxury-pill">POWERFUL INTEGRATIONS</span>
          <h2 className="luxury-heading">Add-on Modules</h2>
          <p className="luxury-subtitle">Supercharge your application with these powerful integrations.</p>
        </div>

        <div className="luxury-addon-grid">
          {addOns.map((addon, index) => {
            const isSelected = selectedAddons.some(a => a.name === addon.name);
            return (
              <div 
                key={addon.name} 
                ref={el => addonsCardsRef.current[index] = el}
                className={`luxury-addon-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleAddon(addon)}
              >
                <div className="luxury-addon-left">
                  <div className="luxury-addon-icon-container">
                    {getAddonIcon(addon.name)}
                  </div>
                  <div className="luxury-addon-content">
                    <h4 className="luxury-addon-title">{addon.name}</h4>
                    <p className="luxury-addon-desc">
                      {addon.name === "Chatbot (Web/App)" && "AI-powered customer support"}
                      {addon.name === "WhatsApp Automation" && "Send notifications & alerts"}
                      {addon.name === "Payment Gateway Integration" && "Secure online payments"}
                      {addon.name === "Admin Panel" && "Complete admin dashboard"}
                      {addon.name === "Hosting + Domain (1 yr)" && "Premium hosting & domain"}
                      {addon.name === "Content Writing (per page)" && "SEO-friendly content writing"}
                      {addon.name === "Email Setup + SMTP" && "Professional email setup"}
                      {addon.name === "SEO Optimization & Analytics" && "Boost ranking & track performance"}
                      {addon.name === "Multi-Language Support" && "Add multiple languages"}
                      {addon.name === "Third-party API Integration" && "Custom API integrations"}
                      {addon.name === "Mobile App (Basic)" && "Android/iOS basic app"}
                      {addon.name === "Priority Support (1 yr)" && "Priority assistance & support"}
                      {!["Chatbot (Web/App)", "WhatsApp Automation", "Payment Gateway Integration", "Admin Panel", "Hosting + Domain (1 yr)", "Content Writing (per page)", "Email Setup + SMTP", "SEO Optimization & Analytics", "Multi-Language Support", "Third-party API Integration", "Mobile App (Basic)", "Priority Support (1 yr)"].includes(addon.name) && "Enterprise-grade integration"}
                    </p>
                    <p className="luxury-addon-price">+₹{addon.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="luxury-addon-right">
                  <div className="luxury-toggle">
                    <div className="luxury-toggle-handle"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. DELIVERY TIMELINE & LIVE PRICE SUMMARY (REDESIGNED) */}
      <section ref={summarySectionRef} className="pricing-section luxury-summary-section">
        <div className="luxury-premium-container">
          
          {/* Timeline Section */}
          <div ref={timelineSectionRef} className="luxury-timeline-wrapper">
            <h3 className="luxury-section-title">Delivery Timeline</h3>
            <div className="luxury-timeline-container">
              <div className="luxury-progress-line-bg"></div>
              <div 
                ref={timelineLineRef}
                className="luxury-progress-line-active"
                style={{
                  width: `${(TIMELINE_OPTIONS.findIndex(t => t.value === timeline.value) / (TIMELINE_OPTIONS.length - 1)) * 100}%`
                }}
              ></div>
              <div className="luxury-timeline-nodes">
                {TIMELINE_OPTIONS.map((opt, i) => {
                  const isSelected = timeline.value === opt.value;
                  const isPast = TIMELINE_OPTIONS.findIndex(t => t.value === timeline.value) >= i;
                  return (
                    <div 
                      key={opt.value} 
                      className={`luxury-timeline-node ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                      onClick={() => setTimeline(opt)}
                    >
                      <div className="node-circle"></div>
                      <span className="node-label">{opt.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="luxury-summary-grid">
            {/* Project Summary Left */}
            <div ref={summaryLeftRef} className="luxury-summary-left">
              <h3 className="luxury-section-title">Project Summary</h3>
              <div className="luxury-invoice-list">
                <div className="luxury-invoice-row">
                  <span>Base Plan ({selectedPlan.name})</span>
                  <span className="amount">₹{basePrice.toLocaleString()}</span>
                </div>
                <div className="luxury-invoice-row">
                  <span>Selected Add-on Modules ({selectedAddons.length})</span>
                  <span className="amount">+₹{addonsTotal.toLocaleString()}</span>
                </div>
                {timeline.multiplier > 1.0 && (
                  <div className="luxury-invoice-row rush-delivery">
                    <span>Rush Delivery ({timeline.label})</span>
                    <span className="amount">+₹{((subtotal * timeline.multiplier) - subtotal).toLocaleString()}</span>
                  </div>
                )}
                <div className="luxury-invoice-row total-row">
                  <span>Estimated Total</span>
                  <span className="amount">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {/* Live Estimate Card Right */}
            <div ref={estimateCardRef} className="luxury-estimate-card">
              <div className="luxury-estimate-badge">LIVE ESTIMATE</div>
              <p className="luxury-estimate-label">Your Project Total</p>
              <div className="luxury-final-price">
                ₹{finalTotal.toLocaleString()}
              </div>
              
              <ul className="luxury-features-list">
                <li><FaCheckCircle /> 30 Days Support</li>
                <li><FaCheckCircle /> Secure Payments</li>
                <li><FaCheckCircle /> 100% Satisfaction</li>
              </ul>
              
              <button ref={ctaBtnRef} className="luxury-cta-btn" onClick={() => setShowInquiryModal(true)}>
                <span>Request Official Proposal</span>
                <FaArrowRight className="arrow-icon" />
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* 6. PRICING INSIGHTS */}
      <section ref={insightsRef} className="pricing-insights-section">
        <div ref={insightsHeaderRef} className="insights-header-container">
          <h2>Pricing Insights</h2>
          <p ref={insightsSubtitleRef} className="insights-subtitle">
            Everything included to help your business launch faster, scale confidently, and maximize long-term value.
          </p>
        </div>
        
        <div className="insights-grid-premium">
          {INSIGHTS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx} 
                ref={(el) => (insightsCardsRef.current[idx] = el)} 
                className="premium-insight-card"
              >
                {item.badge && <span className="premium-insight-badge">{item.badge}</span>}
                <div className="premium-insight-icon-wrapper">
                  <IconComponent className="insight-lucide-icon" size={28} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. WHY PARTNER WITH US */}
      <section ref={partnerRef} className="pricing-insights-section">
        <div ref={partnerHeaderRef} className="insights-header-container">
          <h2 style={{ color: '#000000' }}>Why Partner With Us?</h2>
        </div>
        
        <div className="insights-grid-premium">
          {PARTNER_POINTS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx} 
                ref={(el) => (partnerCardsRef.current[idx] = el)} 
                className="premium-insight-card"
              >
                {item.badge && <span className="premium-insight-badge">{item.badge}</span>}
                <div className="premium-insight-icon-wrapper">
                  <IconComponent className="insight-lucide-icon" size={28} />
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FAQ */}
      {!faqsLoading && (pricingFaqs.length === 0 || faqsError) ? null : (
        <section className="pricing-section" style={{ backgroundColor: '#ffffff' }}>
          <motion.div className="section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 style={{ color: '#000000' }}>Frequently Asked Questions</h2>
          </motion.div>
          
          <div className="faq-container">
            {faqsLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="faq-item p-6 animate-pulse space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              ))
            ) : (
              pricingFaqs.map((faq, idx) => {
                const qText = faq.question || faq.q;
                const aText = faq.answer || faq.a;

                return (
                  <div key={faq.id || idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                    <div className="faq-header" style={{ color: '#0f172a', fontWeight: '600' }} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                      {qText}
                      <FaChevronDown className="faq-icon" style={{ color: '#64748b' }} size={16} />
                    </div>
                    <AnimatePresence>
                      {activeFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="faq-body" style={{ color: '#64748b', whitespace: 'pre-line' }}>
                            {aText}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* 9. FINAL CTA */}
      <section className="pricing-section" style={{ textAlign: 'center', padding: '75px 5%', backgroundColor: '#ffffff' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 42px)', fontWeight: '800', marginBottom: '16px', color: '#000000' }}>
            Let's Build Something Amazing
          </h2>
          <p style={{ color: '#475569', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 28px' }}>
            Our experts will help you choose the perfect solution for your business.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="search-btn" style={{ boxShadow: 'none', color: '#ffffff' }} onClick={() => openCalendly()}>
              Request Proposal
            </button>
            <button className="search-btn" style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.2)', boxShadow: 'none', color: '#000000' }} onClick={() => navigate('/services')}>
              Explore Services
            </button>
          </div>
        </motion.div>
      </section>


      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-left space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowInquiryModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-3xl font-light cursor-pointer"
            >
              &times;
            </button>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Request Proposal</h3>
              <p className="text-sm text-slate-400 mt-1">Submit configuration details for {selectedPlan.name} (₹{finalTotal.toLocaleString()}).</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setSubmittingInquiry(true);
              try {
                const requirementsList = [
                  `Selected Addons: ${selectedAddons.map(a => a.name).join(', ') || 'None'}`,
                  `Timeline: ${timeline.label}`,
                  `Total Estimated Price: ₹${finalTotal.toLocaleString()}`
                ].join('\n');

                const response = await axios.post(`${API_BASE_URL}/plans`, {
                  plan_name: selectedPlan.name,
                  full_name: inquiryForm.fullName,
                  email: inquiryForm.email,
                  phone: inquiryForm.phone,
                  company_name: inquiryForm.companyName,
                  project_type: selectedPlan.name,
                  budget: `₹${finalTotal.toLocaleString()}`,
                  requirements: requirementsList
                });

                if (response.data && response.data.success) {
                  alert('Thank you! Your custom proposal request has been saved in our system.');
                  setShowInquiryModal(false);
                  setInquiryForm({ fullName: '', email: '', phone: '', companyName: '' });
                }
              } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Error submitting request. Please try again.');
              } finally {
                setSubmittingInquiry(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text" required value={inquiryForm.fullName}
                  onChange={(e) => setInquiryForm({...inquiryForm, fullName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email" required value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                  placeholder="john@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="tel" required value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                <input
                  type="text" value={inquiryForm.companyName}
                  onChange={(e) => setInquiryForm({...inquiryForm, companyName: e.target.value})}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingInquiry ? 'Submitting Request...' : 'Confirm Request Proposal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
