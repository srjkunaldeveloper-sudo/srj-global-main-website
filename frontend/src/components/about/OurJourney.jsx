import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import "./OurJourney.css";

const milestones = [
  {
    year: "1992",
    title: "Foundation of SRJ Group",
    desc: "SRJ Group was founded with a vision to create a diversified business ecosystem focused on innovation, growth, and long-term impact across industries.",
  },
  {
    year: "2000",
    title: "Expansion Into Multiple Industries",
    desc: "The group expanded its presence into technology, infrastructure, business consulting, and enterprise services, building a strong foundation for future growth.",
  },
  {
    year: "2008",
    title: "Launch of SRJ Global Softech",
    desc: "SRJ Global Softech was established to deliver advanced software solutions, digital transformation services, and enterprise technology innovations.",
  },
  {
    year: "2015",
    title: "Healthcare & Pharma Initiatives",
    desc: "SRJ Group entered the healthcare and pharmaceutical sectors with a focus on wellness, medical solutions, and future-ready healthcare technologies.",
  },
  {
    year: "2020",
    title: "Digital Platform Revolution",
    desc: "The group accelerated its digital transformation journey by launching innovative platforms, smart enterprise systems, and technology-driven business solutions.",
  },
  {
    year: "2023",
    title: "Launch of JobNest",
    desc: "JobNest was introduced as an AI-powered recruitment and job platform connecting job seekers with top companies across multiple industries.",
  },
  {
    year: "2025",
    title: "Global Brand Ecosystem",
    desc: "SRJ Group expanded into a powerful ecosystem of 38+ companies with growing national and international operations across diverse business sectors.",
  },
  {
    year: "2026",
    title: "Launch of LookBook & HubNest",
    desc: "SRJ Group launched LookBook, a modern digital commerce and mobility platform, along with HubNest, an innovative business and workforce management ecosystem designed for modern enterprises.",
    active: true,
  },
];

export default function OurJourney() {
  const timelineRef = useRef(null);
  const lineFillRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!timelineRef.current || !lineFillRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const totalH = rect.height;
    const scrolled = Math.max(0, viewportH - rect.top);
    const progress = Math.min(1, scrolled / totalH);
    lineFillRef.current.style.height = `${progress * totalH}px`;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section className="oj-section" aria-labelledby="oj-heading">
      <div className="oj-section__dots" aria-hidden="true" />

      <header className="oj-header">
        <motion.span
          className="oj-header__eyebrow"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Our Journey
        </motion.span>
        <motion.h2
          id="oj-heading"
          className="oj-header__title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          viewport={{ once: true }}
        >
          The Journey of Our Company
        </motion.h2>
        <motion.p
          className="oj-header__sub"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          viewport={{ once: true }}
        >
          From a single vision in 1992 to a 38+ company global ecosystem
        </motion.p>
      </header>

      <div className="oj-timeline" ref={timelineRef}>
        <div className="oj-timeline__line" aria-hidden="true" />
        <div className="oj-timeline__line-fill" ref={lineFillRef} aria-hidden="true" />

        {milestones.map((m, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          return (
            <div
              key={m.year}
              className={`oj-entry oj-entry--${side}`}
            >
              <div className="oj-connector" aria-hidden="true" />

              <div className={`oj-node${m.active ? " oj-node--active" : ""}`} aria-hidden="true">
                {m.active && <span className="oj-node__label">Now</span>}
              </div>

              <motion.div
                className="oj-reveal"
                initial={{ opacity: 0, x: side === "left" ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true, margin: "-60px" }}
                style={{ width: "100%", maxWidth: "420px" }}
              >
                <article className="oj-card">
                  <span className="oj-card__ghost" aria-hidden="true">
                    {m.year}
                  </span>
                  <span
                    className={`oj-card__year${m.active ? " oj-card__year--active" : ""}`}
                  >
                    {m.year}
                  </span>
                  <h3 className="oj-card__title">{m.title}</h3>
                  <p className="oj-card__desc">{m.desc}</p>
                </article>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
