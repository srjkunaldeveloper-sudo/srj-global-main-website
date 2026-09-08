import { motion } from "framer-motion";
import aboutus1 from "../../assets/aboutus1.jpg";
import aboutus2 from "../../assets/aboutus2.jpg";
import aboutus3 from "../../assets/aboutus3.jpg";
import "./RecognizedBySection.css";

const pressLogos = [
  {
    name: "Hindustan Times",
    render: () => (
      <span className="rb-logo rb-logo--ht">
        <span className="rb-logo__ht-hindustan">hindustan</span>
        <span className="rb-logo__ht-times">times</span>
      </span>
    ),
  },
  {
    name: "MarketWatch",
    render: () => (
      <span className="rb-logo rb-logo--marketwatch">MarketWatch</span>
    ),
  },
  {
    name: "Business Insider",
    render: () => (
      <span className="rb-logo rb-logo--bi">
        <span>BUSINESS</span>
        <span>INSIDER</span>
      </span>
    ),
  },
  {
    name: "Benzinga",
    render: () => (
      <span className="rb-logo rb-logo--benzinga">BENZINGA</span>
    ),
  },
  {
    name: "Yahoo!",
    render: () => (
      <span className="rb-logo rb-logo--yahoo">Yahoo!</span>
    ),
  },
  {
    name: "FOX",
    render: () => (
      <span className="rb-logo rb-logo--fox">FOX</span>
    ),
  },
  {
    name: "Morningstar",
    render: () => (
      <span className="rb-logo rb-logo--morningstar">
        <span className="rb-logo__ms-icon">☉</span>
        Morningstar
      </span>
    ),
  },
  {
    name: "CBS",
    render: () => (
      <span className="rb-logo rb-logo--cbs">
        <svg className="rb-logo__cbs-eye" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2C10.06 2 2 10.06 2 18s8.06 16 18 16 18-8.06 18-16S29.94 2 20 2z" fill="#005eb8" />
          <circle cx="20" cy="18" r="7" fill="#fff" />
          <circle cx="20" cy="18" r="4" fill="#000" />
        </svg>
        CBS
      </span>
    ),
  },
];

const collageItems = [
  {
    type: "newspaper",
    rotation: -5,
    position: "back",
    style: { top: "0", left: "0", zIndex: 1 },
  },
  {
    type: "certificate",
    rotation: 4,
    position: "middle",
    style: { top: "-10px", right: "0", zIndex: 2 },
  },
  {
    type: "photo",
    rotation: -3,
    position: "front",
    style: { bottom: "0", left: "10px", zIndex: 3 },
    src: aboutus1,
    alt: "Team receiving award on stage",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function RecognizedBySection() {
  return (
    <section className="rb-section">
      {/* Background dot pattern */}
      <div className="rb-section__dots" aria-hidden="true" />

      <div className="rb-section__container">
        {/* Left column — heading + logo grid */}
        <motion.div
          className="rb-section__left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2 className="rb-section__heading" variants={itemVariants}>
            Recognized By The Best
          </motion.h2>

          <motion.div className="rb-section__logos" variants={containerVariants}>
            {pressLogos.map((logo) => (
              <motion.div
                key={logo.name}
                className="rb-section__logo-cell"
                variants={itemVariants}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {logo.render()}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right column — image collage */}
        <motion.div
          className="rb-section__right"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="rb-collage">
            {/* Decorative red circle */}
            <div className="rb-collage__circle" aria-hidden="true" />

            {/* Newspaper clipping */}
            <div
              className="rb-collage__item rb-collage__item--newspaper"
              style={{
                transform: `rotate(${collageItems[0].rotation}deg)`,
                ...collageItems[0].style,
              }}
            >
              <div className="rb-newspaper">
                <div className="rb-newspaper__header">
                  <div className="rb-newspaper__line rb-newspaper__line--short" />
                  <div className="rb-newspaper__date">Vol. XII — Issue 47</div>
                </div>
                <h3 className="rb-newspaper__headline">CELEBRATING BRILLIANCE</h3>
                <div className="rb-newspaper__sub">in Technology &amp; Innovation</div>
                <div className="rb-newspaper__body">
                  <div className="rb-newspaper__col">
                    <div className="rb-newspaper__text-line" />
                    <div className="rb-newspaper__text-line rb-newspaper__text-line--short" />
                    <div className="rb-newspaper__text-line" />
                    <div className="rb-newspaper__text-line rb-newspaper__text-line--medium" />
                  </div>
                  <div className="rb-newspaper__col">
                    <div className="rb-newspaper__text-line" />
                    <div className="rb-newspaper__text-line rb-newspaper__text-line--short" />
                    <div className="rb-newspaper__text-line" />
                    <div className="rb-newspaper__text-line rb-newspaper__text-line--medium" />
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate */}
            <div
              className="rb-collage__item rb-collage__item--certificate"
              style={{
                transform: `rotate(${collageItems[1].rotation}deg)`,
                ...collageItems[1].style,
              }}
            >
              <div className="rb-certificate">
                <div className="rb-certificate__frame">
                  <div className="rb-certificate__inner">
                    <div className="rb-certificate__seal">★</div>
                    <div className="rb-certificate__title">Certificate of Excellence</div>
                    <div className="rb-certificate__line" />
                    <div className="rb-certificate__recipient">SRJ Global Technologies</div>
                    <div className="rb-certificate__desc">
                      For outstanding contribution to digital innovation
                    </div>
                    <div className="rb-certificate__line rb-certificate__line--short" />
                  </div>
                </div>
              </div>
            </div>

            {/* Event photo */}
            <div
              className="rb-collage__item rb-collage__item--photo"
              style={{
                transform: `rotate(${collageItems[2].rotation}deg)`,
                ...collageItems[2].style,
              }}
            >
              <img
                src={collageItems[2].src}
                alt={collageItems[2].alt}
                className="rb-collage__img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
