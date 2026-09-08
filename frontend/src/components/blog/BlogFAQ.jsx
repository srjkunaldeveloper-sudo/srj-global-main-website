import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

export default function BlogFAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={{ padding: "80px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", marginBottom: "48px" }}
      >
        <div style={{
          fontSize: "14px",
          fontWeight: "700",
          color: "#000000",
          marginBottom: "16px",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          FAQ
        </div>
        <h2 style={{
          fontFamily: "'Geist Sans', 'Inter', sans-serif",
          fontSize: "clamp(24px, 3vw, 36px)",
          fontWeight: "800",
          color: "#000000",
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
        }}>
          Frequently Asked{" "}
          <span style={{
            color: "#000000",
            textDecoration: "none",
            textDecorationColor: "#cbd5e1",
          }}>
            Questions
          </span>
        </h2>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{
                background: isOpen
                  ? "#f8fafc"
                  : "#ffffff",
                border: isOpen
                  ? "1px solid rgba(0, 0, 0, 0.15)"
                  : "1px solid rgba(0, 0, 0, 0.06)",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: isOpen ? "#000000" : "#334155",
                  transition: "color 0.3s ease",
                }}>
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    color: isOpen ? "#000000" : "#64748b",
                    fontSize: "14px",
                    flexShrink: 0,
                    transition: "color 0.3s ease",
                  }}
                >
                  <FaChevronDown />
                </motion.span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      padding: "0 24px 20px",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "#475569",
                      fontFamily: "'Geist Sans', 'Inter', sans-serif",
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
