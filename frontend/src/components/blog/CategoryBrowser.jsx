import { motion } from "framer-motion";
import {
  FaCode, FaGlobe, FaMobileAlt, FaRobot, FaGamepad, FaCloud,
  FaPaintBrush, FaShieldAlt, FaChartLine, FaChartBar, FaRocket, FaBriefcase,
} from "react-icons/fa";

const iconMap = {
  FaCode, FaGlobe, FaMobileAlt, FaRobot, FaGamepad, FaCloud,
  FaPaintBrush, FaShieldAlt, FaChartLine, FaChartBar, FaRocket, FaBriefcase,
};

export default function CategoryBrowser({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <section style={{
      padding: "40px 24px",
      background: "#ffffff",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "24px" }}
        >
          <div style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "#000000",
            marginBottom: "16px",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}>
            Explore Topics
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
            Browse by{" "}
            <span style={{
              color: "#000000",
              textDecoration: "none",
              textDecorationColor: "#cbd5e1",
            }}>
              Category
            </span>
          </h2>
          <p style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            fontSize: "16px",
            color: "#64748b",
            maxWidth: "560px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Deep-dive into specialized technology domains curated by our team of expert engineers and architects.
          </p>
        </motion.div>

        <div className="blog-category-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}>
          {categories.map((cat, index) => {
            const Icon = iconMap[cat.icon] || FaCode;
            const isActive = selectedCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setSelectedCategory(isActive ? "" : cat.id)}
                className="blog-category-card"
                style={{
                  padding: "14px 16px",
                  background: isActive
                    ? "#f8fafc"
                    : "#ffffff",
                  border: isActive ? "2px solid #000000" : "1px solid rgba(0, 0, 0, 0.06)",
                  borderRadius: "12px",
                  boxShadow: isActive
                    ? "0 8px 30px rgba(0, 0, 0, 0.08)"
                    : "0 2px 8px rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: cat.gradient,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                  fontSize: "16px",
                  color: "#ffffff",
                  boxShadow: `0 4px 16px ${cat.color}40`,
                }}>
                  <Icon />
                </div>

                <h3 style={{
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: "4px",
                }}>
                  {cat.name}
                </h3>

                <div style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: cat.color,
                  marginBottom: "4px",
                }}>
                  {cat.articleCount} articles
                </div>

                <p style={{
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  fontSize: "12px",
                  lineHeight: 1.4,
                  color: "#64748b",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {cat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
