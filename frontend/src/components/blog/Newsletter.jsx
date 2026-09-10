import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import api from "../../config/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [statusType, setStatusType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setLoading(true);
    setMessage("");
    setStatusType(null);

    try {
      const res = await api.post("/subscribers", { email: trimmedEmail });
      setSubmitted(true);
      setEmail("");
      setStatusType("success");
      setMessage(res.data?.message || "Thank you for subscribing to our newsletter!");
      
      setTimeout(() => {
        setSubmitted(false);
        setMessage("");
        setStatusType(null);
      }, 5000);
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setStatusType("error");
      const errorMsg =
        err.response?.data?.message ||
        "Subscription failed. Please check your email and try again.";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{
      padding: "42px 24px",
      position: "relative",
      overflow: "hidden",
      background: "#ffffff",
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        position: "relative",
        zIndex: 2,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: "32px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated glow circles */}
          <div style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(15, 23, 42, 0.03)",
            filter: "blur(100px)",
            top: "-100px",
            right: "-80px",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(15, 23, 42, 0.02)",
            filter: "blur(100px)",
            bottom: "-80px",
            left: "-60px",
            pointerEvents: "none",
          }} />

          <div style={{
            position: "relative",
            zIndex: 3,
          }}>
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: "22px",
              color: "#ffffff",
              boxShadow: "0 8px 32px rgba(15, 23, 42, 0.15)",
            }}>
              <FaPaperPlane />
            </div>

            <h2 style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontSize: "clamp(24px, 3vw, 32px)",
              fontWeight: "800",
              color: "#000000",
              lineHeight: 1.3,
              marginBottom: "12px",
              letterSpacing: "-0.03em",
            }}>
              Never Miss{" "}
              <span style={{
                color: "#000000",
                textDecoration: "none",
                textDecorationColor: "#cbd5e1",
              }}>
                Technology Updates
              </span>
            </h2>

            <p style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontSize: "15px",
              color: "#64748b",
              marginBottom: "28px",
              maxWidth: "480px",
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}>
              Join 12,000+ engineers and tech leaders who get our weekly digest of insights, tutorials, and industry analysis.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: "12px",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              <input
                type="email"
                id="newsletter-email"
                name="email"
                aria-label="Email address"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                style={{
                  flex: 1,
                  padding: "14px 18px",
                  background: "#f8fafc",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  borderRadius: "14px",
                  color: "#0f172a",
                  fontSize: "15px",
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  outline: "none",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.7 : 1,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(0, 0, 0, 0.25)";
                  e.target.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.05)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(0, 0, 0, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <motion.button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                whileHover={loading ? {} : { scale: 1.02 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                style={{
                  padding: "14px 28px",
                  background: "#0f172a",
                  border: "none",
                  borderRadius: "14px",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
                  whiteSpace: "nowrap",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Subscribing..." : (submitted ? "Subscribed!" : "Subscribe")}
              </motion.button>
            </form>

            {message && (
              <div
                role="status"
                aria-live="polite"
                style={{
                  fontFamily: "'Geist Sans', 'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginTop: "12px",
                  color: statusType === "success" ? "#059669" : "#dc2626",
                }}
              >
                {message}
              </div>
            )}

            <p style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontSize: "12px",
              color: "#94a3b8",
              marginTop: "14px",
            }}>
              No spam. Unsubscribe anytime. Read by teams at Google, Microsoft, and Amazon.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
