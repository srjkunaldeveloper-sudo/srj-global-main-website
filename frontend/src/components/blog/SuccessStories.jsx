import { motion } from "framer-motion";
import { FaStar, FaArrowRight, FaCheck, FaIndustry } from "react-icons/fa";

export default function SuccessStories({ stories }) {
  if (!stories || stories.length === 0) return null;

  return (
    <section style={{
      padding: "80px 24px",
      background: "#ffffff",
      borderTop: "1px solid #f1f5f9",
      borderBottom: "1px solid #f1f5f9",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "56px" }}
        >
          <div style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#000000",
            marginBottom: "16px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Proven Results
          </div>
          <h2 style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: "800",
            color: "#000000",
            lineHeight: 1.2,
            marginBottom: "12px",
            letterSpacing: "-0.03em",
          }}>
            Client{" "}
            <span style={{
              color: "#000000",
              textDecoration: "none",
              textDecorationColor: "#cbd5e1",
            }}>
              Success Stories
            </span>
          </h2>
          <p style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            fontSize: "16px",
            color: "#64748b",
            maxWidth: "560px",
            margin: "0 auto",
          }}>
            Real transformations backed by measurable outcomes from our enterprise engagements.
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
          gap: "24px",
        }} className="blog-stories-grid">
          {stories.map((story, index) => (
            <motion.article
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              style={{
                padding: "32px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "24px",
                transition: "all 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0f172a";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(0, 0, 0, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}>
                <div>
                  <h3 style={{
                    fontFamily: "'Geist Sans', 'Inter', sans-serif",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#0f172a",
                    marginBottom: "4px",
                  }}>
                    {story.title}
                  </h3>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#64748b",
                  }}>
                    <FaIndustry style={{ fontSize: "12px" }} /> {story.industry}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <FaStar key={i} style={{ color: "#f59e0b", fontSize: "14px" }} />
                  ))}
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "20px",
              }}>
                <div style={{
                  padding: "16px",
                  background: "rgba(239, 68, 68, 0.03)",
                  border: "1px solid rgba(239, 68, 68, 0.08)",
                  borderRadius: "12px",
                }}>
                  <div style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#ef4444",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}>
                    Before
                  </div>
                  <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#475569" }}>
                    {story.before}
                  </p>
                </div>
                <div style={{
                  padding: "16px",
                  background: "rgba(34, 197, 94, 0.03)",
                  border: "1px solid rgba(34, 197, 94, 0.08)",
                  borderRadius: "12px",
                }}>
                  <div style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#22c55e",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "6px",
                  }}>
                    After
                  </div>
                  <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#475569" }}>
                    {story.after}
                  </p>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
                marginBottom: "20px",
              }} className="blog-results-grid">
                {story.results.map((result, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "'Geist Sans', 'Inter', sans-serif",
                      fontSize: "18px",
                      fontWeight: "800",
                      color: "#22c55e",
                      marginBottom: "4px",
                    }}>
                      {result.value}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      {result.metric}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "16px",
              }}>
                {story.technologies.map((tech, i) => (
                  <span key={i} style={{
                    padding: "4px 10px",
                    background: "rgba(0, 0, 0, 0.03)",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#475569",
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderTop: "1px solid #e2e8f0",
              }}>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  Client: {story.client}
                </span>
                <motion.span
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#000000",
                    cursor: "pointer",
                  }}
                >
                  View Case Study <FaArrowRight style={{ fontSize: "11px" }} />
                </motion.span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 580px) {
          .blog-stories-grid {
            grid-template-columns: 1fr !important;
          }
          .blog-results-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
