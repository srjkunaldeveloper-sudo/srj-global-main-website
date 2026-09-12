import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle,
  Users,
  Award,
  Shield,
  Clock,
  Sparkles,
  TrendingUp,
  BarChart2,
  Star,
  Target,
  Zap,
  Briefcase,
  Layers,
  Heart,
  Globe,
  Smile
} from 'lucide-react';
import api from '../config/api';
import { useSiteSettings } from '../context/SiteSettingsContext';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  checkcircle: CheckCircle,
  users: Users,
  award: Award,
  shield: Shield,
  clock: Clock,
  sparkles: Sparkles,
  trendingup: TrendingUp,
  barchart2: BarChart2,
  star: Star,
  target: Target,
  zap: Zap,
  briefcase: Briefcase,
  layers: Layers,
  heart: Heart,
  globe: Globe,
  smile: Smile
};

const COLOR_CLASSES = [
  'text-emerald-500',
  'text-blue-500',
  'text-amber-500',
  'text-violet-500',
  'text-rose-500',
  'text-cyan-500'
];

const renderStatIcon = (iconName, index) => {
  const normalized = (iconName || '').toLowerCase().trim();
  const IconComp = ICON_MAP[normalized] || Award;
  const colorClass = COLOR_CLASSES[index % COLOR_CLASSES.length];
  return <IconComp className={`${colorClass} w-6 h-6 mb-4`} />;
};

const STATIC_FALLBACK_STATS = [
  {
    id: 1,
    metric_key: 'projects_completed',
    target_value: 18000,
    prefix: null,
    suffix: '+',
    label: 'Projects Completed',
    icon_name: 'CheckCircle'
  },
  {
    id: 2,
    metric_key: 'happy_clients',
    target_value: 6000,
    prefix: null,
    suffix: '+',
    label: 'Happy Clients',
    icon_name: 'Users'
  },
  {
    id: 3,
    metric_key: 'years_experience',
    target_value: 19,
    prefix: null,
    suffix: '+',
    label: 'Years Experience',
    icon_name: 'Award'
  },
  {
    id: 4,
    metric_key: 'expert_support',
    target_value: 24,
    prefix: null,
    suffix: '/7',
    label: 'Expert Support',
    icon_name: 'Shield'
  }
];

export default function Stats() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const { getSetting } = useSiteSettings();
  const [statsList, setStatsList] = useState(STATIC_FALLBACK_STATS);

  const statsHeading = getSetting('stats_heading', 'Our Achievements');
  const statsSubtitle = getSetting('stats_subtitle', 'Delivering high-quality IT solutions with proven success and trusted by clients worldwide.');

  useEffect(() => {
    let isMounted = true;
    api.get('/company-stats')
      .then(res => {
        if (isMounted && res.data && res.data.success && Array.isArray(res.data.stats) && res.data.stats.length > 0) {
          setStatsList(res.data.stats);
        }
      })
      .catch(err => {
        console.warn('Using static fallback for company stats:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
      statsList.forEach((stat, idx) => {
        const counterEl = document.querySelector(`.counter-num-${idx}`);
        if (!counterEl) return;

        const targetVal = parseInt(stat.target_value, 10) || 0;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetVal,
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

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [statsList]);

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
            {statsHeading}
          </h2>
          <p className="achieve-header-el text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {statsSubtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsList.map((stat, idx) => (
            <div 
              key={stat.id || stat.metric_key || idx} 
              className="stat-card flex flex-col items-center justify-center p-8 bg-white border border-slate-150 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-xl hover:shadow-slate-900/[0.03] hover:border-slate-350 transition-all duration-300"
            >
              {renderStatIcon(stat.icon_name, idx)}
              <div className="text-4xl font-extrabold text-slate-900 mb-2 font-sans tracking-tight">
                {stat.prefix && <span>{stat.prefix}</span>}
                <span className={`counter-num-${idx}`}>0</span>
                {stat.suffix && <span>{stat.suffix}</span>}
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
