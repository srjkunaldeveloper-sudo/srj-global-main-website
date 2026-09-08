import { memo } from "react";
import "./AboutHeroSection.css";
import aboutus1 from "../../assets/aboutus1.jpg";

const AboutHeroSection = memo(function AboutHeroSection() {
  return (
    <section className="about-hero-section">
      <div className="about-hero-section__container">
        {/* Left — Text */}
        <div className="about-hero-section__content">
          <span className="about-hero-section__eyebrow">About Us</span>
          <h1 className="about-hero-section__title">
            We Build Digital Products That{" "}
            <span className="about-hero-section__accent">Drive Results</span>
          </h1>
          <p className="about-hero-section__desc">
            SRJ Global Technologies is a full-service technology company
            dedicated to helping businesses transform their ideas into powerful
            digital solutions. From web and mobile development to AI, cloud, and
            design — we deliver end-to-end engineering that scales.
          </p>
          <a href="#story" className="about-hero-section__btn">
            Our Story
          </a>
        </div>

        {/* Right — Image */}
        <div className="about-hero-section__image-wrapper">
          <img
            src={aboutus1}
            alt="Team collaboration"
            width={800}
            height={520}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="about-hero-section__img"
          />
        </div>
      </div>
    </section>
  );
});

export default AboutHeroSection;
