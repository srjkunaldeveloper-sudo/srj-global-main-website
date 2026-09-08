import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Check } from 'lucide-react';

export default function WhyChooseUs() {
  const containerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );

      gsap.fromTo('.feature-item',
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { title: 'Experienced Team', desc: 'Industry veterans who have engineered platforms scaling to millions of users.' },
    { title: 'Agile Development', desc: 'Rapid, iterative release schedules that align code creation directly with user feedback.' },
    { title: 'Secure Solutions', desc: 'Bank-grade compliance, end-to-end encryption, and rigorous vulnerability auditing.' },
    { title: 'Fast Delivery', desc: 'Efficient pipeline integration ensuring early-stage feedback and minimized time-to-market.' },
    { title: 'Long-term Support', desc: 'Round-the-clock infrastructure SLA management, performance scaling, and updates.' }
  ];

  return (
    <section
      id="solutions"
      ref={containerRef}
      className="py-24 bg-white px-6 border-b border-slate-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Modern SVG Tech Illustration */}
        <div ref={leftRef} className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[460px] aspect-square bg-white border border-slate-100 rounded-3xl p-8 flex items-center justify-center">
            {/* Minimal High-Tech Diagram */}
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-300">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.75" />
              
              {/* Central Core */}
              <circle cx="100" cy="100" r="18" fill="#0F172A" fillOpacity="0.05" stroke="#0F172A" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="4" fill="#0F172A" />

              {/* Surrounding Nodes */}
              <g className="animate-spin" style={{ transformOrigin: '100px 100px', animationDuration: '30s' }}>
                <circle cx="100" cy="30" r="8" fill="#0F172A" />
                <line x1="100" y1="38" x2="100" y2="50" stroke="#0F172A" strokeWidth="1" />
                
                <circle cx="100" cy="170" r="8" fill="#64748B" />
                <line x1="100" y1="150" x2="100" y2="162" stroke="#64748B" strokeWidth="1" />

                <circle cx="30" cy="100" r="8" fill="#64748B" />
                <line x1="38" y1="100" x2="50" y2="100" stroke="#64748B" strokeWidth="1" />

                <circle cx="170" cy="100" r="8" fill="#0F172A" />
                <line x1="150" y1="100" x2="162" y2="100" stroke="#0F172A" strokeWidth="1" />
              </g>

              {/* Data streams */}
              <path d="M50 100 A50 50 0 0 1 150 100" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="10 150" className="animate-[dash_4s_linear_infinite]" />
            </svg>

            {/* Float Cards */}
            <div className="absolute top-10 left-6 bg-white border border-slate-100 rounded-xl p-3 shadow-md text-xs font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
              <span>Team Availability: 99.8%</span>
            </div>
            <div className="absolute bottom-10 right-6 bg-white border border-slate-100 rounded-xl p-3 shadow-md text-xs font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse" />
              <span>CI/CD Pipeline: PASS</span>
            </div>
          </div>
        </div>

        {/* Right Side: Features */}
        <div ref={rightRef} className="lg:col-span-6">
          <div className="mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
              Value Proposition
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight mb-4">
              Engineered for Enterprise Success
            </h2>
            <p className="text-secondary-text text-base sm:text-lg">
              We leverage modern practices and advanced toolkits to build clean, fast, and maintainable systems.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-item flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mt-1">
                  <Check size={14} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary-text mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-secondary-text leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
