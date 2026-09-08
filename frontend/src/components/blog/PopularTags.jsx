import { motion } from "framer-motion";

export default function PopularTags({ tags, selectedTag, setSelectedTag }) {
  return (
    <section style={{ padding: "60px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", marginBottom: "32px" }}
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
          fontSize: "clamp(24px, 3vw, 36px)",
          fontWeight: "800",
          color: "#000000",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
        }}>
          Popular Tags
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {tags.map((tag, index) => (
          <motion.button
            key={tag}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
            className={`blog-tag-chip ${selectedTag === tag ? "active" : ""}`}
            style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
            }}
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
