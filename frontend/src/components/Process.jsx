import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Lightbulb, 
  Search, 
  Compass, 
  Palette, 
  Code2, 
  FlaskConical, 
  Send, 
  TrendingUp, 
  Maximize2, 
  ArrowRight 
} from 'lucide-react';
import processImage from '../assets/still-life-business-roles-with-various-mechanism-pieces.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function Process() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const leftRef = useRef(null);

  const steps = [
    { icon: <Lightbulb size={16} className="text-slate-800" />, label: "Idea", description: "We start by understanding your vision, goals, and the problem you want to solve." },
    { icon: <Search size={16} className="text-slate-800" />, label: "Consultation", description: "Strategic sessions to align on scope, market fit, and the right technology approach." },
    { icon: <Compass size={16} className="text-slate-800" />, label: "Planning", description: "Detailed roadmaps, architecture, and milestones that keep the build predictable." },
    { icon: <Palette size={16} className="text-slate-800" />, label: "Design", description: "User-centric interfaces and experiences crafted for clarity and conversion." },
    { icon: <Code2 size={16} className="text-slate-800" />, label: "Development", description: "Clean, scalable code delivered in agile iterations with constant visibility." },
    { icon: <FlaskConical size={16} className="text-slate-800" />, label: "Testing", description: "Rigorous QA across devices and edge cases to guarantee a flawless experience." },
    { icon: <Send size={16} className="text-slate-800" />, label: "Launch", description: "A confident go-live with monitoring, optimization, and zero surprises." },
    { icon: <TrendingUp size={16} className="text-slate-800" />, label: "Growth", description: "Data-driven improvements that turn a launch into measurable momentum." },
    { icon: <Maximize2 size={16} className="text-slate-800" />, label: "Scaling", description: "Future-proof infrastructure that grows smoothly with your business." }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line growth animation using GSAP ScrollTrigger
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: true
          }
        }
      );

      // Staggered entrance animation for process steps
      gsap.fromTo('.process-step-card',
        { opacity: 0, x: 25 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.process-steps-container',
            start: 'top 75%'
          }
        }
      );

      // Left column content entrance
      gsap.fromTo(leftRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%'
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-white overflow-hidden" id="process">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column - Heading & Image */}
        <div ref={leftRef} className="lg:col-span-5 flex flex-col h-full lg:sticky lg:top-28">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-3 block">
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            From Idea to Market Success
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-[420px]">
            A clear, proven path that takes your concept from first sketch to a product your customers love — with strategy, craft, and partnership at every step.
          </p>
          
          <div className="flex flex-wrap gap-3.5 mb-12">
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-slate-900/10"
            >
              Start Your Project
              <ArrowRight size={14} />
            </a>
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-sm border border-slate-200 font-bold transition-all duration-200 hover:-translate-y-0.5"
            >
              Book a Consultation
            </a>
          </div>

          {/* Process illustration image */}
          <div className="w-full mt-auto rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 border border-slate-100 max-w-[420px]">
            <img 
              src={processImage} 
              alt="Abstract representation of product scaling and market success"
              className="w-full h-auto object-cover block"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column - Steps Timeline */}
        <div className="lg:col-span-7 relative process-steps-container pl-10 sm:pl-14">
          {/* Timeline center line */}
          <div 
            ref={lineRef}
            className="absolute left-[38px] sm:left-[46px] top-6 bottom-6 w-[2px] bg-slate-200 origin-top z-0" 
            style={{ transformOrigin: 'top' }}
          />

          {/* Step Cards */}
          <div className="flex flex-col gap-4">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="process-step-card relative z-10 flex gap-4 sm:gap-6 items-center bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-xl hover:shadow-slate-900/[0.04] hover:border-slate-350 hover:translate-x-1 transition-all duration-300"
              >
                {/* Step number badge */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-900 font-extrabold text-sm font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="flex-shrink-0 p-1 bg-slate-100/70 rounded-md">{step.icon}</span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {step.label}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-[580px]">
                    {step.description}
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
