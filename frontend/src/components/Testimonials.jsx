import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/testimonials`);
        if (res.data && res.data.success && Array.isArray(res.data.testimonials)) {
          setTestimonials(res.data.testimonials);
        } else if (Array.isArray(res.data)) {
          setTestimonials(res.data);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error("Error fetching active testimonials:", err);
        setError(true);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (loading || testimonials.length === 0) return;

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
  }, [loading, testimonials]);

  // If API has loaded and there are no active testimonials (or network error), hide section gracefully
  if (!loading && (testimonials.length === 0 || error)) {
    return null;
  }

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
          {loading ? (
            // Skeleton loader state while fetching
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 animate-pulse h-64 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-4 w-full bg-slate-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-slate-200 rounded-full"></div>
              </div>
            ))
          ) : (
            testimonials.map((t, idx) => (
              <div 
                key={t.id || idx}
                className="testi-card flex flex-col justify-between p-8 bg-white border border-slate-200/60 rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-slate-900/[0.03] hover:border-slate-350 transition-all duration-300"
              >
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(t.rating || 5)].map((_, i) => (
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
                <div className="border-t border-slate-100 pt-5 flex items-center gap-3">
                  {t.image && typeof t.image === 'string' ? (
                    <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  ) : null}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {t.author}
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium">
                      {t.role}{t.company && !t.role.includes(t.company) ? `, ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}
