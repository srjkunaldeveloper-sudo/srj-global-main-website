import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ArrowRight, Code, PenTool, Database, Cpu, Cloud, Shield, Rocket, Smartphone, ChevronDown, FolderGit2, UserCheck, PhoneCall, Briefcase, Tag, BookOpen, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import logoImg from '../assets/Logo2.png';
import "@fontsource/geist-sans";
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useNavigation } from '../context/NavigationContext';

const ICON_MAP = {
  Code,
  PenTool,
  Database,
  Cpu,
  Cloud,
  Shield,
  Rocket,
  Smartphone,
  ChevronDown,
  Search,
  Menu,
  X,
  ArrowRight,
  FolderGit2,
  UserCheck,
  PhoneCall,
  Briefcase,
  Tag,
  BookOpen,
  Home
};

const renderIcon = (iconName, size = 18, className = '') => {
  if (!iconName || !ICON_MAP[iconName]) return null;
  const IconComponent = ICON_MAP[iconName];
  return <IconComponent size={size} className={className} />;
};

export default function Navbar() {
  const { getSetting } = useSiteSettings();
  const { headerNav } = useNavigation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const logoClicks = useRef(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let isHidden = false;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY;

      if (currentY < 50) {
        if (isHidden) {
          gsap.to(navRef.current, { y: '0%', opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
          isHidden = false;
        }
        setIsScrolled(false);
        lastY = currentY;
        return;
      }

      setIsScrolled(currentY > 30);

      if (diff > 5 && currentY > 100) {
        if (!isHidden && !activeDropdown) {
          gsap.to(navRef.current, { y: '-100%', duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
          isHidden = true;
        }
      } else if (diff < -5) {
        if (isHidden) {
          gsap.to(navRef.current, { y: '0%', duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
          isHidden = false;
        }
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeDropdown]);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const activeItem = (headerNav || []).find(
    (item) => item.id === activeDropdown || item.label === activeDropdown
  );

  return (
    <nav
      ref={navRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveDropdown(null); }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled || activeDropdown
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
          : 'bg-white'
      } ${activeDropdown ? 'pb-8 pt-4' : 'py-4'} px-4 sm:px-6 md:px-8`}
    >
      <div className="max-w-9xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Logo */}
        <div 
          onClick={() => {
            logoClicks.current += 1;
            if (logoClicks.current === 3) {
              logoClicks.current = 0;
              navigate('/admin/login');
            } else {
              setTimeout(() => { logoClicks.current = 0; }, 400);
            }
          }}
          className="flex items-center shrink-0 cursor-pointer select-none py-1"
        >
          <img
            src={(getSetting('logo_url') && (getSetting('logo_url').startsWith('http') || getSetting('logo_url').startsWith('/uploads'))) ? getSetting('logo_url') : logoImg}
            alt={getSetting('company_name', 'SRJ Global Technologies')}
            className="h-13 w-12 object-contain pointer-events-none"
          />
          <span className="hidden font-sans text-lg text-slate-900 tracking-tight">
            {getSetting('company_name', 'SRJ Global')}
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center gap-6 xl:gap-8">
            {(headerNav || []).map((link) => {
              const hasDropdown = Array.isArray(link.children) && link.children.length > 0;

              const handleMouseEnter = () => {
                if (hasDropdown) {
                  setActiveDropdown(link.id);
                } else {
                  setActiveDropdown(null);
                }
              };

              const linkClass = `group flex items-center gap-1 font-sans text-lg xl:text-xl transition-all inline-flex shrink-0 overflow-visible py-2 px-1.5 whitespace-nowrap ${
                activeDropdown === link.id || activeDropdown === link.label ? 'text-black scale-105' : 'text-slate-800 hover:text-black hover:scale-105'
              }`;

              if (link.item_type === 'external') {
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.target || '_self'}
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onMouseEnter={handleMouseEnter}
                    className={linkClass}
                  >
                    {link.label}
                    {hasDropdown && (
                      <ChevronDown 
                        size={18} 
                        className={`transition-transform duration-300 ${(activeDropdown === link.id || activeDropdown === link.label) ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}
                      />
                    )}
                  </a>
                );
              }

              return (
                <Link
                  key={link.id}
                  to={link.url}
                  onClick={() => {
                    if (!link.url.includes('#')) {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  onMouseEnter={handleMouseEnter}
                  className={linkClass}
                >
                  {link.label}
                  {hasDropdown && (
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-300 ${(activeDropdown === link.id || activeDropdown === link.label) ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Spacer */}
        <div className="hidden md:block w-6 shrink-0" />

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="lg:hidden p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-900 hover:text-slate-600 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MEGA MENUS --- */}
      <div 
        className={`hidden lg:block max-w-9xl mx-auto overflow-hidden transition-all duration-300 ease-in-out ${
          activeDropdown ? 'max-h-[80vh] opacity-100 mt-6 pt-6 border-t border-slate-100' : 'max-h-0 opacity-0 mt-0 pt-0 border-transparent'
        }`}
      >
        {activeItem && activeItem.label === 'Services' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-5xl mx-auto">
            {(activeItem.children || []).map((child) => {
              const childIcon = renderIcon(child.icon_name, 18) || <Rocket size={18} />;

              if (child.item_type === 'external') {
                return (
                  <a
                    key={child.id}
                    href={child.url}
                    target={child.target || '_self'}
                    rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={() => setActiveDropdown(null)}
                    className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all">
                      {childIcon}
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-black text-sm">{child.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={child.id}
                  to={child.url}
                  onClick={() => setActiveDropdown(null)}
                  className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:bg-white group-hover:shadow-sm transition-all">
                    {childIcon}
                  </div>
                  <span className="font-bold text-slate-800 group-hover:text-black text-sm">{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {activeItem && activeItem.label === 'Pricing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {(activeItem.children || []).map((plan, i) => {
              const pricingIconColors = ['text-slate-500', 'text-blue-500', 'text-emerald-500'];
              const iconColorClass = pricingIconColors[i % 3];
              const childIcon = renderIcon(plan.icon_name, 20, iconColorClass) || <Code size={20} className={iconColorClass} />;

              if (plan.item_type === 'external') {
                return (
                  <a
                    key={plan.id}
                    href={plan.url}
                    target={plan.target || '_self'}
                    rel={plan.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={() => setActiveDropdown(null)}
                    className="group p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      {childIcon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.label}</h3>
                    {plan.description && <p className="text-sm text-slate-500 font-medium">{plan.description}</p>}
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-slate-900 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      View Details <ArrowRight size={16} />
                    </div>
                  </a>
                );
              }

              return (
                <Link 
                  key={plan.id} 
                  to={plan.url}
                  onClick={() => { setActiveDropdown(null); if (!plan.url.includes('#')) window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="group p-6 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    {childIcon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.label}</h3>
                  {plan.description && <p className="text-sm text-slate-500 font-medium">{plan.description}</p>}
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-slate-900 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    View Details <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Fallback for any other top-level menu item with children */}
        {activeItem && activeItem.label !== 'Services' && activeItem.label !== 'Pricing' && Array.isArray(activeItem.children) && activeItem.children.length > 0 && (
          <div className="flex flex-wrap gap-4 max-w-4xl mx-auto justify-center">
            {activeItem.children.map((child) => {
              const childIcon = renderIcon(child.icon_name, 18);
              if (child.item_type === 'external') {
                return (
                  <a
                    key={child.id}
                    href={child.url}
                    target={child.target || '_self'}
                    rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={() => setActiveDropdown(null)}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all"
                  >
                    {childIcon && <div className="text-slate-600">{childIcon}</div>}
                    <span className="font-bold text-slate-800 text-sm">{child.label}</span>
                  </a>
                );
              }
              return (
                <Link
                  key={child.id}
                  to={child.url}
                  onClick={() => setActiveDropdown(null)}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-all"
                >
                  {childIcon && <div className="text-slate-600">{childIcon}</div>}
                  <span className="font-bold text-slate-800 text-sm">{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 max-h-[calc(100vh-80px)] overflow-y-auto bg-white border-b border-slate-200 shadow-lg py-6 px-4 sm:px-6">
          <div className="relative mb-5">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            {(headerNav || []).map((link) => {
              const hasDropdown = Array.isArray(link.children) && link.children.length > 0;
              const isDropdownOpen = mobileDropdown === link.id || mobileDropdown === link.label;

              if (hasDropdown) {
                return (
                  <div key={link.id} className="border-b border-slate-50">
                    <button 
                      onClick={() => setMobileDropdown(isDropdownOpen ? null : link.id)}
                      className="w-full font-sans text-base font-bold text-slate-650 hover:text-black py-3 px-2 flex items-center justify-between min-h-[44px]"
                    >
                      {link.label}
                      <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropdownOpen ? 'max-h-[600px] opacity-100 py-2' : 'max-h-0 opacity-0'}`}>
                      <div className="flex flex-col gap-1 pl-4">
                        {(link.children || []).map((child) => {
                          const childIcon = renderIcon(child.icon_name, 16);

                          if (child.item_type === 'external') {
                            return (
                              <a
                                key={child.id}
                                href={child.url}
                                target={child.target || '_self'}
                                rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                                onClick={() => { setIsMobileMenuOpen(false); setMobileDropdown(null); }}
                                className="py-2 px-2 text-sm text-slate-600 hover:text-black font-semibold flex items-center gap-2"
                              >
                                {childIcon}
                                {child.label}
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={child.id}
                              to={child.url}
                              onClick={() => { setIsMobileMenuOpen(false); setMobileDropdown(null); }}
                              className="py-2 px-2 text-sm text-slate-600 hover:text-black font-semibold flex items-center gap-2"
                            >
                              {link.label === 'Pricing' ? (
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex justify-center items-center">
                                  {childIcon || <Code size={14} />}
                                </div>
                              ) : (
                                childIcon
                              )}
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              if (link.item_type === 'external') {
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.target || '_self'}
                    rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    onClick={() => { setIsMobileMenuOpen(false); }}
                    className="font-sans text-base font-bold text-slate-650 hover:text-black py-3 px-2 border-b border-slate-50 flex items-center min-h-[44px]"
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link 
                  key={link.id} 
                  to={link.url} 
                  onClick={() => { setIsMobileMenuOpen(false); if (!link.url.includes('#')) window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                  className="font-sans text-base font-bold text-slate-650 hover:text-black py-3 px-2 border-b border-slate-50 flex items-center min-h-[44px]"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[rgba(0,0,0,0.08)] pointer-events-none transition-opacity duration-300 ease-out" style={{ opacity: (isHovered || isScrolled || activeDropdown) ? 1 : 0 }} />
    </nav>
  );
}

