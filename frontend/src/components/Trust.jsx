import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Trust() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const trustPoints = [
    {
      title: "End-to-End Product Development",
      desc: "From idea validation to post-launch growth — we own the entire lifecycle.",
    },
    {
      title: "Business & Technology Consultation",
      desc: "Strategic guidance that aligns technology investments with business outcomes.",
    },
    {
      title: "Scalable & Future-Proof Solutions",
      desc: "Architecture built to grow with your business and adapt to market shifts.",
    },
    {
      title: "Long-Term Partnership",
      desc: "We don't disappear after delivery. We invest in your success for years.",
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for header
      gsap.fromTo('.trust-header-el',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%'
          }
        }
      );

      // Entrance animation for cards
      gsap.fromTo('.trust-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="w-full bg-white py-24 px-6 relative overflow-hidden border-t border-slate-100"
    >
      {/* Premium subtle light glow gradients */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-slate-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-slate-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="trust-header-el text-2xl sm:text-3xl md:text-[38px] font-black text-slate-900 leading-tight mb-4 tracking-tight">
            We Don't Just Deliver Software. <span className="text-slate-450 font-normal">We Build Businesses.</span>
          </h2>
          <p className="trust-header-el text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Every product we ship comes with strategic thinking, business alignment, and a commitment to your long-term success.
          </p>
        </div>

        {/* Grid Cards */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustPoints.map((point, idx) => (
            <div 
              key={idx}
              className="trust-card flex flex-col gap-4 p-6 rounded-2xl bg-white border border-slate-200/60 hover:bg-white hover:border-slate-350 hover:shadow-xl hover:shadow-slate-900/[0.03] hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <CheckCircle2 
                size={18} 
                className="text-slate-900 opacity-80 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
              />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-2 leading-snug tracking-wide">
                  {point.title}
                </h4>
                <p className="text-slate-500 text-[11.5px] leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
