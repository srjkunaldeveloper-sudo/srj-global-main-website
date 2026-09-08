import { motion } from "framer-motion";
import { FaPlay, FaClock } from "react-icons/fa";

export default function LatestVideos({ videos }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section style={{ padding: "80px 24px", background: "#ffffff" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "40px" }}
      >
        <div style={{
          fontSize: "14px",
          fontWeight: "700",
          color: "#000000",
          marginBottom: "16px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          Watch & Learn
        </div>
        <h2 style={{
          fontFamily: "'Geist Sans', 'Inter', sans-serif",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: "800",
          color: "#000000",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
        }}>
          Latest{" "}
          <span style={{
            color: "#000000",
            textDecoration: "none",
            textDecorationColor: "#cbd5e1",
          }}>
            Videos
          </span>
        </h2>
      </motion.div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
      }} className="blog-videos-grid">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="blog-video-card"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
            }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={video.thumbnail}
                alt={video.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  background: "#f1f5f9",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.06)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
              <div className="blog-video-overlay">
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                }}>
                  <FaPlay style={{ color: "#ffffff", fontSize: "18px", marginLeft: "3px" }} />
                </div>
              </div>
              <div style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                padding: "4px 10px",
                background: "rgba(255, 255, 255, 0.85)",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#0f172a",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <FaClock style={{ fontSize: "10px" }} /> {video.duration}
              </div>
            </div>

            <div style={{ padding: "16px" }}>
              <div style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}>
                {video.category}
              </div>
              <h4 style={{
                fontFamily: "'Geist Sans', 'Inter', sans-serif",
                fontSize: "15px",
                fontWeight: "600",
                color: "#0f172a",
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {video.title}
              </h4>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .blog-videos-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          .blog-videos-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
