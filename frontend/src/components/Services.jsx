import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Lightbulb, Code, Rocket, TrendingUp, Network, Headset } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const premiumServices = [
  {
    id: 1,
    title: "Idea Validation & Consultation",
    description: "We refine, validate, and strategically plan your business idea before a single line of code is written. Every successful product starts with proper planning and market research.",
    tags: ["Market Research", "Feasibility Analysis", "MVP Scope Definition"],
    icon: "Lightbulb"
  },
  {
    id: 2,
    title: "Custom Software Development",
    description: "We build mobile apps, websites, admin panels, CRM systems, SaaS platforms, and enterprise software using scalable architecture and future-ready technology stacks.",
    tags: ["Mobile Apps & Websites", "Admin Panels & CRM", "SaaS & Enterprise Software"],
    icon: "Code"
  },
  {
    id: 3,
    title: "Startup Launch Support",
    description: "From MVP planning to go-to-market strategy, we help entrepreneurs launch successfully. We de-risk your launch with a proven product roadmap and execution framework.",
    tags: ["MVP Planning", "Product Roadmap", "Go-to-Market Strategy"],
    icon: "Rocket"
  },
  {
    id: 4,
    title: "Business Strategy & Market Guidance",
    description: "Technology alone isn't enough. We provide business consultation, market positioning, revenue strategy, customer acquisition guidance, and digital transformation advice.",
    tags: ["Business Consultation", "Revenue Strategy", "Digital Transformation"],
    icon: "TrendingUp"
  },
  {
    id: 5,
    title: "B2B & B2C Digital Solutions",
    description: "Expertise across B2B platforms, B2C applications, marketplace solutions, vendor systems, customer portals, and internal business automation tools.",
    tags: ["B2B / B2C Platforms", "Marketplaces & Portals", "Business Automation"],
    icon: "Network"
  },
  {
    id: 6,
    title: "Post-Launch Support & Growth",
    description: "We stay with you after launch. Technical maintenance, feature enhancements, bug fixes, performance monitoring, security updates, and dedicated long-term partnership.",
    tags: ["Maintenance & Support", "Feature Enhancements", "Long-Term Partnership"],
    icon: "Headset"
  }
];

export default function Services() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const [services, setServices] = React.useState(premiumServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/services`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          const formattedDbServices = res.data.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.short_description || s.full_description || s.description,
            tags: [s.category_id || "Custom Solution"],
            icon: s.icon && LucideIcons[s.icon] ? s.icon : "LayoutGrid",
          }));

          // Prepend dynamic DB services to the top of homepage services
          setServices([...formattedDbServices, ...premiumServices]);
        }
      } catch (err) {
        console.error("Error fetching homepage services:", err);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const cards = gridRef.current.children;
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
  }, []);

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
      </div>
    </section>
  );
}
