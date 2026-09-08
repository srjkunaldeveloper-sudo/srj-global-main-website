import { motion } from "framer-motion";
import { FaClock, FaArrowRight, FaCalendarAlt, FaEye, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LatestArticles({ articles }) {
  const navigate = useNavigate();
  
  if (!articles || articles.length === 0) {
    return (
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
        <h3 style={{ fontFamily: "'Geist Sans', 'Inter', sans-serif", fontSize: "24px", color: "#64748b" }}>
          No articles match your search criteria.
        </h3>
        <p style={{ fontSize: "15px", color: "#475569", marginTop: "8px" }}>
          Try adjusting your filters or search query.
        </p>
      </section>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatViews = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  return (
    <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
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
          Latest Articles
        </div>
        <h2 style={{
          fontFamily: "'Geist Sans', 'Inter', sans-serif",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: "800",
          color: "#000000",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
        }}>
          Fresh{" "}
          <span style={{
            color: "#000000",
            textDecoration: "none",
            textDecorationColor: "#cbd5e1",
          }}>
            Perspectives
          </span>
        </h2>
      </motion.div>

      <div className="blog-masonry">
        {articles.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.01 }}
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "border-color 0.4s ease, box-shadow 0.4s ease",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.boxShadow = "0 16px 48px rgba(0, 0, 0, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.02)";
            }}
            onClick={() => navigate(`/blog/${article.id}`)}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={article.coverImage}
                alt={article.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  background: "#f1f5f9",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.08)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
              <div style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                display: "flex",
                gap: "6px",
              }}>
                <span style={{
                  padding: "5px 12px",
                  background: "#0f172a",
                  borderRadius: "50px",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#ffffff",
                }}>
                  {article.category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
              <div style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                padding: "5px 10px",
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: "600",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <FaClock style={{ fontSize: "9px" }} /> {article.readingTime}
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
                fontSize: "12px",
                color: "#64748b",
              }}>
                <FaCalendarAlt style={{ fontSize: "10px" }} />
                {formatDate(article.publishedDate)}
                <span>•</span>
                <FaEye style={{ fontSize: "10px" }} />
                {formatViews(article.views)}
                <span>•</span>
                <FaHeart style={{ fontSize: "10px" }} />
                {formatViews(article.likes)}
              </div>

              <h3 style={{
                fontFamily: "'Geist Sans', 'Inter', sans-serif",
                fontSize: "17px",
                fontWeight: "700",
                color: "#0f172a",
                lineHeight: 1.4,
                marginBottom: "10px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {article.title}
              </h3>

              <p style={{
                fontFamily: "'Geist Sans', 'Inter', sans-serif",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#475569",
                marginBottom: "16px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {article.description}
              </p>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <img
                    src={article.authorImage}
                    alt={article.author}
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                    {article.author}
                  </span>
                </div>

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
                  Read <FaArrowRight style={{ fontSize: "11px" }} />
                </motion.span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
