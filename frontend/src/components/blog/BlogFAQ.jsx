import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import api from "../../config/api";

export default function BlogFAQ({ faqs: initialFaqs }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchBlogFaqs = async () => {
      try {
        const res = await api.get('/faqs?category=Blog');
        if (res.data && res.data.success && Array.isArray(res.data.faqs)) {
          setFaqs(res.data.faqs);
        } else if (Array.isArray(res.data)) {
          setFaqs(res.data);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        console.error('Error fetching Blog FAQs:', err);
        setError(true);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogFaqs();
  }, []);

  if (!loading && (faqs.length === 0 || error)) {
    return null;
  }

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
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} style={{ padding: "20px 24px", background: "#f8fafc", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ height: "16px", background: "#e2e8f0", borderRadius: "4px", width: "70%", marginBottom: "8px" }} />
              <div style={{ height: "14px", background: "#f1f5f9", borderRadius: "4px", width: "50%" }} />
            </div>
          ))
        ) : (
          faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const qText = faq.question || faq.q;
            const aText = faq.answer || faq.a;

            return (
              <motion.div
                key={faq.id || index}
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
                    {qText}
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
                        whiteSpace: "pre-line",
                        fontFamily: "'Geist Sans', 'Inter', sans-serif",
                      }}>
                        {aText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
}

