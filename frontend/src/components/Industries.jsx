import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  FaRocket,
  FaBuilding,
  FaGraduationCap,
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaHeartbeat,
  FaCalendarAlt,
  FaUtensils,
  FaTicketAlt,
  FaBriefcase,
  FaStore,
  FaArrowRight
} from "react-icons/fa";
import api from "../config/api";
import "../styles/Industries.css";
import IndustriesHero from "./IndustriesHero";

const ICON_MAP = {
  FaRocket,
  FaBuilding,
  FaGraduationCap,
  FaShoppingCart,
  FaShieldAlt,
  FaUsers,
  FaHeartbeat,
  FaCalendarAlt,
  FaUtensils,
  FaTicketAlt,
  FaBriefcase,
  FaStore
};

const renderIndustryIcon = (iconName) => {
  const IconComponent = ICON_MAP[iconName] || FaRocket;
  if (!ICON_MAP[iconName] && iconName) {
    console.warn(`[Industries CMS] Unknown icon name "${iconName}", falling back to default icon.`);
  }
  return <IconComponent />;
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.07,
      ease: [0.22, 0.61, 0.36, 1],
    },
  }),
};

export default function Industries() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });

  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await api.get('/industries');
        if (Array.isArray(res.data)) {
          setIndustries(res.data);
        } else if (res.data && Array.isArray(res.data.industries)) {
          setIndustries(res.data.industries);
        } else {
          setIndustries([]);
        }
      } catch (err) {
        console.error("Error fetching public industries:", err);
        setError(true);
        setIndustries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  // Hide section completely if loading is finished and there are no active industries or API error
  if (!loading && (industries.length === 0 || error)) {
    return null;
  }

  return (
    <>
      <IndustriesHero />
      <section className="ij-section pt-10" aria-labelledby="ij-heading">
        <div className="ij-section-inner">

        {/* ── Cards Grid Header ──────────────────────────── */}
        <div className="ij-grid-header" id="ij-cards">
          <motion.h1
            className="ij-grid-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Explore Our Industry Expertise
          </motion.h1>
          <motion.p
            className="ij-grid-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Tailored digital solutions for every sector
          </motion.p>
        </div>

        <div className="ij-grid" ref={cardsRef}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ij-card animate-pulse" style={{ opacity: 0.6 }}>
                <div className="ij-card__icon bg-slate-200 rounded-full w-10 h-10" />
                <div className="ij-card__text w-full space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
              </div>
            ))
          ) : (
            industries.map((item, i) => (
              <motion.article
                key={item.id}
                className="ij-card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                onClick={() => navigate(`/industries/${item.id}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/industries/${item.id}`);
                  }
                }}
              >
                <div 
                  className="ij-card__icon" 
                  aria-hidden="true"
                  style={item.color ? { color: item.color } : undefined}
                >
                  {renderIndustryIcon(item.icon)}
                </div>
                <div className="ij-card__text">
                  <h3 className="ij-card__title">{item.title}</h3>
                  <p className="ij-card__tagline">{item.subtitle || item.tagline}</p>
                  <span 
                    className="ij-card__accent-line" 
                    aria-hidden="true" 
                    style={item.color ? { backgroundColor: item.color } : undefined}
                  />
                  <span className="ij-card__link">
                    Explore
                    <FaArrowRight className="ij-card__arrow" size={13} />
                  </span>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
    </>
  );
}

