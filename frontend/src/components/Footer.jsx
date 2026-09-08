import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/Logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    },
    {
      name: 'Pinterest',
      url: 'https://www.pinterest.com/',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.102-.947-.195-2.4.04-3.434.21-.93 1.357-5.736 1.357-5.736s-.346-.689-.346-1.713c0-1.605.932-2.802 2.09-2.802 1.018 0 1.503.766 1.503 1.683 0 1.025-.653 2.554-.99 3.978-.281 1.189.6 2.158 1.77 2.158 2.126 0 3.76-2.242 3.76-5.482 0-2.868-2.062-4.872-5.005-4.872-3.41 0-5.41 2.56-5.41 5.201 0 1.03.398 2.13.896 2.73a.382.382 0 01.088.366c-.097.406-.312 1.272-.355 1.447-.057.23-.19.278-.437.163C2.86 19.34 1.75 16.48 1.75 13.5c0-4.75 3.45-9.11 9.95-9.11 5.22 0 9.28 3.72 9.28 8.69 0 5.19-3.27 9.37-7.82 9.37-1.53 0-2.96-.79-3.45-1.73l-.94 3.59c-.34 1.31-1.27 2.95-1.89 3.96 1.41.43 2.91.67 4.47.67 6.62 0 11.99-5.37 11.99-11.99C24 5.37 18.63 0 12.017 0z" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 002.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    }
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-200 text-slate-800 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start relative z-10">
        
        {/* === COLUMN 1: BRAND === */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="SRJ Global Technologies"
              loading="lazy"
              decoding="async"
              className="w-14 object-contain filter"
            />
            <div>
              <h1 className="margin-0 text-[20px] font-black tracking-wide leading-tight text-slate-900">
                SRJ <span className="text-slate-500 font-light">GLOBAL</span>
              </h1>
              <h2 className="margin-0 text-[14px] font-bold text-slate-500 tracking-widest leading-none mt-0.5">
                TECHNOLOGIES
              </h2>
            </div>
          </div>
          
          <p className="text-slate-500 text-fluid-sm mt-6 leading-relaxed max-w-sm">
            Innovative digital solutions: we build high-quality websites, mobile apps, and custom enterprise platforms for growing brands.
          </p>

          <div className="flex items-center gap-3 mt-6 flex-wrap">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-500 hover:text-black hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 hover:-translate-y-0.5 min-w-[40px] min-h-[40px]"
              >
                {social.svg}
              </a>
            ))}
          </div>
        </div>

        {/* === COLUMN 2: QUICK LINKS === */}
        <div className="sm:col-span-1 lg:col-span-2 lg:col-start-5">
          <h3 className="text-slate-900 font-bold text-base mb-4 sm:mb-6 tracking-wide">Quick Links</h3>
          <div className="flex flex-col gap-2.5">
            <Link to="/contact" className="text-slate-500 hover:text-black hover:translate-x-1 transition-all duration-300 text-fluid-sm py-1 inline-block">Contact Us</Link>
            <Link to="/pricing" className="text-slate-500 hover:text-black hover:translate-x-1 transition-all duration-300 text-fluid-sm py-1 inline-block">Pricing Plans</Link>
            <Link to="/blog" className="text-slate-500 hover:text-black hover:translate-x-1 transition-all duration-300 text-fluid-sm py-1 inline-block">Blog</Link>
            <Link to="/careers" className="text-slate-500 hover:text-black hover:translate-x-1 transition-all duration-300 text-fluid-sm py-1 inline-block">Careers</Link>
            <Link to="/collaboration" className="text-slate-500 hover:text-black hover:translate-x-1 transition-all duration-300 text-fluid-sm py-1 inline-block">Collaboration</Link>
          </div>
        </div>

        {/* === COLUMN 3: CONTACT INFO === */}
        <div className="sm:col-span-1 lg:col-span-3">
          <h3 className="text-slate-900 font-bold text-base mb-4 sm:mb-6 tracking-wide">Get In Touch</h3>
          
          <div className="mb-4 sm:mb-5">
            <div className="text-slate-900 text-xs font-semibold uppercase tracking-wider mb-1">Email</div>
            <a href="mailto:srjglobaltechnology@gmail.com" className="text-slate-500 hover:text-black transition-colors duration-200 text-fluid-sm py-0.5 inline-block">
              srjglobaltechnology@gmail.com
            </a>
          </div>

          <div className="mb-4 sm:mb-5">
            <div className="text-slate-900 text-xs font-semibold uppercase tracking-wider mb-1">Phone & WhatsApp</div>
            <a href="tel:+919990430305" className="text-slate-500 hover:text-black transition-colors duration-200 text-fluid-sm block py-0.5">
              +91 99904 30305
            </a>
            <a href="https://wa.me/919266706599" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-black transition-colors duration-200 text-fluid-sm block py-0.5 mt-0.5">
              +91 92667 06599
            </a>
          </div>

          <div>
            <div className="text-slate-900 text-xs font-semibold uppercase tracking-wider mb-1">Office</div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Urbtech+Trade+Center+Tower+C-1101+Noida+Sector+132" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-black transition-colors duration-200 text-fluid-sm leading-relaxed block py-0.5"
            >
              Urbtech Trade Center Tower,<br />
              C-1101 Noida Sector-132,<br />
              Uttar Pradesh 201304
            </a>
          </div>
        </div>

        {/* === COLUMN 4: REVIEWS & LEGAL === */}
        <div className="sm:col-span-2 lg:col-span-3">
          <h3 className="text-slate-900 font-bold text-base mb-4 sm:mb-6 tracking-wide">Review Us</h3>
          <p className="text-slate-500 text-fluid-sm mb-4 leading-relaxed">
            Your feedback helps us deliver cutting-edge software products.
          </p>
          <a
            href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all duration-300 shadow-sm min-h-[44px]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.743-.08-1.31-.177-1.879H12.24z" />
            </svg>
            Google Review
          </a>

          <div className="flex flex-wrap items-center gap-2.5 mt-8 text-xs">
            <Link to="/privacy" className="text-slate-400 hover:text-black transition-colors duration-200 py-1">Privacy Policy</Link>
            <span className="text-slate-200">•</span>
            <a href="#contact" className="text-slate-400 hover:text-black transition-colors duration-200 py-1">Cookies</a>
            <span className="text-slate-200">•</span>
            <Link to="/terms" className="text-slate-400 hover:text-black transition-colors duration-200 py-1">Terms & Conditions</Link>
          </div>
        </div>

      </div>

      {/* === BOTTOM BAR === */}
      <div className="max-w-7xl mx-auto pt-8 mt-12 sm:mt-16 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-fluid-sm text-slate-400 relative z-10">
        <div>
          © {currentYear} SRJ Global Technologies. All rights reserved.
        </div>
      </div>

    </footer>
  );
}
