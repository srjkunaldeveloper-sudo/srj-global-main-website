import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const containerRef = useRef(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/portfolio`);
        if (res.data && res.data.success && Array.isArray(res.data.portfolio)) {
          setPortfolio(res.data.portfolio);
        } else if (Array.isArray(res.data)) {
          setPortfolio(res.data);
        } else {
          setPortfolio([]);
        }
      } catch (err) {
        console.error('Error fetching active portfolio:', err);
        setError(true);
        setPortfolio([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (loading || portfolio.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll('.portfolio-card');
      if (cards.length > 0) {
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
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, portfolio]);

  // If API has loaded and there are no active projects (or error), hide section gracefully
  if (!loading && (portfolio.length === 0 || error)) {
    return null;
  }

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
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-video bg-slate-200 w-full" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-5 w-16 bg-slate-200 rounded" />
                    <div className="h-5 w-16 bg-slate-200 rounded" />
                    <div className="h-5 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            portfolio.map((project, idx) => {
              const CardContent = (
                <div
                  className="portfolio-card group bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Container */}
                    <div className="relative overflow-hidden aspect-video bg-slate-100 flex items-center justify-center">
                      {project.image && typeof project.image === 'string' ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover filter grayscale contrast-[1.05] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-semibold">
                          {project.title}
                        </div>
                      )}
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
                      {Array.isArray(project.tags) && project.tags.length > 0 && (
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
                      )}
                    </div>
                  </div>
                </div>
              );

              if (project.project_url) {
                return (
                  <a
                    key={project.id || idx}
                    href={project.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-left"
                  >
                    {CardContent}
                  </a>
                );
              }

              return <div key={project.id || idx}>{CardContent}</div>;
            })
          )}
        </div>
      </div>
    </section>
  );
}
