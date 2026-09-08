import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { technologies } from "../../data/servicesData";

gsap.registerPlugin(ScrollTrigger);

const half = Math.ceil(technologies.length / 2);
const rowA = technologies.slice(0, half);
const rowB = technologies.slice(half);

export default function TechnologyStrip() {
  const containerRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance fade-in for headers
      gsap.fromTo('.tech-fade-el',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // GSAP infinite horizontal smooth scrolling marquee
      const anim1 = gsap.fromTo(track1Ref.current,
        { xPercent: 0 },
        {
          xPercent: -50,
          repeat: -1,
          duration: 25,
          ease: "none"
        }
      );

      const anim2 = gsap.fromTo(track2Ref.current,
        { xPercent: -50 },
        {
          xPercent: 0,
          repeat: -1,
          duration: 25,
          ease: "none"
        }
      );

      // Smooth slow-down hover effect
      const slowDown = (anim) => gsap.to(anim, { timeScale: 0.15, duration: 0.5, ease: "power1.out" });
      const speedUp = (anim) => gsap.to(anim, { timeScale: 1, duration: 0.8, ease: "power1.out" });

      const track1 = track1Ref.current;
      const track2 = track2Ref.current;

      const onEnter1 = () => slowDown(anim1);
      const onLeave1 = () => speedUp(anim1);
      const onEnter2 = () => slowDown(anim2);
      const onLeave2 = () => speedUp(anim2);

      track1.addEventListener('mouseenter', onEnter1);
      track1.addEventListener('mouseleave', onLeave1);
      track2.addEventListener('mouseenter', onEnter2);
      track2.addEventListener('mouseleave', onLeave2);

      return () => {
        track1.removeEventListener('mouseenter', onEnter1);
        track1.removeEventListener('mouseleave', onLeave1);
        track2.removeEventListener('mouseenter', onEnter2);
        track2.removeEventListener('mouseleave', onLeave2);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="services-tech pt-10 pb-20 bg-white overflow-hidden border-t border-slate-100">
      <div className="services-container max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="tech-fade-el text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-900 mb-3 tracking-tight">
          Technology That Powers <span className="font-black text-slate-900">Possibility</span>
        </h2>
        <p className="tech-fade-el text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
          We work across modern technologies to build reliable, scalable digital solutions.
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full flex flex-col gap-4 overflow-hidden py-2 select-none">
        {/* Left & Right Edge Fades */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Row 1 (LTR) */}
        <div className="flex overflow-hidden w-full">
          <div ref={track1Ref} className="flex gap-4 pr-4 whitespace-nowrap will-change-transform">
            {/* Copy 1 */}
            {rowA.map((tech, idx) => (
              <span key={`a-1-${idx}`} className="px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 text-slate-800 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer">
                {tech}
              </span>
            ))}
            {/* Copy 2 (Duplicate for loop) */}
            {rowA.map((tech, idx) => (
              <span key={`a-2-${idx}`} className="px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 text-slate-800 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 (RTL) */}
        <div className="flex overflow-hidden w-full">
          <div ref={track2Ref} className="flex gap-4 pr-4 whitespace-nowrap will-change-transform">
            {/* Copy 1 */}
            {rowB.map((tech, idx) => (
              <span key={`b-1-${idx}`} className="px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 text-slate-800 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer">
                {tech}
              </span>
            ))}
            {/* Copy 2 (Duplicate for loop) */}
            {rowB.map((tech, idx) => (
              <span key={`b-2-${idx}`} className="px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-350 text-slate-800 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
