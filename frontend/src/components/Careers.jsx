import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Search, 
  Star, 
  Book, 
  Target, 
  TrendingUp, 
  Sparkles,
  Laptop,
  Heart,
  Award,
  Zap,
  Coffee,
  Shield,
  CheckCircle2,
  X,
  FileText,
  ChevronRight,
  Check
} from 'lucide-react';

import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import '../styles/Careers.css';
import Faq from './Faq';
import SEO from './SEO';

export default function Careers() {
  const containerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [dbJobs, setDbJobs] = useState([]);
  
  // Job Details Modal state
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);

  // Application Modal state
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [applyLoading, setApplyLoading] = useState(false);

  const handleApplyClick = (jobTitle) => {
    setSelectedJob(jobTitle);
    setShowModal(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyForm.fullName || !applyForm.email || !applyForm.phone || !applyForm.message) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      setApplyLoading(true);
      await axios.post(`${API_BASE_URL}/jobs/apply`, {
        job_title: selectedJob || "General Application",
        full_name: applyForm.fullName,
        email: applyForm.email,
        phone: applyForm.phone,
        message: applyForm.message
      });
      alert("Application submitted successfully! Our talent acquisition team will review your profile and reach out.");
      setShowModal(false);
      setApplyForm({ fullName: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplyLoading(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/jobs`);
        if (Array.isArray(res.data)) {
          setDbJobs(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch jobs from API:", err);
      }
    };
    fetchJobs();
  }, []);

  const standardCategories = ['Engineering', 'Product & Design', 'Operations', 'Marketing', 'Customer Experience'];
  const allCategoriesFromJobs = dbJobs.map(job => job.category).filter(Boolean);
  const uniqueCategories = Array.from(new Set([...standardCategories, ...allCategoriesFromJobs]));
  const categories = ['All', ...uniqueCategories];

  const filteredJobs = dbJobs.filter(job => {
    const matchesSearch = 
      (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (job.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = activeCategory === 'All' || job.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const headingText = "Build The Future with SRJ Global Technologies";
  const words = headingText.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.left-fade-badge',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo('.careers-hero-word',
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.12 },
        '-=0.3'
      )
      .fromTo('.left-fade-rest',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Perks & Benefits Data
  const companyPerks = [
    {
      icon: <Laptop size={26} className="text-blue-600" />,
      title: "Remote-First Flexibility",
      desc: "Work from where you're most creative. Enjoy flexible core hours, async team collaboration, and home-office equipment allowances."
    },
    {
      icon: <Award size={26} className="text-indigo-600" />,
      title: "Learning & Certification Budget",
      desc: "Annual personal education stipend for AWS/GCP certifications, deep-tech books, and global engineering conferences."
    },
    {
      icon: <Heart size={26} className="text-rose-600" />,
      title: "Comprehensive Health & Wellness",
      desc: "100% employer-covered medical insurance for you and your family, accompanied by paid wellness days and mental health support."
    },
    {
      icon: <Zap size={26} className="text-amber-600" />,
      title: "Elite Hardware & Tech Stack",
      desc: "Top-tier Apple M-series MacBook Pro or custom high-spec workstation of your choice plus top developer productivity tooling."
    },
    {
      icon: <TrendingUp size={26} className="text-emerald-600" />,
      title: "Performance Rewards & Growth",
      desc: "Transparent bi-annual merit bonuses, fast-track engineering promotions, and competitive long-term reward structures."
    },
    {
      icon: <Sparkles size={26} className="text-purple-600" />,
      title: "High-Impact Enterprise Projects",
      desc: "Solve mission-critical architectural challenges for global fintech, AI, enterprise SaaS, and cutting-edge gaming platforms."
    }
  ];

  // Upgraded Hiring Roadmap Data
  const hiringSteps = [
    {
      step: "01",
      turnaround: "Within 48h",
      title: "Application Review",
      desc: "Our technical recruiters review your resume, GitHub projects, and past architectural impact."
    },
    {
      step: "02",
      turnaround: "30 Mins",
      title: "Introductory Discovery",
      desc: "A casual conversation to discuss your career aspirations, company values, and mutual culture fit."
    },
    {
      step: "03",
      turnaround: "45-60 Mins",
      title: "Technical Architecture Deep-Dive",
      desc: "Engage with senior engineers discussing system design, modular patterns, and real-world scalability."
    },
    {
      step: "04",
      turnaround: "Practical Exercise",
      title: "Hands-on Practical Challenge",
      desc: "Solve a relevant engineering problem matching our production stack. No algorithmic trivia puzzles."
    },
    {
      step: "05",
      turnaround: "Fast Decision",
      title: "Transparent Offer & Onboarding",
      desc: "Comprehensive offer discussion with clear compensation breakdown, followed by a warm, structured onboarding."
    }
  ];

  return (
    <div className="careers-page" ref={containerRef}>
      <SEO 
        pageKey="careers"
        title="Careers & Job Opportunities"
        description="Explore exciting engineering and design career opportunities at SRJ Global Technologies. Build cutting-edge technology and scale with a world-class team."
        keywords="tech jobs, software engineer careers, developer hiring, SRJ Global careers, remote IT jobs, cloud developer jobs"
        url="https://srjglobaltechnology.com/careers"
      />

      {/* 1. HERO SECTION */}
      <section className="careers-hero relative overflow-hidden">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none z-0" />
        
        {/* Ambient Glows */}
        <div style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.05)",
          filter: "blur(180px)",
          top: "-100px",
          left: "-100px",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(139, 92, 246, 0.04)",
          filter: "blur(180px)",
          bottom: "-100px",
          right: "10%",
          pointerEvents: "none",
        }} />

        <div className="careers-hero-content relative z-10">
          <div
            className="left-fade-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-6 w-fit shadow-xs opacity-0"
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#0f172a",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb" }}></span>
            We're Hiring • Global Careers
          </div>

          <h1>
            <span style={{ display: "block" }}>
              {words.slice(0, 3).map((word, idx) => (
                <span key={idx} className="careers-hero-word inline-block mr-3 opacity-0 select-none">{word}</span>
              ))}
            </span>
            <span style={{ display: "block", marginTop: "4px" }}>
              {words.slice(3, 4).map((word, idx) => (
                <span key={idx} className="careers-hero-word inline-block mr-3 opacity-0 select-none">{word}</span>
              ))}
            </span>
            <span style={{ display: "block", marginTop: "4px" }}>
              {words.slice(4).map((word, idx) => (
                <span key={idx} className="careers-hero-word inline-block mr-3 opacity-0 select-none">
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <p className="left-fade-rest opacity-0">
            Join SRJ Global Technologies to design, build, and deploy high-performance software systems that power tomorrow's leading digital enterprises.
          </p>
          
          <div className="careers-hero-btns left-fade-rest opacity-0">
            <button 
              className="careers-btn careers-btn-primary"
              onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore {dbJobs.length} Open Positions <ArrowRight size={20} />
            </button>
            <button 
              className="careers-btn careers-btn-secondary"
              onClick={() => handleApplyClick("General Application")}
            >
              Submit General Application
            </button>
          </div>
        </div>
      </section>

      {/* 2. LIFE AT SRJ GLOBAL */}
      <section className="careers-section" style={{ borderTop: "1px solid #f1f5f9" }}>
        <div className="careers-section-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Our Culture
          </div>
          <h2>Life at SRJ Global Technologies</h2>
          <p style={{ marginTop: '12px' }}>An environment where curiosity, engineering autonomy, and high standards thrive.</p>
        </div>

        <div className="life-grid">
          {[
            { icon: <Star size={32} />, title: 'Join', desc: 'Become part of a collaborative, mission-driven software engineering firm.' },
            { icon: <Book size={32} />, title: 'Learn', desc: 'Accelerate your career with dedicated mentorship, tech summits, and pair programming.' },
            { icon: <Target size={32} />, title: 'Grow', desc: 'Take true technical ownership of complex architectures and distributed systems.' },
            { icon: <TrendingUp size={32} />, title: 'Lead', desc: 'Advance into senior technical leadership and define best practices.' }
          ].map((item, i) => (
            <motion.div 
              className="life-card" 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="life-number">0{i+1}</div>
              <div className="life-icon-wrap">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DEDICATED PERKS & BENEFITS SECTION */}
      <section className="careers-section bg-slate-50/50" style={{ borderTop: "1px solid #f1f5f9" }}>
        <div className="careers-section-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider mb-4 border border-blue-100">
            Perks & Benefits
          </div>
          <h2>Why You'll Love Working Here</h2>
          <p style={{ marginTop: '12px' }}>
            We provide our teams with the resources, flexibility, and rewards necessary to do the best work of their careers.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyPerks.map((perk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white p-7 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-blue-100 transition-all flex flex-col group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center mb-5 transition-colors">
                {perk.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {perk.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {perk.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. OPEN POSITIONS SECTION */}
      <section className="careers-section positions-section" id="open-positions">
        <div className="careers-section-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Current Openings
          </div>
          <h2>Join Our Engineering & Product Team</h2>
          <p style={{ marginTop: '16px' }}>
            Explore opportunities across engineering, product design, and cloud architecture.
          </p>
        </div>

        <div className="positions-controls">
          <div className="search-bar">
            <Search size={20} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search roles, skills, or tech stacks (e.g., React, Node, AI, Flutter)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-chips">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="jobs-grid">
          {filteredJobs.length > 0 ? filteredJobs.map((job, i) => (
            <motion.div 
              className="job-card cursor-pointer" 
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
              onClick={() => setSelectedJobDetail(job)}
            >
              <div className="job-card-header">
                <div>
                  {job.category && (
                    <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mb-2 uppercase tracking-wider">
                      {job.category}
                    </span>
                  )}
                  <h3 className="hover:text-blue-600 transition-colors">{job.title}</h3>
                </div>
                <span className="job-salary-badge">{job.salary}</span>
              </div>
              
              <div className="job-details">
                <div className="job-detail-item"><MapPin size={15} /> {job.location}</div>
                <div className="job-detail-item"><Clock size={15} /> {job.type}</div>
                <div className="job-detail-item"><Briefcase size={15} /> {job.experience}</div>
              </div>

              {job.description && (
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {job.description}
                </p>
              )}

              <div className="job-tags">
                {Array.isArray(job.tags) && job.tags.map((tag, j) => (
                  <span key={j} className="job-tag">{tag}</span>
                ))}
              </div>

              {/* Action Buttons: View Details & Apply */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => setSelectedJobDetail(job)}
                >
                  <span>Role Specs</span>
                  <ChevronRight size={14} />
                </button>
                <button 
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={() => handleApplyClick(job.title)}
                >
                  <span>Apply Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center col-span-full py-16 px-4 bg-slate-50/50 rounded-3xl border border-slate-100" style={{ gridColumn: '1 / -1' }}>
              <div className="w-16 h-16 bg-white border border-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">No Roles Matching Your Search</h3>
              <p className="text-slate-500 text-center max-w-md text-sm mb-6">
                We're constantly expanding. If you don't see an exact opening, submit a general application and we'll keep your profile on file.
              </p>
              <button
                onClick={() => handleApplyClick("General Application")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-md transition"
              >
                Submit General Application
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. HIRING PROCESS ROADMAP */}
      <section className="careers-section timeline-section">
        <div className="careers-section-header flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Our Roadmap
          </div>
          <h2>Our Transparent Hiring Process</h2>
          <p style={{ marginTop: '16px' }}>
            We respect your time. Here is what to expect from initial application to offer letter.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {hiringSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                  {step.step}
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  {step.turnaround}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. DIVERSITY & VALUES */}
      <section className="careers-section diversity-section">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="diversity-icon">
            <Sparkles size={40} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Diversity & Inclusion
          </div>
          <h2>Different Perspectives. One Mission.</h2>
          <p>We believe that diverse engineering teams build better digital products. SRJ Global Technologies is committed to creating an inclusive, empowering workplace for all.</p>
          <div className="diversity-pills">
            <div className="diversity-pill">Equal Opportunity Employer</div>
            <div className="diversity-pill">Zero Hierarchy In Code Reviews</div>
            <div className="diversity-pill">Inclusive Global Culture</div>
            <div className="diversity-pill">Continuous Recognition</div>
          </div>
        </motion.div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="careers-cta">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready To Build The Future With Us?</h2>
          <p>Explore our open positions or reach out directly to learn how your talents align with our technology roadmap.</p>
          <div className="careers-cta-btns">
             <button 
               className="careers-btn careers-btn-primary"
               onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })}
             >
               View Open Roles
             </button>
             <button 
                className="careers-btn careers-btn-secondary"
                onClick={() => handleApplyClick("General Application")}
              >
                Submit Resume
              </button>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <Faq 
        category="Careers"
        badge="Careers FAQs"
        title="Careers & Recruitment FAQs"
        subtitle="Frequently asked questions about interviewing, life at SRJ Global, and engineering perks."
      />

      {/* Detailed Role Specifications Modal */}
      {selectedJobDetail && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedJobDetail(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl max-h-[88vh] rounded-3xl overflow-y-auto p-6 sm:p-9 shadow-2xl border border-slate-100 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedJobDetail(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                {selectedJobDetail.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                {selectedJobDetail.salary}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {selectedJobDetail.title}
            </h3>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500 font-medium pb-5 border-b border-slate-100 mb-6">
              <span>📍 {selectedJobDetail.location}</span>
              <span>•</span>
              <span>⏰ {selectedJobDetail.type}</span>
              <span>•</span>
              <span>💼 {selectedJobDetail.experience}</span>
            </div>

            {selectedJobDetail.description && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Role Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedJobDetail.description}
                </p>
              </div>
            )}

            {Array.isArray(selectedJobDetail.responsibilities) && selectedJobDetail.responsibilities.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Key Responsibilities
                </h4>
                <ul className="space-y-2.5">
                  {selectedJobDetail.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex-shrink-0 mt-0.5">
                        •
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(selectedJobDetail.requirements) && selectedJobDetail.requirements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Qualifications & Skills
                </h4>
                <ul className="space-y-2.5">
                  {selectedJobDetail.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(selectedJobDetail.perks) && selectedJobDetail.perks.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Role Specific Benefits
                </h4>
                <ul className="space-y-2">
                  {selectedJobDetail.perks.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="text-indigo-600 font-bold">★</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Ready to take the next step?
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedJobDetail(null)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedJobDetail.title;
                    setSelectedJobDetail(null);
                    handleApplyClick(title);
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Apply for this Role</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modern Job Application Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}
        onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  Job Application
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {selectedJob || "General Application"}
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={applyForm.fullName}
                  onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input 
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={applyForm.phone}
                    onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Resume / Portfolio Link & Message *
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Paste your LinkedIn, GitHub, or Google Drive resume link along with a brief note on why you'd like to join SRJ Global..."
                  value={applyForm.message}
                  onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed resize-none"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={applyLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {applyLoading ? "Submitting Application..." : "Submit Application"}
                  {!applyLoading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
