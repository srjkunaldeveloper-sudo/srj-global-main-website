import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function TechStack() {
  const gridRef = useRef(null);

  const technologies = [
    { name: 'React', desc: 'Frontend UI', icon: '⚛️' },
    { name: 'Next.js', desc: 'React Framework', icon: '▲' },
    { name: 'Node.js', desc: 'Runtime Server', icon: '🟢' },
    { name: '.NET', desc: 'Enterprise Backend', icon: '🌐' },
    { name: 'Python', desc: 'Data & AI Systems', icon: '🐍' },
    { name: 'Java', desc: 'Legacy & Microservices', icon: '☕' },
    { name: 'Flutter', desc: 'Cross-platform Mobile', icon: '📱' },
    { name: 'React Native', desc: 'Hybrid Mobile', icon: '⚛️' },
    { name: 'AWS', desc: 'Cloud Platform', icon: '☁️' },
    { name: 'Azure', desc: 'Enterprise Cloud', icon: '🔷' },
    { name: 'Docker', desc: 'Containerization', icon: '🐳' },
    { name: 'Kubernetes', desc: 'Orchestration', icon: '☸️' },
    { name: 'MongoDB', desc: 'Document Database', icon: '🍃' },
    { name: 'PostgreSQL', desc: 'Relational Database', icon: '🐘' },
    { name: 'Redis', desc: 'Caching & Queue', icon: '❤️' },
    { name: 'TypeScript', desc: 'Typed Javascript', icon: '🟦' },
    { name: 'Tailwind CSS', desc: 'Utility Styling', icon: '🎨' },
  ];

  useEffect(() => {
    const items = gridRef.current.children;
    gsap.fromTo(items,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <section
      id="technologies"
      className="py-24 bg-section-bg px-6 border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs uppercase tracking-wider mb-4 border border-slate-200">
            Tech Stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight mb-4">
            Modern & Scalable Technologies
          </h2>
          <p className="text-secondary-text text-base sm:text-lg">
            We use reliable frameworks, databases, and services to build fast, robust platforms.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center justify-center p-6 bg-white border border-border-light rounded-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-md hover:border-slate-800"
            >
              <span className="text-3xl mb-3 transform transition-transform duration-300 group-hover:scale-120 group-hover:rotate-6">
                {tech.icon}
              </span>
              <span className="font-sans font-bold text-sm text-primary-text">
                {tech.name}
              </span>
              <span className="font-sans text-[10px] text-slate-400 mt-1 uppercase tracking-wider text-center">
                {tech.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
