import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
  Sparkles 
} from 'lucide-react';

import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import '../styles/Careers.css';

const Careers = () => {
  const containerRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [dbJobs, setDbJobs] = useState([]);
  
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
      alert("Please fill all fields.");
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
      alert("Application submitted successfully! Our team will get back to you.");
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

  const displayJobs = dbJobs;

  const categories = ['All', 'Engineering', 'Product & Design', 'Operations', 'Marketing', 'Customer Experience'];

  const filteredJobs = displayJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
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

  return (
    <div className="careers-page" ref={containerRef}>
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
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0f172a" }}></span>
            Careers
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
              {words.slice(4).map((word, idx) => {
                const isSJRGlobal = word === "SRJ" || word === "Global";
                return (
                  <span
                    key={idx}
                    className="careers-hero-word inline-block mr-3 opacity-0 select-none"
                    style={isSJRGlobal ? { textDecoration: "none", textDecorationColor: "#cbd5e1" } : {}}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          </h1>

          <p className="left-fade-rest opacity-0">Join SRJ Global Technologies and help shape the next generation of scalable software solutions and IT innovations.</p>
          
          <div className="careers-hero-btns left-fade-rest opacity-0">
            <button 
              className="careers-btn careers-btn-primary"
              onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Open Positions <ArrowRight size={20} />
            </button>
            <button 
              className="careers-btn careers-btn-secondary"
              onClick={() => handleApplyClick("General Application")}
            >
              Join Our Team
            </button>
          </div>
        </div>
      </section>

      {/* 2. LIFE AT SRJ GLOBAL */}
      <section className="careers-section" style={{ borderTop: "1px solid #f1f5f9" }}>
        <div className="careers-section-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Life at SRJ Global
          </div>
          <h2>Life at SRJ Global Technologies</h2>
        </div>

        <div className="life-grid">
          {[
            { icon: <Star size={32} />, title: 'Join', desc: 'Become part of a mission-driven software agency.' },
            { icon: <Book size={32} />, title: 'Learn', desc: 'Access mentorship and tech skill development.' },
            { icon: <Target size={32} />, title: 'Grow', desc: 'Take ownership of highly impactful client projects.' },
            { icon: <TrendingUp size={32} />, title: 'Lead', desc: 'Build leadership capabilities and career advancement.' }
          ].map((item, i) => (
            <motion.div 
              className="life-card" 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="life-number">0{i+1}</div>
              <div className="life-icon-wrap">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. OPEN POSITIONS */}
      <section className="careers-section positions-section" id="open-positions">
        <div className="careers-section-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Open Positions
          </div>
          <h2>Join the Team</h2>
          <p style={{ marginTop: '16px' }}>Find your role and make an impact.</p>
        </div>

        <div className="positions-controls">
          <div className="search-bar">
            <Search size={20} color="#64748b" />
            <input 
              type="text" 
              placeholder="Search roles or skills..." 
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
              className="job-card" 
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
            >
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className="job-salary-badge">{job.salary}</span>
              </div>
              
              <div className="job-details">
                <div className="job-detail-item"><MapPin size={16} /> {job.location}</div>
                <div className="job-detail-item"><Clock size={16} /> {job.type}</div>
                <div className="job-detail-item"><Briefcase size={16} /> {job.experience}</div>
              </div>

              <div className="job-tags">
                {job.tags.map((tag, j) => (
                  <span key={j} className="job-tag">{tag}</span>
                ))}
              </div>

              <button 
                className="job-apply-btn"
                onClick={() => handleApplyClick(job.title)}
              >
                Apply Now <ArrowRight size={18} />
              </button>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center col-span-full py-16 px-4 bg-slate-50/50 rounded-3xl border border-slate-100" style={{ gridColumn: '1 / -1' }}>
              <div className="w-16 h-16 bg-white border border-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">No Current Openings, Future Opportunities Await.</h3>
              <p className="text-slate-500 text-center max-w-md text-sm">
                We don't have any open roles matching your search right now, but we are always looking for great talent. Feel free to submit a general application!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. HIRING PROCESS */}
      <section className="careers-section timeline-section">
        <div className="careers-section-header flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Process
          </div>
          <h2>Hiring Process</h2>
          <p style={{ marginTop: '16px' }}>A transparent and straightforward journey.</p>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>
          {[
            { title: 'Application Submission', desc: 'Submit your application with resume and portfolio.' },
            { title: 'Resume Review', desc: 'Our team reviews your profile and experience.' },
            { title: 'Technical / Skill Assessment', desc: 'Demonstrate your skills through a practical assessment.' },
            { title: 'Interview Process', desc: 'In-depth discussions with the team and leadership.' },
            { title: 'Offer & Onboarding', desc: 'Receive your offer and begin your journey with us.' }
          ].map((step, i) => (
            <motion.div 
              className="timeline-step" 
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              onViewportEnter={(e) => e?.target?.classList.add('active')}
            >
              <div className="timeline-circle">{i + 1}</div>
              <div className="timeline-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. DIVERSITY */}
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
          <p>We believe that diverse teams build better products. SRJ Global Technologies is committed to creating an inclusive, equitable workplace.</p>
          <div className="diversity-pills">
            <div className="diversity-pill">Inclusive Culture</div>
            <div className="diversity-pill">Equal Opportunities</div>
            <div className="diversity-pill">Diverse Teams</div>
            <div className="diversity-pill">Respectful Workplace</div>
          </div>
        </motion.div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="careers-cta">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready To Drive The Future?</h2>
          <p>Join SRJ Global Technologies and help build the future of software development, digital transformation, and modern technology.</p>
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
                Apply Now
              </button>
          </div>
        </motion.div>
      </section>

      {/* Modern Job Application Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
          fontFamily: "'Geist Sans', 'Inter', sans-serif"
        }}>
          <div style={{
            background: "#ffffff",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            borderRadius: "24px",
            width: "90%",
            maxWidth: "460px",
            padding: "36px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.05)",
            position: "relative"
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(0, 0, 0, 0.03)",
                border: "none",
                color: "#64748b",
                fontSize: "18px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ×
            </button>
            
            <h3 style={{ margin: "0 0 6px 0", color: "#0f172a", fontSize: "20px", fontWeight: "700" }}>Apply for Role</h3>
            <p style={{ margin: "0 0 24px 0", color: "#0f172a", fontWeight: "600", fontSize: "14px" }}>
              {selectedJob}
            </p>

            <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>Full Name</label>
                <input 
                  type="text" 
                  required
                  value={applyForm.fullName}
                  onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", color: "#0f172a", outline: "none", fontSize: "14px" }} 
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  value={applyForm.email}
                  onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", color: "#0f172a", outline: "none", fontSize: "14px" }} 
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={applyForm.phone}
                  onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", color: "#0f172a", outline: "none", fontSize: "14px" }} 
                />
              </div>
              <div>
                <label style={{ display: "block", color: "#64748b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>Message & Resume Link</label>
                <textarea 
                  required
                  rows="3"
                  value={applyForm.message}
                  onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                  style={{ width: "100%", padding: "12px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", color: "#0f172a", outline: "none", resize: "none", fontSize: "14px", fontFamily: "inherit" }}
                  placeholder="Share a short bio or insert a link to your resume..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={applyLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#0f172a",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "8px",
                  fontSize: "14px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)"
                }}
              >
                {applyLoading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
