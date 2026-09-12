import Reveal from "./Reveal";
import { useSiteSettings } from "../../context/SiteSettingsContext";

export default function ServicesIntro() {
  const { getSetting } = useSiteSettings();

  const introBadge = getSetting("services_intro_badge", "The SRJ Ecosystem");
  const introTitle = getSetting("services_intro_title", "Everything You Need to Build, Scale, and Transform");
  const introDescription = getSetting(
    "services_intro_description",
    "Explore our complete range of technology services designed to help businesses turn ideas into powerful digital products."
  );

  return (
    <section className="services-intro">
      <div className="services-container">
        <Reveal>
          <span className="services-eyebrow services-eyebrow--no-line" style={{ justifyContent: "center" }}>
            {introBadge}
          </span>
        </Reveal>
        <Reveal style={{ transitionDelay: "0.05s" }}>
          <h2 className="services-title">
            {introTitle}
          </h2>
        </Reveal>
        <Reveal style={{ transitionDelay: "0.1s" }}>
          <p className="services-lede">
            {introDescription}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

