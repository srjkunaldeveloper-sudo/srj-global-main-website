import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { industryData } from "../config/industries";

import * as FaIcons from "react-icons/fa";
import "../styles/Industries.css";
import IndustriesHero from "./IndustriesHero";

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
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-60px" });
  const industriesList = [
    { id: 'startup', title: 'Business Startup', tagline: 'Launch your startup with confidence', icon: <FaIcons.FaRocket /> },
    { id: 'enterprise', title: 'Enterprise Service', tagline: 'Robust, scalable enterprise solutions', icon: <FaIcons.FaBuilding /> },
    { id: 'education', title: 'Education & Learning', tagline: 'Smart solutions for smart learners', icon: <FaIcons.FaGraduationCap /> },
    { id: 'ecommerce', title: 'Ecommerce & Retail', tagline: 'Scalable retail solutions', icon: <FaIcons.FaShoppingCart /> },
    { id: 'security', title: 'Cyber Security', tagline: 'Protect your digital assets', icon: <FaIcons.FaShieldAlt /> },
    { id: 'social', title: 'Social Networking', tagline: 'Connect your audience', icon: <FaIcons.FaUsers /> },
    { id: 'healthcare', title: 'Healthcare & Fitness', tagline: 'Build wellness with tech', icon: <FaIcons.FaHeartbeat /> },
    { id: 'events', title: 'Event & Ticket', tagline: 'Manage your events seamlessly', icon: <FaIcons.FaCalendarAlt /> },
    { id: 'food', title: 'Food & Beverage', tagline: 'Digitizing dining experiences', icon: <FaIcons.FaUtensils /> },
    { id: 'ticketing', title: 'Ticketing & Booking', tagline: 'Power travel and leisure', icon: <FaIcons.FaTicketAlt /> }
  ];

  return (
    <>
      <IndustriesHero />
      <section className="ij-section pt-10" aria-labelledby="ij-heading">
        <div className="ij-section-inner">

        {/* ── Cards Grid ──────────────────────────── */}
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
          {industriesList.map((item, i) => (
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
              <div className="ij-card__icon" aria-hidden="true">
                {item.icon}
              </div>
              <div className="ij-card__text">
                <h3 className="ij-card__title">{item.title}</h3>
                <p className="ij-card__tagline">{item.tagline}</p>
                <span className="ij-card__accent-line" aria-hidden="true" />
                <span className="ij-card__link">
                  Explore
                  <FaArrowRight className="ij-card__arrow" size={13} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
