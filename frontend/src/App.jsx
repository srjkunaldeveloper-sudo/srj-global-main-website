import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LenisProvider from './components/LenisProvider';
import PromotionPopup from './components/PromotionPopup';
import SEO from './components/SEO';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

// Keep Homepage components statically imported for instant First Contentful Paint
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Process from './components/Process';
import Trust from './components/Trust';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Portfolio from './components/Portfolio';
import Faq from './components/Faq';

// Lazy load secondary routes to dramatically reduce initial bundle size

const ServicesPage = lazy(() => import('./components/services/ServicesPage'));
const ServiceDetail = lazy(() => import('./components/services/ServiceDetail'));
const Pricing = lazy(() => import('./components/pricing/PricingPage'));
const About = lazy(() => import('./components/About'));
const Collaboration = lazy(() => import('./components/Collaboration'));
const Industries = lazy(() => import('./components/Industries'));
const Contact = lazy(() => import('./components/Contact'));
const Blog = lazy(() => import('./components/Blog'));
const BlogDetail = lazy(() => import('./components/blog/BlogDetail'));
const Careers = lazy(() => import('./components/Careers'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./components/TermsConditions'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

// A sleek fallback loading state while chunks are fetched
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-full animate-spin" />
  </div>
);

export default function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <SiteSettingsProvider>
      <LenisProvider>
        <div className="min-h-screen text-primary-text font-sans antialiased selection:bg-accent/15 selection:text-accent flex flex-col">
          {!isAdminPath && <Navbar />}
          {!isAdminPath && <PromotionPopup />}
          
          <main className="flex-grow">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Static Homepage Route */}
                <Route path="/" element={
                  <>
                    <SEO 
                      title="Software Development & IT Solutions" 
                      description="SRJ Global Technologies specializes in custom software development, IT consulting, and innovative digital solutions to propel your business forward."
                      keywords="software development, IT solutions, SRJ Global Technologies, web development, app development"
                      url="https://srjglobaltechnology.com"
                    />
                    <Hero />
                    <Marquee />
                    <Services />
                    <Portfolio />
                    <Process />
                    <Trust />
                    <Stats />
                    <Testimonials />
                    <Faq />
                  </>

                } />
                
                {/* Lazy Loaded Routes */}
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/industries" element={<Industries />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsConditions />} />
                
                {/* Admin Portal Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Suspense>
          </main>
          
          {!isAdminPath && <Footer />}
        </div>
      </LenisProvider>
    </SiteSettingsProvider>
  );
}
