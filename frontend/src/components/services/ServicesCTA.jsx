import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function ServicesCTA() {
  const openCalendly = () => {
    window.location.href = "/#contact";
  };
  return (
    <section className="services-cta">
      <div className="services-container">
        <Reveal>
          <h2>
            Have a <span className="accent">Technology Challenge?</span>
          </h2>
        </Reveal>
        <Reveal style={{ transitionDelay: "0.05s" }}>
          <p>Let's build the right solution for your business.</p>
        </Reveal>
        <Reveal className="services-cta__actions" style={{ transitionDelay: "0.1s" }}>
          <button onClick={() => openCalendly()} className="services-btn services-btn--primary" style={{ border: "none", cursor: "pointer" }}>
            Start a Conversation <span className="arrow">→</span>
          </button>
          <Link to="/pricing" className="services-btn services-btn--ghost">
            View Pricing
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
