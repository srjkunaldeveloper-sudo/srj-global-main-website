import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaEnvelope,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";
import api from "../../config/api";
import "./TeamSection.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] },
  }),
};

const isValidSocialLink = (val) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (!trimmed || trimmed === '#' || trimmed.toLowerCase() === 'javascript:void(0)') return false;
  return true;
};

const getEmailHref = (val) => {
  if (!isValidSocialLink(val)) return null;
  const trimmed = val.trim();
  if (trimmed.startsWith('mailto:')) return trimmed;
  if (trimmed.includes('@')) return `mailto:${trimmed}`;
  return null;
};

const getUrlHref = (val) => {
  if (!isValidSocialLink(val)) return null;
  const trimmed = val.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
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

  const roleClass = member.role_class || member.roleClass || 'dev';
  const isFeatured = !!member.featured;
  const avatarImage = member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

  const linkedinHref = getUrlHref(member.linkedin);
  const githubHref = getUrlHref(member.github);
  const twitterHref = getUrlHref(member.twitter);
  const emailHref = getEmailHref(member.email);
  const websiteHref = getUrlHref(member.website || member.web);

  return (
    <motion.article
      ref={cardRef}
      className={`tm-card${isFeatured ? " tm-card--featured" : ""}`}
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
          src={avatarImage}
          alt={`${member.name} -- ${member.role}`}
          loading={index < 4 ? "eager" : "lazy"}
          decoding="async"
        />
        <div className="tm-avatar__glow" />
      </div>

      {/* Name */}
      <h3 className="tm-card__name">{member.name}</h3>

      {/* Role Badge */}
      <span className={`tm-role tm-role--${roleClass}`}>{member.role}</span>

      {/* Bio */}
      <p className="tm-card__bio">{member.bio}</p>

      {/* Social Links */}
      <div className="tm-socials">
        {linkedinHref && (
          <a href={linkedinHref} className="tm-social" aria-label={`${member.name} LinkedIn`} target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
        )}
        {githubHref && (
          <a href={githubHref} className="tm-social" aria-label={`${member.name} GitHub`} target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        )}
        {twitterHref && (
          <a href={twitterHref} className="tm-social" aria-label={`${member.name} Twitter`} target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        )}
        {emailHref && (
          <a href={emailHref} className="tm-social" aria-label={`${member.name} Email`}>
            <FaEnvelope />
          </a>
        )}
        {websiteHref && (
          <a href={websiteHref} className="tm-social" aria-label={`${member.name} Website`} target="_blank" rel="noopener noreferrer">
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await api.get("/team");
        if (res.data && res.data.success && Array.isArray(res.data.team)) {
          setTeamMembers(res.data.team);
        } else if (Array.isArray(res.data)) {
          setTeamMembers(res.data);
        } else {
          setTeamMembers([]);
        }
      } catch (err) {
        console.error("Error fetching active team members:", err);
        setError(true);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <section className="tm-section" ref={sectionRef} aria-labelledby="tm-heading">
        <div className="tm-wrap">
          <div className="tm-header">
            <span className="tm-eyebrow">OUR TEAM</span>
            <h2 className="tm-heading" id="tm-heading">
              Meet the <span className="tm-heading__accent">Experts</span> Behind Our Success
            </h2>
            <p className="tm-sub">
              A passionate team of engineers, designers, strategists and innovators
              building exceptional digital experiences.
            </p>
          </div>
          <div className="tm-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="tm-card animate-pulse" style={{ minHeight: "360px", opacity: 0.6 }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!loading && (teamMembers.length === 0 || error)) {
    return null;
  }

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
          <span className="tm-eyebrow">OUR TEAM</span>
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
          {teamMembers.map((member, i) => (
            <SpotlightCard key={member.id || member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
