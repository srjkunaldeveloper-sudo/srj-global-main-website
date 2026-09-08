import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

export default function Portfolio() {
  const containerRef = useRef(null);

  const projects = [
    {
      title: 'Aura Fintech Platform',
      category: 'Financial Technology',
      tags: ['React', 'Next.js', 'PostgreSQL'],
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Helios SaaS Dashboard',
      category: 'Enterprise SaaS',
      tags: ['TypeScript', 'Tailwind', 'AWS'],
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Zenith Mobile Wallet',
      category: 'Mobile Application',
      tags: ['React Native', 'Node.js', 'MongoDB'],
      img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Lumen AI Analytics',
      category: 'Artificial Intelligence',
      tags: ['Python', 'Docker', 'Kubernetes'],
      img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    },
  ];

  useEffect(() => {
    const cards = document.querySelectorAll('.portfolio-card');
    gsap.fromTo(cards,
      { y: 60, opacity: 0 },
      {
        y: 0,
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
  }, []);

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="py-24 bg-section-bg px-6 border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
              Our Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight mb-4">
              Featured Case Studies
            </h2>
            <p className="text-secondary-text text-base sm:text-lg max-w-xl">
              Discover how we architected scalable solutions that helped partners optimize workflow and grow revenue.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-black transition-colors shrink-0 group border-b border-slate-800 pb-1"
          >
            Start a project with us
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="portfolio-card group bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative overflow-hidden aspect-video bg-slate-50">
                <img
                  src={project.img}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover filter grayscale contrast-[1.05] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors duration-300" />
              </div>

              {/* Details Content */}
              <div className="p-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-primary-text mt-2 mb-4 group-hover:text-black transition-colors duration-200">
                  {project.title}
                </h3>
                
                {/* Tech tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100 text-xs font-medium text-secondary-text"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
