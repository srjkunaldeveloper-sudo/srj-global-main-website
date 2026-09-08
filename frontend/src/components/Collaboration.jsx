import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Code, 
  Rocket, 
  LineChart, 
  Globe, 
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import '../styles/collaboration.css';
import CollabHero from './CollabHero';

const COLLAB_DATA = [
  {
    id: 1,
    title: "Idea Validation & Consultation",
    description: "We refine, validate, and strategically plan your business idea before a single line of code is written. Every successful product starts with proper planning and market research.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    icon: <Lightbulb size={24} strokeWidth={1.5} />,
    items: [
      "Market Research",
      "Feasibility Analysis",
      "MVP Scope Definition"
    ]
  },
  {
    id: 2,
    title: "Custom Software Development",
    description: "We build mobile apps, websites, admin panels, CRM systems, SaaS platforms, and enterprise software using scalable architecture and future-ready technology stacks.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    icon: <Code size={24} strokeWidth={1.5} />,
    items: [
      "Mobile Apps & Websites",
      "Admin Panels & CRM",
      "SaaS & Enterprise Software"
    ]
  },
  {
    id: 3,
    title: "Startup Launch Support",
    description: "From MVP planning to go-to-market strategy, we help entrepreneurs launch successfully. We de-risk your launch with a proven product roadmap and execution framework.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    icon: <Rocket size={24} strokeWidth={1.5} />,
    items: [
      "MVP Planning",
      "Product Roadmap",
      "Go-to-Market Strategy"
    ]
  },
  {
    id: 4,
    title: "Business Strategy & Guidance",
    description: "Technology alone isn't enough. We provide business consultation, market positioning, revenue strategy, customer acquisition guidance, and digital transformation advice.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    icon: <LineChart size={24} strokeWidth={1.5} />,
    items: [
      "Business Consultation",
      "Revenue Strategy",
      "Digital Transformation"
    ]
  },
  {
    id: 5,
    title: "B2B & B2C Digital Solutions",
    description: "Expertise across B2B platforms, B2C applications, marketplace solutions, vendor systems, customer portals, and internal business automation tools.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    icon: <Globe size={24} strokeWidth={1.5} />,
    items: [
      "B2B / B2C Platforms",
      "Marketplaces & Portals",
      "Business Automation"
    ]
  },
  {
    id: 6,
    title: "Post-Launch Support & Growth",
    description: "We stay with you after launch. Technical maintenance, feature enhancements, bug fixes, performance monitoring, security updates, and dedicated long-term partnership.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    icon: <ShieldCheck size={24} strokeWidth={1.5} />,
    items: [
      "Maintenance & Support",
      "Feature Enhancements",
      "Long-Term Partnership"
    ]
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const Collaboration = () => {
  const navigate = useNavigate();
  const openCalendly = () => {
    window.location.href = "/#contact";
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="collab-page pt-4">
      
      {/* HERO SECTION */}
      <CollabHero />

      {/* CORE CAPABILITIES GRID */}
      <section className="collab-container">
        <motion.div 
          className="collab-section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <span className="section-label">OUR OFFERINGS</span>
          <h2>Collaboration Models</h2>
          <p>End-to-end technological and strategic support for your business.</p>
        </motion.div>

        <motion.div 
          className="collab-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {COLLAB_DATA.map((item) => (
            <motion.div key={item.id} className="collab-card" variants={fadeUp}>
              <div className="collab-card-content">
                <div className="collab-icon-wrap" style={{ width: '48px', height: '48px', marginBottom: '16px' }}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                
                <ul className="collab-list">
                  {item.items.map((subItem, index) => (
                    <li key={index} className="collab-list-item">
                      <CheckCircle2 size={18} className="collab-check" />
                      {subItem}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section className="collab-cta">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2>Ready to Transform Your Idea?</h2>
          <p>Let's build something extraordinary together. Connect with our engineering and strategy experts today.</p>
          <div className="collab-cta-btns">
            <button className="collab-btn-primary" onClick={() => openCalendly()}>
              Discuss Your Project <ArrowRight size={18} />
            </button>
            <button className="collab-btn-secondary" onClick={() => navigate('/services')}>
              Explore Services
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Collaboration;
