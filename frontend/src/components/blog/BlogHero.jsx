import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { FaBookOpen, FaEnvelope } from "react-icons/fa";

export default function BlogHero() {
  const containerRef = useRef(null);

  const headingText = "Insights That Help Businesses Build Better Digital Products";
  const words = headingText.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.left-fade-badge',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo('.blog-hero-word',
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, stagger: 0.12 },
        '-=0.3'
      )
      .fromTo('.left-fade-rest',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} style={{
      minHeight: "75vh",
      width: "100%",
      position: "relative",
      display: "flex",
      alignItems: "center",
      padding: "120px 24px 60px",
      overflow: "hidden",
      background: "#ffffff",
    }}>
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 pointer-events-none z-0" />

      {/* Ambient glows */}
      <div style={{
        position: "absolute",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "rgba(99, 102, 241, 0.05)",
        filter: "blur(180px)",
        top: "-100px",
        left: "-100px",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "rgba(139, 92, 246, 0.04)",
        filter: "blur(180px)",
        bottom: "-100px",
        right: "10%",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        position: "relative",
        zIndex: 2,
      }}>
        {/* Left Content */}
        <div>
          <div
            className="left-fade-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 mb-6 w-fit shadow-xs opacity-0"
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#0f172a",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0f172a" }}></span>
            Knowledge Center
          </div>

          <h1
            style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontSize: "clamp(34px, 5vw, 56px)",
              fontWeight: "800",
              color: "#000000",
              lineHeight: 1.15,
              marginBottom: "20px",
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ display: "block" }}>
              {words.slice(0, 3).map((word, idx) => (
                <span key={idx} className="blog-hero-word inline-block mr-3 opacity-0 select-none">{word}</span>
              ))}
            </span>
            <span style={{ display: "block", marginTop: "4px" }}>
              {words.slice(3, 6).map((word, idx) => {
                const isUnderlined = word === "Build" || word === "Better";
                return (
                  <span
                    key={idx}
                    className="blog-hero-word inline-block mr-3 opacity-0 select-none"
                    style={isUnderlined ? { textDecoration: "none", textDecorationColor: "#cbd5e1" } : {}}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
            <span style={{ display: "block", marginTop: "4px" }}>
              {words.slice(6).map((word, idx) => (
                <span key={idx} className="blog-hero-word inline-block mr-3 opacity-0 select-none">{word}</span>
              ))}
            </span>
          </h1>

          <p
            className="left-fade-rest opacity-0"
            style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontSize: "17px",
              lineHeight: 1.7,
              color: "#64748b",
              marginBottom: "36px",
              maxWidth: "520px",
            }}
          >
            Explore software engineering, AI, mobile development, startup strategy, cloud computing, cybersecurity, gaming, and digital transformation written by experienced professionals.
          </p>

          <div
            className="left-fade-rest opacity-0"
            style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}
          >
            <motion.a
              href="#blog-articles"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "16px 32px",
                background: "#0f172a",
                borderRadius: "14px",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "700",
                textDecoration: "none",
                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)",
                transition: "all 0.3s ease",
              }}
            >
              <FaBookOpen /> Explore Articles
            </motion.a>

            <motion.a
              href="#newsletter"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "16px 32px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                color: "#0f172a",
                fontSize: "15px",
                fontWeight: "700",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
            >
              <FaEnvelope /> Subscribe
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
