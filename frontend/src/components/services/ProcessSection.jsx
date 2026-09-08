import Reveal from "./Reveal";
import { processSteps } from "../../data/servicesData";

export default function ProcessSection() {
  return (
    <section className="services-process">
      <div className="services-container">
        <Reveal className="services-process__head">
          <span
            className="services-eyebrow services-eyebrow--no-line"
            style={{ justifyContent: "center", color: "#ffffff" }}
          >
            How We Work
          </span>
          <h2 className="services-title">
            How We Turn Ideas Into <span className="accent">Digital Solutions</span>
          </h2>
          <p className="services-lede">
            A clear, proven path from first conversation to a product your
            customers love.
          </p>
        </Reveal>

        <Reveal className="services-process__track" style={{ transitionDelay: "0.05s" }}>
          {processSteps.map((step) => (
            <div className="services-step" key={step.num}>
              <div className="services-step__dot">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
