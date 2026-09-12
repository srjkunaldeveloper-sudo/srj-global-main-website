import React, { useEffect, useRef, useState } from 'react';
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
  Rocket,
  Cpu,
  Shield,
  Zap,
  Database,
  Sparkles,
  ArrowRight 
} from 'lucide-react';
import defaultProcessImage from '../assets/still-life-business-roles-with-various-mechanism-pieces.jpg';
import { useSiteSettings } from '../context/SiteSettingsContext';
import api from '../config/api';

gsap.registerPlugin(ScrollTrigger);

// Lucide Icon Mapping for CMS icon_name string
const ICON_MAP = {
  lightbulb: Lightbulb,
  search: Search,
  compass: Compass,
  palette: Palette,
  code2: Code2,
  flaskconical: FlaskConical,
  send: Send,
  trendingup: TrendingUp,
  maximize2: Maximize2,
  rocket: Rocket,
  cpu: Cpu,
  shield: Shield,
  zap: Zap,
  database: Database,
  sparkles: Sparkles
};

function renderProcessIcon(iconName, size = 16, className = "text-slate-800") {
  const normalizedKey = (iconName || '').toLowerCase();
  const IconComponent = ICON_MAP[normalizedKey] || Lightbulb;
  return <IconComponent size={size} className={className} />;
}

// Emergency Fallback Steps
const FALLBACK_STEPS = [
  { icon_name: "Lightbulb", title: "Idea", description: "We start by understanding your vision, goals, and the problem you want to solve." },
  { icon_name: "Search", title: "Consultation", description: "Strategic sessions to align on scope, market fit, and the right technology approach." },
  { icon_name: "Compass", title: "Planning", description: "Detailed roadmaps, architecture, and milestones that keep the build predictable." },
  { icon_name: "Palette", title: "Design", description: "User-centric interfaces and experiences crafted for clarity and conversion." },
  { icon_name: "Code2", title: "Development", description: "Clean, scalable code delivered in agile iterations with constant visibility." },
  { icon_name: "FlaskConical", title: "Testing", description: "Rigorous QA across devices and edge cases to guarantee a flawless experience." },
  { icon_name: "Send", title: "Launch", description: "A confident go-live with monitoring, optimization, and zero surprises." },
  { icon_name: "TrendingUp", title: "Growth", description: "Data-driven improvements that turn a launch into measurable momentum." },
  { icon_name: "Maximize2", title: "Scaling", description: "Future-proof infrastructure that grows smoothly with your business." }
];

export default function Process() {
  const { getSetting } = useSiteSettings();

  // CMS Section Settings (with static fallbacks)
  const processBadge = getSetting('process_badge', 'Our Process');
  const processTitle = getSetting('process_title', 'From Idea to Market Success');
  const processSubtitle = getSetting('process_subtitle', 'A clear, proven path that takes your concept from first sketch to a product your customers love — with strategy, craft, and partnership at every step.');
  const processCtaPrimaryText = getSetting('process_cta_primary_text', 'Start Your Project');
  const processCtaPrimaryUrl = getSetting('process_cta_primary_url', '#contact');
  const processCtaSecondaryText = getSetting('process_cta_secondary_text', 'Book a Consultation');
  const processCtaSecondaryUrl = getSetting('process_cta_secondary_url', '#contact');
  const rawProcessImageUrl = getSetting('process_image_url', '');
  const processImageUrl = (rawProcessImageUrl && !rawProcessImageUrl.startsWith('/src/assets/'))
    ? rawProcessImageUrl
    : defaultProcessImage;

  // Process Steps CMS Data State
  const [steps, setSteps] = useState(FALLBACK_STEPS);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const leftRef = useRef(null);

  // Fetch Steps from CMS API
  useEffect(() => {
    let isMounted = true;
    const fetchSteps = async () => {
      try {
        const res = await api.get('/process-steps');
        if (isMounted && res.data && res.data.success && Array.isArray(res.data.steps) && res.data.steps.length > 0) {
          setSteps(res.data.steps);
        }
      } catch (err) {
        // Fallback to static steps on error
        if (isMounted) {
          setSteps(FALLBACK_STEPS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSteps();
    return () => { isMounted = false; };
  }, []);

  // GSAP ScrollTrigger Animations (Re-initialized whenever steps finish loading)
  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      // Line growth animation using GSAP ScrollTrigger
      if (lineRef.current) {
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
      }

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
      if (leftRef.current) {
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
      }
    }, containerRef);

    // Refresh ScrollTrigger after DOM has settled
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => ctx.revert();
  }, [isLoading, steps]);

  return (
    <section ref={containerRef} className="py-24 px-6 bg-white overflow-hidden" id="process">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column - Heading & Image */}
        <div ref={leftRef} className="lg:col-span-5 flex flex-col h-full lg:sticky lg:top-28">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-3 block">
            {processBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            {processTitle}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 max-w-[420px]">
            {processSubtitle}
          </p>
          
          <div className="flex flex-wrap gap-3.5 mb-12">
            <a 
              href={processCtaPrimaryUrl} 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-slate-900/10"
            >
              {processCtaPrimaryText}
              <ArrowRight size={14} />
            </a>
            <a 
              href={processCtaSecondaryUrl} 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-sm border border-slate-200 font-bold transition-all duration-200 hover:-translate-y-0.5"
            >
              {processCtaSecondaryText}
            </a>
          </div>

          {/* Process illustration image */}
          <div className="w-full mt-auto rounded-3xl overflow-hidden shadow-xl shadow-slate-900/5 border border-slate-100 max-w-[420px]">
            <img 
              src={processImageUrl || defaultProcessImage} 
              alt={processTitle}
              className="w-full h-auto object-cover block"
              loading="lazy"
              onError={(e) => {
                e.target.src = defaultProcessImage;
              }}
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
                key={step.id || idx}
                className="process-step-card relative z-10 flex gap-4 sm:gap-6 items-center bg-white border border-slate-200/60 p-4.5 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.02)] hover:shadow-xl hover:shadow-slate-900/[0.04] hover:border-slate-350 hover:translate-x-1 transition-all duration-300"
              >
                {/* Step number badge */}
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-900 font-extrabold text-sm font-mono">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="flex-shrink-0 p-1 bg-slate-100/70 rounded-md">
                      {renderProcessIcon(step.icon_name)}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {step.title}
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
