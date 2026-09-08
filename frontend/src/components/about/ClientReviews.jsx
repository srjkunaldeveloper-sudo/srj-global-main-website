import { useEffect, useRef, useState } from "react";
import "./ClientReviews.css";

const reviews = [
  {
    text: "SRJ Global Technologies completely transformed our website. The performance is incredibly fast, and their team was extremely professional throughout the process.",
    name: "Rajesh Kumar",
    role: "CEO, FinTech India",
    initials: "RK",
  },
  {
    text: "We hired them for SEO and app development. Within 3 months, our organic traffic increased by 150%, and the mobile app has received excellent feedback from users.",
    name: "Sarah Jenkins",
    role: "Marketing Director, HealthCo",
    initials: "SJ",
  },
  {
    text: "Their UI/UX design work was outstanding. They created a highly interactive, modern interface that reduced user friction by 40%. Highly recommend!",
    name: "Amit Sharma",
    role: "Founder, EduSmart",
    initials: "AS",
  },
];

export default function ClientReviews() {
  const cardsRef = useRef([]);

  /* ---------- fade-in on scroll ---------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cr-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ---------- mobile swipe (optional carousel feel) ---------- */
  const scrollRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="cr-section" aria-label="Client Reviews">
      <div className="cr-container">
        {/* Heading */}
        <h2 className="cr-heading">What Our Clients Say</h2>
        <p className="cr-subheading">
          Trusted by businesses across industries
        </p>

        {/* Cards / Carousel */}
        <div
          className={`cr-grid${isMobile ? " cr-carousel" : ""}`}
          ref={scrollRef}
          role="list"
        >
          {reviews.map((r, i) => (
            <article
              key={i}
              className="cr-card cr-hidden"
              ref={(el) => (cardsRef.current[i] = el)}
              role="listitem"
              aria-label={`Review by ${r.name}`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* decorative quote */}
              <span className="cr-quote" aria-hidden="true">
                &ldquo;
              </span>

              {/* review text */}
              <p className="cr-text">{r.text}</p>

              {/* star rating */}
              <div className="cr-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg
                    key={s}
                    className="cr-star"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* reviewer info */}
              <div className="cr-reviewer">
                <div className="cr-avatar" aria-hidden="true">
                  {r.initials}
                </div>
                <div>
                  <span className="cr-name">{r.name}</span>
                  <span className="cr-role">{r.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
