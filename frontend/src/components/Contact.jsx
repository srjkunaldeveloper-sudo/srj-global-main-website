import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../config/api';
import SEO from './SEO';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    budget: '₹10k - ₹25k',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setStatusType(null);
    
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (nameParts[0] || 'User');

    setLoading(true);

    try {
      const response = await api.post('/contact', {
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company ? formData.company.trim() : '',
        service: formData.projectType,
        budget: formData.budget,
        message: formData.message.trim()
      });

      if (response.data && response.data.success) {
        setStatusType('success');
        setStatusMessage("Your inquiry has been submitted successfully. We'll get back to you soon.");
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          projectType: '',
          budget: '₹10k - ₹25k',
          message: ''
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatusType('error');
      setStatusMessage(err.response?.data?.message || 'Unable to submit your inquiry right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const projectTypes = ['Web Development', 'Mobile Apps', 'AI Solutions', 'Cloud Services', 'UI/UX Design', 'DevOps'];
  const budgets = ['₹10k - ₹25k', '₹25k - ₹50k', '₹50k - ₹100k', '₹100k+'];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-24 bg-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      <SEO 
        title="Contact Us"
        description="Get in touch with SRJ Global Technologies to discuss your next big project or software development needs."
        keywords="contact SRJ Global Technologies, hire developers, IT consultation"
        url="https://srjglobaltechnology.com/contact"
      />
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 lg:mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className="text-2xl sm:text-4xl text-fluid-2xl font-extrabold text-primary-text tracking-tight mb-4">
            Get In Touch
          </h2>
          <p className="text-secondary-text text-fluid-base">
            Have any questions or scoping requirements? Submit specifications directly to our desk, and our team will get back to you within 24 hours.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
          }}
        >
          {/* Contact Form */}
          <motion.form 
            variants={fadeUp}
            onSubmit={handleSubmit} 
            className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
          >
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-primary-text uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200 min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-primary-text uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200 min-h-[44px]"
                />
              </div>
            </div>

            {/* Row 2: Company & Phone (Replaced Service Required) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-xs font-bold text-primary-text uppercase tracking-wider mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200 min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-primary-text uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200 min-h-[44px]"
                />
              </div>
            </div>

            {/* Service Required (Moved above budget) */}
            <div>
              <label htmlFor="projectType" className="block text-xs font-bold text-primary-text uppercase tracking-wider mb-2">
                Service Required
              </label>
              <div className="relative">
                <select
                  id="projectType"
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200 appearance-none cursor-pointer text-slate-800 min-h-[44px]"
                >
                  <option value="" disabled hidden>Select Service</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Estimated Budget */}
            <div>
              <label className="block text-xs font-bold text-primary-text uppercase tracking-wider mb-3">
                Estimated Budget
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {budgets.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, budget: b })}
                    className={`py-3 px-2 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 min-h-[44px] flex items-center justify-center ${
                      formData.budget === b
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white text-secondary-text hover:border-slate-350'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div>
              <label htmlFor="message" className="block text-xs font-bold text-primary-text uppercase tracking-wider mb-2">
                Project Details
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your goals, tech stack preferences, and constraints..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all duration-200 resize-none"
              />
            </div>

            {statusMessage && (
              <div 
                role="status"
                aria-live="polite"
                className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  statusType === 'success' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {statusType === 'success' ? <CheckCircle2 size={16} className="shrink-0" /> : <AlertCircle size={16} className="shrink-0" />}
                <span>{statusMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold transition-all duration-200 hover:shadow-lg min-h-[48px] ${
                loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
              {!loading && <Send size={16} />}
            </button>
          </motion.form>

          {/* Contact Details & Map */}
          <motion.div 
            variants={fadeUp}
            className="lg:col-span-5 space-y-8 sm:space-y-10"
          >
            <div>
              <h3 className="text-xl font-bold text-primary-text mb-6">Contact Information</h3>
              <div className="space-y-6">
                <a href="mailto:srjglobaltechnology@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-black group-hover:border-slate-800 transition-colors duration-200 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EMAIL US</div>
                    <div className="text-sm font-semibold text-primary-text group-hover:text-black transition-colors duration-200 break-all">srjglobaltechnology@gmail.com</div>
                  </div>
                </a>

                <a href="tel:+919990430305" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-black group-hover:border-slate-800 transition-colors duration-200 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CALL US</div>
                    <div className="text-sm font-semibold text-primary-text group-hover:text-black transition-colors duration-200">+91 99904 30305</div>
                  </div>
                </a>

                <a 
                  href="https://maps.google.com/?q=Urbtech+Trade+Center+Tower+Noida+Sector+132" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-black group-hover:border-slate-800 transition-colors duration-200 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Office Location</div>
                    <div className="text-sm font-semibold text-primary-text group-hover:text-black transition-colors duration-200">
                      C-1101, Urbtech Trade Center Tower,<br />Noida Sector-132, Uttar Pradesh 201304
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Location Map View */}
            <div>
              <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider mb-4">Location Map</h4>
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <iframe
                  title="Office Map Location"
                  src="https://www.google.com/maps?q=Urbtech+Trade+Center+Tower+Noida+Sector+132&output=embed"
                  width="100%"
                  height="100%"
                  style={{
                    border: "0",
                  }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
