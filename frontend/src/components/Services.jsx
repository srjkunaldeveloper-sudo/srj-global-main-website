import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE_URL}/services?is_home=true`);
        
        if (!isMounted) return;

        if (Array.isArray(res.data)) {
          const formattedDbServices = res.data.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.short_description || s.full_description || s.description,
            tags: Array.isArray(s.tags) && s.tags.length > 0
              ? s.tags
              : (s.category_id ? [s.category_id] : []),
            icon: s.icon && LucideIcons[s.icon] ? s.icon : "LayoutGrid",
            image: s.image,
            sortOrder: s.sort_order,
          }));

          setServices(formattedDbServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching homepage services from CMS:", err);
        if (isMounted) {
          setError("Failed to load services");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.children;
    if (!cards || !cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [services, loading]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-14 sm:py-20 lg:py-24 bg-section-bg px-4 sm:px-6 lg:px-8 border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Capabilities
          </div>
          <h2 className="text-2xl sm:text-4xl text-fluid-2xl font-extrabold text-primary-text tracking-tight mb-4">
            Premium Engineering Services
          </h2>
          <p className="text-secondary-text text-fluid-base">
            We deliver state-of-the-art technological solutions built to drive growth and efficiency.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 animate-pulse flex flex-col justify-between h-[280px]"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 mb-6" />
                  <div className="h-6 bg-slate-100 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-100 rounded w-5/6 mb-2" />
                </div>
                <div className="flex gap-2">
                  <div className="h-5 bg-slate-100 rounded w-16" />
                  <div className="h-5 bg-slate-100 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-slate-200/60 max-w-lg mx-auto">
            <p className="text-slate-500 text-sm font-medium">
              Services are currently unavailable. Please try again later.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-slate-200/60 max-w-lg mx-auto">
            <p className="text-slate-500 text-sm font-medium">
              No services found.
            </p>
          </div>
        )}

        {/* CMS Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {services.map((service) => {
              const Icon = LucideIcons[service.icon] || LucideIcons.LayoutGrid;

              return (
                <div
                  key={service.id}
                  className="group relative bg-white border border-border-light rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-slate-400 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border mb-6 bg-white text-slate-800 border-slate-200 transition-transform duration-300 group-hover:scale-110"
                    >
                      <Icon size={22} />
                    </div>

                    <h3 className="text-lg font-bold text-primary-text mb-3 flex items-center justify-between">
                      {service.title}
                      <ArrowUpRight
                        size={16}
                        className="text-slate-400 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 shrink-0"
                      />
                    </h3>

                    <p className="text-fluid-sm leading-relaxed text-secondary-text mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                        {service.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10.5px] font-semibold text-slate-600 tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
