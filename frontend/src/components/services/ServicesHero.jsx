import React, { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Check, 
  ArrowRight, 
  Code2, 
  Server, 
  Cloud, 
  Database, 
  Layers, 
  Cpu 
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesHero() {
  const containerRef = useRef(null);
  const leftSideRef = useRef(null);
  const hubRef = useRef(null);

  const { getSetting } = useSiteSettings();

  // Dynamic Site Settings (CMS values with safe fallbacks)
  const heroBadge = getSetting('services_hero_badge', 'Enterprise Technology Partner');
  const heroTitleSetting = getSetting('services_hero_title', 'Technology Solutions Built for Growth.');
  const heroSubtitle = getSetting('services_hero_subtitle', 'We build scalable web applications, enterprise software, AI-powered solutions, cloud infrastructure, and mobile applications that help startups and enterprises grow faster.');

  const openCalendly = () => {
    window.location.href = "/#contact";
  };

  const techCards = [
    { id: 'frontend', name: 'Frontend', items: ['React', 'Next.js', 'TypeScript'], icon: <Code2 size={15} />, posClass: 'top-left' },
    { id: 'ai', name: 'AI & Machine Learning', items: ['Python', 'TensorFlow', 'OpenAI'], icon: <Cpu size={15} />, posClass: 'top-center' },
    { id: 'cloud', name: 'Cloud', items: ['AWS', 'Azure', 'Google Cloud'], icon: <Cloud size={15} />, posClass: 'top-right' },
    { id: 'devops', name: 'DevOps', items: ['Docker', 'Kubernetes', 'GitHub Actions'], icon: <Layers size={15} />, posClass: 'bottom-right' },
    { id: 'database', name: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis'], icon: <Database size={15} />, posClass: 'bottom-center' },
    { id: 'backend', name: 'Backend', items: ['Node.js', '.NET', 'Express'], icon: <Server size={15} />, posClass: 'bottom-left' }
  ];

  const [line1, line2] = useMemo(() => {
    const raw = heroTitleSetting || 'Technology Solutions Built for Growth.';
    if (raw.includes('\n')) {
      const parts = raw.split('\n').map(p => p.trim()).filter(Boolean);
      return [
        (parts[0] || '').split(' ').filter(Boolean),
        (parts[1] || '').split(' ').filter(Boolean)
      ];
    }
    const words = raw.split(' ').filter(Boolean);
    if (words.length <= 3) {
      return [words, []];
    }
    const line1Words = words.slice(0, 2);
    const line2Words = words.slice(2);
    return [line1Words, line2Words];
  }, [heroTitleSetting]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        defaults: { ease: 'power3.out' }
      });
      
      tl.fromTo('.left-fade-badge', 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo('.hero-heading-word',
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.15 },
        '-=0.3'
      )
      .fromTo('.left-fade-rest',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        '-=0.4'
      )
      .fromTo(hubRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.1)' },
        '-=0.8'
      )
      .fromTo('.tech-hexagon-card',
        { scale: 0.92, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        '-=0.9'
      )
      .fromTo('.link-line',
        { strokeDasharray: 200, strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 1.2, stagger: 0.08 },
        '-=1.0'
      );

      // 2. Traveling flow particles
      document.querySelectorAll('.flow-particle').forEach((particle, idx) => {
        gsap.to(particle, {
          strokeDashoffset: -200,
          duration: 3 + (idx * 0.4),
          repeat: -1,
          ease: 'none'
        });
      });

      // 3. Central Hub independent rotations
      gsap.to('.outer-text-ring', {
        rotation: 360,
        duration: 25,
        repeat: -1,
        ease: 'none'
      });

      gsap.to('.inner-dash-ring', {
        rotation: -360,
        duration: 35,
        repeat: -1,
        ease: 'none'
      });

      // 4. Hub pulse
      gsap.to('.inner-hub-circle', {
        scale: 1.04,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // 5. Floating cards (independent amplitudes)
      document.querySelectorAll('.tech-hexagon-card').forEach((card, idx) => {
        gsap.to(card, {
          y: idx % 2 === 0 ? '-10px' : '10px',
          duration: 3.5 + (idx * 0.4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // 6. Interactive mouse parallax
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        const moveX = (clientX - width / 2) * 0.015;
        const moveY = (clientY - height / 2) * 0.015;

        gsap.to('.interactive-ecosystem-wrapper', {
          x: moveX,
          y: moveY,
          duration: 1,
          ease: 'power2.out'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Card hover animations
  const handleMouseEnter = (e, index) => {
    gsap.to(e.currentTarget, { scale: 1.03, y: '-15px', shadow: '0 25px 50px rgba(0, 0, 0, 0.06)', duration: 0.3, ease: 'power2.out' });
    gsap.to(`#line-path-${index}`, { stroke: '#000000', strokeWidth: 2, duration: 0.3 });
  };

  const handleMouseLeave = (e, index) => {
    gsap.to(e.currentTarget, { scale: 1, y: '0px', shadow: '0 12px 24px rgba(0, 0, 0, 0.02)', duration: 0.3, ease: 'power2.out' });
    gsap.to(`#line-path-${index}`, { stroke: '#E5E7EB', strokeWidth: 1.2, duration: 0.3 });
  };

  return (
    <section 
      ref={containerRef} 
      className="relative py-20 lg:py-28 px-6 bg-white overflow-hidden flex items-center justify-center min-h-[760px] border-b border-slate-100 font-sans"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center z-10">
        
        {/* LEFT SIDE (45%) */}
        <div ref={leftSideRef} className="lg:col-span-5 flex flex-col justify-center text-left">
          {/* Badge */}
          <div className="left-fade-badge inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 mb-6 w-fit">
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">
              {heroBadge}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-black leading-[1.08] tracking-tight mb-6">
            <span className="block">
              {line1.map((word, idx) => (
                <span key={idx} className="hero-heading-word inline-block mr-3 opacity-0 select-none">
                  {word}
                </span>
              ))}
            </span>
            <span className="block mt-1">
              {line2.map((word, idx) => (
                <span key={idx} className="hero-heading-word inline-block mr-3 opacity-0 select-none">
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Paragraph */}
          <p className="left-fade-rest text-slate-500 text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
            {heroSubtitle}
          </p>

          {/* Buttons */}
          <div className="left-fade-rest flex flex-wrap items-center gap-4 mb-12">
            <button 
              onClick={() => {
                document.querySelector('.services-directory')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-black/90 text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-slate-900/10 cursor-pointer"
            >
              Explore Services
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={openCalendly}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-black text-sm border border-slate-200 font-bold transition-all duration-200 hover:-translate-y-0.5"
            >
              Talk to Our Experts
            </button>
          </div>

          {/* Trust badges */}
          <div className="left-fade-rest grid grid-cols-2 gap-y-3.5 gap-x-4 max-w-md border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>Enterprise Software</span>
            </div>
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>AI Solutions</span>
            </div>
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>Cloud Native</span>
            </div>
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>Dedicated Support</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (55%) - Hexagonal Ecosystem */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end items-center relative min-h-[560px] lg:min-h-[660px] w-full select-none lg:pr-8">
          <div className="interactive-ecosystem-wrapper relative w-[320px] sm:w-[540px] h-[320px] sm:h-[540px] flex items-center justify-center">
            
            {/* SVG Connecting Lines (Behind Cards) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block" viewBox="0 0 540 540">
              {/* Connection paths */}
              <path id="line-path-0" className="link-line" d="M 270 270 L 95 125" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
              <path id="line-path-1" className="link-line" d="M 270 270 L 270 50" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
              <path id="line-path-2" className="link-line" d="M 270 270 L 445 125" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
              <path id="line-path-3" className="link-line" d="M 270 270 L 445 415" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
              <path id="line-path-4" className="link-line" d="M 270 270 L 270 490" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
              <path id="line-path-5" className="link-line" d="M 270 270 L 95 415" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />

              {/* Glowing particles flow */}
              <path className="flow-particle" d="M 270 270 L 95 125" stroke="#000000" strokeWidth="2.0" strokeDasharray="10, 190" strokeDashoffset="200" fill="none" />
              <path className="flow-particle" d="M 270 270 L 270 50" stroke="#000000" strokeWidth="2.0" strokeDasharray="10, 190" strokeDashoffset="200" fill="none" />
              <path className="flow-particle" d="M 270 270 L 445 125" stroke="#000000" strokeWidth="2.0" strokeDasharray="10, 190" strokeDashoffset="200" fill="none" />
              <path className="flow-particle" d="M 270 270 L 445 415" stroke="#000000" strokeWidth="2.0" strokeDasharray="10, 190" strokeDashoffset="200" fill="none" />
              <path className="flow-particle" d="M 270 270 L 270 490" stroke="#000000" strokeWidth="2.0" strokeDasharray="10, 190" strokeDashoffset="200" fill="none" />
              <path className="flow-particle" d="M 270 270 L 95 415" stroke="#000000" strokeWidth="2.0" strokeDasharray="10, 190" strokeDashoffset="200" fill="none" />
            </svg>

            {/* Central Ecosystem Hub */}
            <div 
              ref={hubRef} 
              className="absolute z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center p-1 bg-white border border-slate-200 shadow-[0_12px_32px_rgba(17,24,39,0.03)]"
            >
              {/* Rotating Dashed outer ring */}
              <div className="inner-dash-ring absolute inset-1.5 border border-slate-200 border-dashed rounded-full" />
              
              {/* Circular rotating text */}
              <div className="outer-text-ring absolute inset-0 rounded-full flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path id="textPath" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                  <text className="text-[5.2px] fill-slate-400 font-mono tracking-[0.22em] uppercase">
                    <textPath href="#textPath" startOffset="0%">
                      Build • Scale • Innovate • Secure •
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Inner content sphere */}
              <div className="inner-hub-circle w-[78%] h-[78%] rounded-full bg-slate-50 flex items-center justify-center border border-slate-100/60 z-20">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#000000] text-center px-1">
                  Digital Ecosystem
                </span>
              </div>
            </div>

            {/* Hexagonal Cards */}
            {techCards.map((card, index) => (
              <div 
                key={card.id}
                onMouseEnter={(e) => handleMouseEnter(e, index)}
                onMouseLeave={(e) => handleMouseLeave(e, index)}
                className={`tech-hexagon-card absolute bg-white border border-slate-200/90 p-4 sm:p-5 rounded-[22px] shadow-[0_12px_24px_rgba(17,24,39,0.02)] transition-all duration-300 z-20 w-[125px] sm:w-[155px] hover:z-30 text-left cursor-pointer
                  ${card.posClass === 'top-left' ? 'top-[-5px] sm:top-[30px] left-[-20px] sm:left-[10px]' : ''}
                  ${card.posClass === 'top-center' ? 'top-[-55px] sm:top-[-60px] left-[50%] -translate-x-1/2' : ''}
                  ${card.posClass === 'top-right' ? 'top-[-5px] sm:top-[30px] right-[-20px] sm:right-[10px]' : ''}
                  ${card.posClass === 'bottom-right' ? 'bottom-[-5px] sm:bottom-[30px] right-[-20px] sm:right-[10px]' : ''}
                  ${card.posClass === 'bottom-center' ? 'bottom-[-55px] sm:bottom-[-60px] left-[50%] -translate-x-1/2' : ''}
                  ${card.posClass === 'bottom-left' ? 'bottom-[-5px] sm:bottom-[30px] left-[-20px] sm:left-[10px]' : ''}
                `}
              >
                {/* Icon & Name */}
                <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-800">
                    {card.icon}
                  </div>
                  <h4 className="font-extrabold text-[10.5px] sm:text-xs text-[#000000] tracking-tight leading-none">
                    {card.name}
                  </h4>
                </div>
                {/* Items */}
                <ul className="flex flex-col gap-0.5 pl-1.5 border-l border-slate-100">
                  {card.items.map((item, idx) => (
                    <li key={idx} className="text-[9px] sm:text-[10px] font-medium text-slate-500">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
