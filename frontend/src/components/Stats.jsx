import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, Users, Award, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const stats = [
    { 
      target: 18000, 
      suffix: '+', 
      label: 'Projects Completed', 
      icon: <CheckCircle className="text-emerald-500 w-6 h-6 mb-4" /> 
    },
    { 
      target: 6000, 
      suffix: '+', 
      label: 'Happy Clients', 
      icon: <Users className="text-blue-500 w-6 h-6 mb-4" /> 
    },
    { 
      target: 19, 
      suffix: '+', 
      label: 'Years Experience', 
      icon: <Award className="text-amber-500 w-6 h-6 mb-4" /> 
    },
    { 
      target: 24, 
      suffix: '/7', 
      label: 'Expert Support', 
      icon: <Shield className="text-violet-500 w-6 h-6 mb-4" /> 
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for header
      gsap.fromTo('.achieve-header-el',
        { opacity: 0, y: 25 },
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

      // Staggered entrance for stats cards
      gsap.fromTo('.stat-card',
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

      // Counter numbers animation
      stats.forEach((stat, idx) => {
        const counterEl = document.querySelector(`.counter-num-${idx}`);
        if (!counterEl) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            counterEl.textContent = Math.floor(obj.val);
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-white px-6 border-b border-slate-100"
      id="achievements"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="achieve-header-el text-3xl sm:text-4xl md:text-[38px] font-black text-slate-900 leading-tight mb-4 tracking-tight">
            Our Achievements
          </h2>
          <p className="achieve-header-el text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Delivering high-quality IT solutions with proven success and trusted by clients worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="stat-card flex flex-col items-center justify-center p-8 bg-white border border-slate-150 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-slate-900/[0.03] hover:border-slate-350 transition-all duration-300"
            >
              {stat.icon}
              <div className="text-4xl font-extrabold text-slate-900 mb-2 font-sans tracking-tight">
                <span className={`counter-num-${idx}`}>0</span>
                <span>{stat.suffix}</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 leading-normal">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
