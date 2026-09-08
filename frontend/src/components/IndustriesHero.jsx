import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function IndustriesHero() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const leftSideRef = useRef(null);
  const hubRef = useRef(null);

  const line1 = "What's Your Industry?".split(" ");
  const line2 = "We Build Digital Products".split(" ");
  const line3 = "For Every Business.".split(" ");

  const openCalendly = () => {
    window.location.href = "/#contact";
  };

  const industryCards = [
    { id: 'ecommerce', title: 'E-Commerce', desc: 'Retail & Brands', highlight: 'Storefronts & Checkouts', detail: 'Scale & Grow', posClass: 'top-left' },
    { id: 'healthcare', title: 'Healthcare', desc: 'Secure Tech Stack', highlight: 'HIPAA & Patient Apps', detail: 'Compliance Ready', posClass: 'top-right' },
    { id: 'fintech', title: 'FinTech', desc: 'Financial Ecosystems', highlight: 'Secure Payment Ready', detail: 'Trust & Privacy', posClass: 'bottom-center' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        defaults: { ease: 'power3.out' }
      });

      // Entrance animation
      tl.fromTo('.left-fade-badge',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo('.ind-hero-word',
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.15 },
        '-=0.3'
      )
      .fromTo('.left-fade-rest',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        '-=0.4'
      )
      .fromTo(hubRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.1)' },
        '-=0.8'
      )
      .fromTo('.ind-ecosystem-card',
        { scale: 0.92, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
        '-=0.9'
      )
      .fromTo('.link-line',
        { strokeDasharray: 200, strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 1.2, stagger: 0.08 },
        '-=1.0'
      );

      // Traveling particles
      document.querySelectorAll('.particle-flow').forEach((particle, idx) => {
        gsap.to(particle, {
          strokeDashoffset: -200,
          duration: 3.5 + (idx * 0.5),
          repeat: -1,
          ease: 'none'
        });
      });

      // Cards floating
      document.querySelectorAll('.ind-ecosystem-card').forEach((card, idx) => {
        gsap.to(card, {
          y: idx % 2 === 0 ? '-8px' : '8px',
          duration: 3.2 + (idx * 0.4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });

      // Parallax mouse move
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const moveX = (clientX - width / 2) * 0.015;
        const moveY = (clientY - height / 2) * 0.015;

        gsap.to('.ind-ecosystem-wrapper', {
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

  const handleMouseEnter = (e, index) => {
    gsap.to(e.currentTarget, { scale: 1.03, y: '-10px', shadow: '0 25px 50px rgba(0, 0, 0, 0.06)', duration: 0.3, ease: 'power2.out' });
    gsap.to(`#line-path-${index}`, { stroke: '#000000', strokeWidth: 2, duration: 0.3 });
  };

  const handleMouseLeave = (e, index) => {
    gsap.to(e.currentTarget, { scale: 1, y: '0px', shadow: '0 12px 24px rgba(0, 0, 0, 0.02)', duration: 0.3, ease: 'power2.out' });
    gsap.to(`#line-path-${index}`, { stroke: '#E5E7EB', strokeWidth: 1.2, duration: 0.3 });
  };

  return (
    <section 
      ref={containerRef}
      className="relative py-20 lg:py-28 px-6 bg-white overflow-hidden flex items-center justify-center min-h-[720px] border-b border-slate-100 font-sans"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center z-10">
        
        {/* LEFT SIDE */}
        <div ref={leftSideRef} className="lg:col-span-5 flex flex-col justify-center text-left">
          <div className="left-fade-badge inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-50 border border-slate-200 mb-6 w-fit">
            <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">
              INDUSTRIES WE SERVE
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-black leading-[1.08] tracking-tight mb-6">
            <span className="block">
              {line1.map((word, idx) => (
                <span key={idx} className="ind-hero-word inline-block mr-3 opacity-0 select-none">{word}</span>
              ))}
            </span>
            <span className="block mt-1">
              {line2.map((word, idx) => (
                <span key={idx} className="ind-hero-word inline-block mr-3 opacity-0 select-none">{word}</span>
              ))}
            </span>
            <span className="block mt-1">
              {line3.map((word, idx) => (
                <span key={idx} className="ind-hero-word inline-block mr-3 opacity-0 select-none">{word}</span>
              ))}
            </span>
          </h1>

          <p className="left-fade-rest text-slate-500 text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
            From startups to global enterprises, we create scalable digital products tailored for every industry. Explore our deep domain expertise.
          </p>

          <div className="left-fade-rest flex flex-wrap items-center gap-4 mb-12">
            <button 
              onClick={() => document.getElementById("ij-cards")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-black/90 text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-slate-900/10"
            >
              Explore Industries
              <ArrowRight size={14} />
            </button>
            <button 
              onClick={openCalendly}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-black text-sm border border-slate-200 font-bold transition-all duration-200 hover:-translate-y-0.5"
            >
              Schedule Consultation
            </button>
          </div>

          <div className="left-fade-rest grid grid-cols-2 gap-y-3.5 gap-x-4 max-w-md border-t border-slate-100 pt-8">
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>Domain Experts</span>
            </div>
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>Tailored Solutions</span>
            </div>
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>HIPAA & SEC Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-black text-xs font-semibold">
              <Check size={14} className="text-slate-800 flex-shrink-0" />
              <span>Enterprise Scale</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end items-center relative min-h-[500px] w-full select-none lg:pr-6">
          <div className="ind-ecosystem-wrapper relative w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] flex items-center justify-center">
            
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block" viewBox="0 0 500 500">
              <path id="line-path-0" className="link-line" d="M 250 250 L 100 135" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
              <path id="line-path-1" className="link-line" d="M 250 250 L 400 135" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
              <path id="line-path-2" className="link-line" d="M 250 250 L 250 410" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />

              <path className="particle-flow" d="M 250 250 L 100 135" stroke="#000000" strokeWidth="1.8" strokeDasharray="8, 192" strokeDashoffset="200" fill="none" />
              <path className="particle-flow" d="M 250 250 L 400 135" stroke="#000000" strokeWidth="1.8" strokeDasharray="8, 192" strokeDashoffset="200" fill="none" />
              <path className="particle-flow" d="M 250 250 L 250 410" stroke="#000000" strokeWidth="1.8" strokeDasharray="8, 192" strokeDashoffset="200" fill="none" />
            </svg>

            {/* Central Hub */}
            <div 
              ref={hubRef} 
              className="absolute z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center p-1"
            >
              <div className="w-full h-full rounded-full bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-800 text-center px-2">
                  Industries Hub
                </span>
              </div>
            </div>

            {/* Industry Cards */}
            {industryCards.map((card, index) => (
              <div 
                key={card.id}
                onMouseEnter={(e) => handleMouseEnter(e, index)}
                onMouseLeave={(e) => handleMouseLeave(e, index)}
                className={`ind-ecosystem-card absolute bg-white border border-slate-200 p-4 sm:p-5 rounded-[20px] shadow-sm transition-all duration-350 z-20 w-[125px] sm:w-[150px] hover:z-30 text-left cursor-pointer
                  ${card.posClass === 'top-left' ? 'top-[10px] left-[0px]' : ''}
                  ${card.posClass === 'top-right' ? 'top-[10px] right-[0px]' : ''}
                  ${card.posClass === 'bottom-center' ? 'bottom-[10px] left-[50%] -translate-x-1/2' : ''}
                `}
              >
                <span className="text-[8px] font-extrabold uppercase text-slate-400 block tracking-wider mb-1">{card.desc}</span>
                <h4 className="font-extrabold text-[12px] sm:text-sm text-slate-900 leading-none mb-2">{card.title}</h4>
                <div className="py-1.5 border-t border-b border-slate-100 my-2">
                  <span className="text-[9px] text-slate-500 font-semibold leading-tight block">{card.highlight}</span>
                </div>
                <div className="text-[10px] font-black text-[#000000] mt-1">{card.detail}</div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
