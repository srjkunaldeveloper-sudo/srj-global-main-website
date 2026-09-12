import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceCard from "./ServiceCard";
import { getServiceHref } from "../../data/servicesData";

gsap.registerPlugin(ScrollTrigger);

export default function ServiceCategory({ category }) {
  const containerRef = useRef(null);
  const Icon = category.icon;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header fade-up
      gsap.fromTo(
        ".category-header-fade",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards staggered premium fade-up with scale and translateY
      gsap.fromTo(
        ".category-card-fade",
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current.querySelector(".category-cards-grid"),
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [category.services.length]);

  return (
    <section
      ref={containerRef}
      className="services-category relative py-20 border-t border-slate-100/60 bg-white overflow-hidden"
      id={category.id}
    >
      {/* LUXURY NOISE / GRID TEXTURE OVERLAY */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* SOFT BLURRED RADIAL GRADIENT LIGHT DECO */}
      <div className="absolute top-1/4 left-1/3 w-[360px] h-[360px] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] rounded-full bg-indigo-50/40 blur-[100px] pointer-events-none z-0" />

      <div className="services-container max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="category-header-fade flex flex-col items-center text-center w-full mb-16">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-800 mb-4 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            {Icon && <Icon size={20} strokeWidth={1.5} />}
          </div>
          <div>
            <h2 className="services-category__title text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {category.title}
            </h2>
            <p className="services-category__desc text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="category-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {category.services.map((service, index) => (
            <div key={service.title} className="category-card-fade opacity-0 h-full">
              <ServiceCard
                service={service}
                href={service.id ? `/services/${service.id}` : getServiceHref(service.title)}
                index={index}
                categoryTitle={category.title}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
