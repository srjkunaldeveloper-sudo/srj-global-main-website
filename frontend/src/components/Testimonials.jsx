import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const testimonials = [
    {
      quote: "SRJ Global Technologies completely transformed our website. The performance is incredibly fast, and their team was extremely professional throughout the process.",
      author: "Rajesh Kumar",
      role: "CEO, FinTech India",
    },
    {
      quote: "We hired them for SEO and app development. Within 3 months, our organic traffic increased by 150%, and the mobile app has received excellent feedback from users.",
      author: "Sarah Jenkins",
      role: "Marketing Director, HealthCo",
    },
    {
      quote: "Their UI/UX design work was outstanding. They created a highly interactive, modern interface that reduced user friction by 40%. Highly recommend!",
      author: "Amit Sharma",
      role: "Founder, EduSmart",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo('.testi-header-el',
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

      // Staggered cards animation
      gsap.fromTo('.testi-card',
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
      id="testimonials"
      className="py-24 bg-white px-6 border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="testi-header-el text-3xl sm:text-4xl md:text-[38px] font-black text-slate-900 leading-tight mb-4 tracking-tight">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="testi-card flex flex-col justify-between p-8 bg-white border border-slate-200/60 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-slate-900/[0.03] hover:border-slate-350 transition-all duration-300"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className="text-amber-500 fill-amber-500" 
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-700 text-sm leading-relaxed mb-8 italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author details */}
              <div className="border-t border-slate-100 pt-5">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {t.author}
                </h4>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
