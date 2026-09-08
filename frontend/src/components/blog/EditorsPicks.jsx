import { motion } from "framer-motion";
import { FaClock, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function EditorsPicks({ articles }) {
  const navigate = useNavigate();
  if (!articles || articles.length === 0) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section style={{
      padding: "80px 24px",
      background: "#ffffff",
      color: "#0f172a",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "48px" }}
        >
          <div style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#000000",
            marginBottom: "16px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Curated Excellence
          </div>
          <h2 style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: "800",
            color: "#0f172a",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
          }}>
            Editor's{" "}
            <span style={{
              color: "#000000",
              textDecoration: "none",
              textDecorationColor: "#cbd5e1",
            }}>
              Picks
            </span>
          </h2>
          <p style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            fontSize: "16px",
            color: "#64748b",
            marginTop: "8px",
            maxWidth: "560px",
          }}>
            Deeply researched, thoughtfully written articles hand-selected by our editorial team.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: index % 2 === 0 ? "1.2fr 1fr" : "1fr 1.2fr",
                gap: "40px",
                alignItems: "center",
                padding: "32px",
                background: "#f8fafc",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
              }}
              className="blog-editor-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
              onClick={() => navigate(`/blog/${article.id}`)}
            >
              <div
                style={{
                  order: index % 2 === 0 ? 0 : 1,
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/blog/${article.id}`)}
              >
                <img
                  src={article.coverImage}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "280px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    background: "#e2e8f0",
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                />
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  padding: "5px 12px",
                  background: "#0f172a",
                  borderRadius: "50px",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#ffffff",
                }}>
                  Editor's Pick
                </div>
              </div>

              <div style={{ order: index % 2 === 0 ? 1 : 0 }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}>
                  <span style={{
                    padding: "5px 12px",
                    background: "rgba(15, 23, 42, 0.05)",
                    borderRadius: "50px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#0f172a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}>
                    {article.category.replace(/-/g, " ")}
                  </span>
                  <span style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}>
                    <FaClock style={{ fontSize: "11px" }} /> {article.readingTime}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  fontSize: "clamp(22px, 2.5vw, 28px)",
                  fontWeight: "700",
                  color: "#0f172a",
                  lineHeight: 1.3,
                  marginBottom: "12px",
                }}>
                  {article.title}
                </h3>

                <p style={{
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "#64748b",
                  marginBottom: "20px",
                }}>
                  {article.description}
                </p>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}>
                  <img
                    src={article.authorImage}
                    alt={article.author}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                      {article.author}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}>
                      <FaCalendarAlt style={{ fontSize: "10px" }} />
                      {formatDate(article.publishedDate)}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ gap: "14px" }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 24px",
                    background: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontFamily: "var(--font-body)",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Read Article <FaArrowRight />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .blog-editor-card {
            grid-template-columns: 1fr !important;
          }
          .blog-editor-card > div:first-child {
            order: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
