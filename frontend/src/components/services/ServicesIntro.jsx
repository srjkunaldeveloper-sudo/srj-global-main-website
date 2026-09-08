import Reveal from "./Reveal";

export default function ServicesIntro() {
  return (
    <section className="services-intro">
      <div className="services-container">
        <Reveal>
          <span className="services-eyebrow services-eyebrow--no-line" style={{ justifyContent: "center" }}>
            The SRJ Ecosystem
          </span>
        </Reveal>
        <Reveal style={{ transitionDelay: "0.05s" }}>
          <h2 className="services-title">
            Everything You Need to Build, Scale, and Transform
          </h2>
        </Reveal>
        <Reveal style={{ transitionDelay: "0.1s" }}>
          <p className="services-lede">
            Explore our complete range of technology services designed to help
            businesses turn ideas into powerful digital products.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
