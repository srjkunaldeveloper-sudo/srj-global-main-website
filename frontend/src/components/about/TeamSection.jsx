import { useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import "./TeamSection.css";

const team = [
  {
    name: "John Anderson",
    role: "CEO",
    roleClass: "ceo",
    bio: "Leading innovation, strategy and global expansion across all verticals.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
    featured: true,
    online: true,
    verified: true,
    badge: "Team Lead",
    socials: { linkedin: "#", github: "#", twitter: "#", email: "#", web: "#" },
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    roleClass: "cto",
    bio: "Building scalable AI systems used by millions of users worldwide.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
    featured: false,
    online: true,
    verified: true,
    badge: "AI Expert",
    socials: { linkedin: "#", github: "#", twitter: "#", email: "#" },
  },
  {
    name: "David Park",
    role: "Senior Developer",
    roleClass: "dev",
    bio: "Full-stack architect crafting performant systems at enterprise scale.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    featured: false,
    online: false,
    verified: false,
    badge: null,
    socials: { linkedin: "#", github: "#", email: "#" },
  },
  {
    name: "Emily Rodriguez",
    role: "UI Designer",
    roleClass: "design",
    bio: "Crafting intuitive interfaces that delight users and drive conversions.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    featured: false,
    online: true,
    verified: false,
    badge: null,
    socials: { linkedin: "#", github: "#", twitter: "#" },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

function SpotlightCard({ member, index }) {
  const cardRef = useRef(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpot((s) => ({ ...s, active: false }));
  }, []);

  return (
    <motion.article
      ref={cardRef}
      className={`tm-card${member.featured ? " tm-card--featured" : ""}`}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor spotlight */}
      <div
        className="tm-card__spotlight"
        style={{
          background: spot.active
            ? `radial-gradient(320px circle at ${spot.x}px ${spot.y}px, rgba(108,99,255,0.08), transparent 60%)`
            : "none",
        }}
      />

      {/* Avatar */}
      <div className="tm-avatar">
        <div className="tm-avatar__ring" />
        <img
          className="tm-avatar__img"
          src={member.image}
          alt={`${member.name} -- ${member.role}`}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
        />
        <div className="tm-avatar__glow" />
      </div>

      {/* Name */}
      <h3 className="tm-card__name">{member.name}</h3>

      {/* Role Badge */}
      <span className={`tm-role tm-role--${member.roleClass}`}>{member.role}</span>

      {/* Bio */}
      <p className="tm-card__bio">{member.bio}</p>

      {/* Social Links */}
      <div className="tm-socials">
        {member.socials.linkedin && (
          <a href={member.socials.linkedin} className="tm-social" aria-label={`${member.name} LinkedIn`} target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        )}
        {member.socials.github && (
          <a href={member.socials.github} className="tm-social" aria-label={`${member.name} GitHub`} target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        )}
        {member.socials.twitter && (
          <a href={member.socials.twitter} className="tm-social" aria-label={`${member.name} Twitter`} target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        )}
        {member.socials.email && (
          <a href={member.socials.email} className="tm-social" aria-label={`${member.name} Email`}>
            <FaEnvelope />
          </a>
        )}
        {member.socials.web && (
          <a href={member.socials.web} className="tm-social" aria-label={`${member.name} Website`} target="_blank" rel="noopener noreferrer">
            <FaGlobe />
          </a>
        )}
      </div>

      {/* CTA */}
      <button className="tm-cta" aria-label={`View ${member.name} profile`}>
        View Profile <FaArrowRight className="tm-cta__arrow" />
      </button>
    </motion.article>
  );
}

export default function TeamSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section className="tm-section" ref={sectionRef} aria-labelledby="tm-heading">
      {/* Background effects */}
      <div className="tm-bg" aria-hidden="true">
        <div className="tm-bg__grid" />
        <div className="tm-bg__orb tm-bg__orb--1" />
        <div className="tm-bg__orb tm-bg__orb--2" />
        <div className="tm-bg__orb tm-bg__orb--3" />
        <div className="tm-bg__noise" />
        <div className="tm-bg__vignette" />
        <motion.div
          className="tm-float tm-float--1"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="tm-float tm-float--2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="tm-float tm-float--3"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="tm-float tm-float--4"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.div
          className="tm-float tm-float--5"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      </div>

      <div className="tm-wrap">
        {/* Header */}
        <motion.div
          className="tm-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <span className="tm-eyebrow">
            OUR TEAM
          </span>
          <h2 className="tm-heading" id="tm-heading">
            Meet the <span className="tm-heading__accent">Experts</span> Behind Our Success
          </h2>
          <p className="tm-sub">
            A passionate team of engineers, designers, strategists and innovators
            building exceptional digital experiences.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="tm-grid">
          {team.map((member, i) => (
            <SpotlightCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
