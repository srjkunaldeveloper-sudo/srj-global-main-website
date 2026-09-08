import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch, FaCheckCircle, FaArrowRight,
  FaClock, FaCalculator, FaChevronDown,
  FaRobot, FaWhatsapp, FaCreditCard, FaCog, FaPenFancy, FaEnvelope,
  FaGlobe, FaBolt, FaFire, FaStar, FaShieldAlt,
} from "react-icons/fa";
import { categoryConfig, planStyles, planBadges, plans, addOns } from "../../config/pricing";

const addOnDisplay = {
  "Chatbot (Web/App)": { icon: <FaRobot />, desc: "AI-powered customer support chatbot", recommended: true },
  "WhatsApp Automation": { icon: <FaWhatsapp />, desc: "Automated WhatsApp messaging & replies", recommended: false },
  "Payment Gateway Integration": { icon: <FaCreditCard />, desc: "Stripe, Razorpay, or custom gateway", recommended: false },
  "Admin Panel": { icon: <FaCog />, desc: "Full-featured admin dashboard", recommended: true },
  "Hosting + Domain (1 yr)": { icon: <FaGlobe />, desc: "Reliable hosting + custom domain", recommended: false },
  "Content Writing (per page)": { icon: <FaPenFancy />, desc: "SEO-optimized content per page", recommended: false },
  "Email Setup + SMTP": { icon: <FaEnvelope />, desc: "Professional email & SMTP config", recommended: false },
};

const timelineOptions = [
  { label: "Urgent", days: 3, desc: "1–4 days", color: "#ef4444", icon: <FaBolt /> },
  { label: "Fast", days: 6, desc: "5–6 days", color: "#f59e0b", icon: <FaFire /> },
  { label: "Standard", days: 14, desc: "7–30 days", color: "#10b981", icon: <FaClock /> },
];

const conditions = [
  { label: "Urgent Delivery (< 5 days)", value: "+20–30% Rush Rate", icon: <FaBolt color="#ef4444" />, detail: "Projects requiring delivery in under 5 business days are subject to a 20% priority express surcharge to accommodate accelerated workflows and dedicated resource allocation." },
  { label: "Bulk Purchase (3+ Tiers)", value: "10–20% Slashed discount", icon: <FaFire color="#f59e0b" />, detail: "Clients purchasing three or more service tiers simultaneously qualify for a bulk discount ranging from 10% to 20%, applied automatically at checkout." },
  { label: "Weekend Deployment", value: "+15% Critical surcharge", icon: <FaStar color="#a855f7" />, detail: "Deployments scheduled during weekends or public holidays incur a 15% critical surcharge to cover out-of-hours engineering and support coordination." },
  { label: "Custom Systems Scope", value: "Interactive Custom Quote", icon: <FaCalculator color="#3b82f6" />, detail: "Projects with highly custom or non-standard technical requirements will receive a personalized interactive quote after an initial scoping consultation with our solutions team." },
];

function MobilePricing() {
  const navigate = useNavigate();
  const categories = categoryConfig.map((c) => c.label);

  const [selectedCategory, setSelectedCategory] = useState("Website");
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [days, setDays] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCondition, setExpandedCondition] = useState(null);
  const scrollRef = useRef(null);

  const toggleAddon = useCallback((addon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addon.name)
        ? prev.filter((a) => a.name !== addon.name)
        : [...prev, addon]
    );
  }, []);

  const addonTotal = useMemo(
    () => selectedAddons.reduce((acc, item) => acc + item.price, 0),
    [selectedAddons]
  );

  const total = useMemo(() => {
    let t = selectedPlan.price + addonTotal;
    if (days < 5 && days > 0) t += t * 0.2;
    return t;
  }, [selectedPlan.price, addonTotal, days]);

  const filteredCategories = useMemo(
    () => categories.filter((cat) =>
      cat.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery, categories]
  );

  const getSavingText = () => {
    if (selectedAddons.length >= 3) return "You save 10% on 3+ add-ons!";
    return null;
  };

  const daysLabel = days >= 7 ? "Standard" : days >= 5 ? "Fast" : "Urgent";
  const daysColor = days >= 7 ? "#10b981" : days >= 5 ? "#f59e0b" : "#ef4444";

  const handleTimelineSelect = (option) => {
    setDays(option.days);
  };

  return (
    <div
      className="home-root"
      style={{
        minHeight: "100vh",
        background: "transparent",
        fontFamily: "var(--font-body)",
        color: "#f8fafc",
        paddingBottom: 100,
        marginTop: -55,
        position: "relative",
      }}
    >
      {/* ===== HERO SECTION ===== */}
      <section style={{ padding: "20px 16px 20px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              padding: "6px 16px",
              borderRadius: "999px",
              marginBottom: "20px",
              backdropFilter: "blur(10px)",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            ✨ Flexible Pricing for Every Need
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#f8fafc",
              fontFamily: "var(--font-headings)",
              marginBottom: 8,
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
            }}
          >
            Pricing Calculator
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              margin: "0 auto 20px",
              maxWidth: 300,
            }}
          >
            Smart pricing, premium deliverables — customized for startups, local businesses, and enterprises.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(15, 23, 42, 0.7)",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "3px 3px 3px 16px",
            maxWidth: "100%",
          }}
        >
          <FaSearch color="var(--text-secondary)" size={14} style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "10px 8px",
              fontSize: 13,
              background: "transparent",
              color: "#f8fafc",
              minWidth: 0,
            }}
          />
          <button
            style={{
              border: "none",
              padding: "8px 18px",
              borderRadius: 9999,
              background: "var(--accent-gradient)",
              color: "#f8fafc",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25)",
              flexShrink: 0,
            }}
          >
            Search
          </button>
        </motion.div>
      </section>

      {/* ===== CATEGORY FILTERS ===== */}
      <div style={{ padding: "0 16px", marginBottom: 24 }}>
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 4,
            scrollbarWidth: "none",
          }}
        >
          {(filteredCategories.length > 0 ? filteredCategories : categories).map((item) => {
            const isSelected = selectedCategory === item;
            const catConfig = categoryConfig.find((c) => c.label === item);
            return (
              <motion.button
                key={item}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelectedCategory(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "7px 14px",
                  borderRadius: 9999,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  scrollSnapAlign: "center",
                  transition: "all 0.25s ease",
                  background: isSelected
                    ? "var(--accent-gradient)"
                    : "rgba(255, 255, 255, 0.05)",
                  color: isSelected ? "#f8fafc" : "var(--text-secondary)",
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(59, 130, 246, 0.3)"
                    : "none",
                  border: isSelected ? "none" : "1px solid rgba(255,255,255,0.04)",
                  minHeight: 36,
                }}
              >
                <span style={{ fontSize: 13, display: "flex" }}>{catConfig?.icon}</span>
                {item}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ===== PRICING CARDS (2x2 grid) ===== */}
      <div style={{ padding: "0 16px", marginBottom: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {plans.map((plan, index) => {
            const isSelected = selectedPlan.name === plan.name;
            const style = planStyles[plan.name];
            const badge = planBadges[plan.name];

            return (
              <motion.div
                key={plan.name}
                className="glass-panel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                onClick={() => setSelectedPlan(plan)}
                style={{
                  border: isSelected
                    ? `1.5px solid ${style.color}`
                    : "1px solid var(--border-color)",
                  borderRadius: 14,
                  padding: "14px 10px 12px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected
                    ? `0 6px 20px ${style.glow}`
                    : "none",
                  overflow: "hidden",
                }}
              >
                {badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: style.gradient,
                      color: "#f8fafc",
                      padding: "2px 8px",
                      borderRadius: "0 14px 0 10px",
                      fontSize: 7,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    {badge.icon} {badge.label}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: isSelected ? style.gradient : style.lightBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: isSelected ? "#f8fafc" : style.color,
                      flexShrink: 0,
                    }}
                  >
                    {style.icon}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: 12,
                        color: "#f8fafc",
                        fontWeight: 800,
                        fontFamily: "var(--font-headings)",
                        lineHeight: 1.2,
                      }}
                    >
                      {plan.name}
                    </h2>
                    <div style={{ fontSize: 8, color: "var(--text-muted)", fontWeight: 500 }}>
                      {plan.name === "Basic" && "Essential start"}
                      {plan.name === "Standard" && "Professional"}
                      {plan.name === "Advanced" && "Full-featured"}
                      {plan.name === "Premium" && "Enterprise"}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 900,
                    color: style.color,
                    fontFamily: "var(--font-headings)",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 1,
                  }}
                >
                  ₹{plan.price.toLocaleString()}
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 500 }}>+</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 10,
                  }}
                >
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 5,
                        alignItems: "center",
                        fontSize: 9,
                        color: "var(--text-secondary)",
                      }}
                    >
                      <FaCheckCircle color={style.color} size={8} style={{ flexShrink: 0 }} />
                      <span style={{ lineHeight: 1.2 }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(plan.path);
                  }}
                  style={{
                    width: "100%",
                    minHeight: 28,
                    background: isSelected
                      ? style.gradient
                      : "rgba(255, 255, 255, 0.06)",
                    border: isSelected ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#f8fafc",
                    padding: "4px 6px",
                    borderRadius: 8,
                    fontSize: 9,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  View Details <FaArrowRight size={8} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== DELIVERY TIMELINE ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ padding: "0 16px", marginBottom: 24 }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.5)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <h3
            style={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "var(--font-headings)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <FaClock color="#3b82f6" size={14} /> Delivery Timeline
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 11, marginBottom: 16, lineHeight: 1.5 }}>
            Standard timeline is <strong style={{ color: "#10b981" }}>7+ days</strong>.
            {days < 5 && (
              <span style={{ color: "#ef4444" }}>
                {" "}Under 5 days triggers a <strong>20% priority express surcharge</strong>.
              </span>
            )}
          </p>

          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {timelineOptions.map((opt) => {
              const isActive = daysLabel === opt.label;
              return (
                <motion.button
                  key={opt.label}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleTimelineSelect(opt)}
                  style={{
                    flex: 1,
                    minHeight: 44,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    padding: "8px 4px",
                    borderRadius: 12,
                    cursor: "pointer",
                    background: isActive
                      ? `linear-gradient(135deg, ${opt.color}25, ${opt.color}15)`
                      : "rgba(255, 255, 255, 0.03)",
                    border: isActive
                      ? `1px solid ${opt.color}50`
                      : "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <span style={{ fontSize: 14, color: isActive ? opt.color : "var(--text-muted)" }}>
                    {opt.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? opt.color : "var(--text-secondary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {opt.label}
                  </span>
                  <span style={{ fontSize: 9, color: "var(--text-muted)" }}>
                    {opt.desc}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 9999,
                background: `${daysColor}20`,
                color: daysColor,
                border: `1px solid ${daysColor}40`,
                flexShrink: 0,
              }}
            >
              {daysLabel}
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 10,
                padding: "2px 8px 2px 12px",
              }}
            >
              <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>
                Days:
              </span>
              <input
                type="number"
                min="1"
                max="90"
                value={days}
                onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                style={{
                  width: 44,
                  padding: "6px 2px",
                  background: "transparent",
                  border: "none",
                  color: "#f8fafc",
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===== ADD-ON MODULES ===== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={{ padding: "0 16px", marginBottom: 24 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              color: "#f8fafc",
              fontWeight: 800,
              fontFamily: "var(--font-headings)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FaBolt color="#f59e0b" size={14} /> Add-On Modules
          </h2>
          {getSavingText() && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.12)",
                padding: "4px 10px",
                borderRadius: 9999,
                border: "1px solid rgba(16, 185, 129, 0.2)",
                flexShrink: 0,
              }}
            >
              {getSavingText()}
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {addOns.map((addon, index) => {
            const isSelected = selectedAddons.some((a) => a.name === addon.name);
            const display = addOnDisplay[addon.name] || {};

            return (
              <motion.div
                key={addon.name}
                className="glass-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAddon(addon)}
                style={{
                  background: isSelected
                    ? "rgba(59, 130, 246, 0.15)"
                    : "var(--card-bg)",
                  border: isSelected
                    ? "1.5px solid #3b82f6"
                    : "1px solid var(--border-color)",
                  borderRadius: 12,
                  padding: "10px 8px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  boxShadow: isSelected ? "0 4px 12px rgba(59, 130, 246, 0.2)" : "none",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 4,
                }}
              >
                {display.recommended && (
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      right: 8,
                      background: "linear-gradient(90deg, #f59e0b, #d97706)",
                      color: "#f8fafc",
                      fontSize: 6,
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "0 0 6px 6px",
                    }}
                  >
                    Recommended
                  </div>
                )}

                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: isSelected
                      ? "none"
                      : "1.5px solid rgba(255,255,255,0.25)",
                    background: isSelected
                      ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: "#f8fafc",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && "✓"}
                </div>

                <span style={{ fontSize: 14, color: "var(--text-muted)", display: "flex" }}>
                  {display.icon}
                </span>

                <span
                  style={{
                    fontSize: 9,
                    color: isSelected ? "#f8fafc" : "var(--text-secondary)",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {addon.name}
                </span>

                <span
                  style={{
                    color: isSelected ? "#60a5fa" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: 10,
                  }}
                >
                  +₹{addon.price.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ===== ORDER SUMMARY & CTA ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ padding: "0 16px", marginBottom: 24 }}
      >
        <div
          className="glass-panel"
          style={{
            background: "var(--card-bg)",
            borderRadius: 20,
            padding: 20,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 150,
              height: 150,
              background: "rgba(59, 130, 246, 0.04)",
              filter: "blur(50px)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <h3
            style={{
              color: "#f8fafc",
              fontSize: 15,
              fontWeight: 800,
              marginBottom: 16,
              fontFamily: "var(--font-headings)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 16 }}>📋</span> Order Summary
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--text-secondary)" }}>
                Package:{" "}
                <strong style={{ color: planStyles[selectedPlan.name]?.color || "#f8fafc" }}>
                  {selectedPlan.name}
                </strong>
              </span>
              <span style={{ color: "#f8fafc", fontWeight: 700 }}>
                ₹{selectedPlan.price.toLocaleString()}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
              <span style={{ color: daysColor, fontWeight: 600 }}>{daysLabel} ({days} days)</span>
            </div>

            {selectedAddons.map((addon) => (
              <div
                key={addon.name}
                style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}
              >
                <span style={{ color: "var(--text-secondary)" }}>Add-on: {addon.name}</span>
                <span style={{ color: "#f8fafc", fontWeight: 600 }}>
                  +₹{addon.price.toLocaleString()}
                </span>
              </div>
            ))}

            {days < 5 && days > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  background: "rgba(239, 68, 68, 0.08)",
                  padding: "6px 10px",
                  borderRadius: 8,
                }}
              >
                <span style={{ color: "#ef4444", fontWeight: 600 }}>
                  <FaBolt size={10} style={{ marginRight: 3 }} /> Urgent Surcharge
                </span>
                <span style={{ color: "#ef4444", fontWeight: 700 }}>+20%</span>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 700 }}>
              Total Investment
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: "#10b981",
                fontFamily: "var(--font-headings)",
                textShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
              }}
            >
              ₹{Math.round(total).toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ===== CTA BUTTON ===== */}
      <div
        style={{
          padding: "0 16px",
          position: "sticky",
          bottom: 0,
          zIndex: 50,
          paddingBottom: 16,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(selectedPlan.path)}
          style={{
            width: "100%",
            minHeight: 52,
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            color: "#f8fafc",
            border: "none",
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: "0.3px",
          }}
        >
          Configure & Request {selectedPlan.name} Plan <FaArrowRight size={13} />
        </motion.button>
      </div>

      {/* ===== PRICING CONDITIONS (single row) ===== */}
      <div style={{ padding: "0 16px", marginBottom: 32 }}>
        <h2
          style={{
            fontSize: 16,
            color: "#f8fafc",
            fontWeight: 800,
            fontFamily: "var(--font-headings)",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <FaShieldAlt color="#3b82f6" size={14} /> Pricing Conditions
        </h2>

        <div
          style={{
            display: "flex",
            gap: 8,
          }}
        >
          {conditions.map((item, index) => {
            const isExpanded = expandedCondition === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() =>
                  setExpandedCondition(isExpanded ? null : index)
                }
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: isExpanded
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08))"
                    : "rgba(15, 23, 42, 0.45)",
                  borderRadius: 12,
                  border: isExpanded
                    ? "1px solid rgba(59, 130, 246, 0.25)"
                    : "1px solid rgba(255, 255, 255, 0.05)",
                  padding: "10px 6px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 4,
                  transition: "all 0.25s ease",
                }}
              >
                <span style={{ fontSize: 16, display: "flex", lineHeight: 1 }}>
                  {item.icon}
                </span>
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 8,
                    fontWeight: 600,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    color: isExpanded ? "#60a5fa" : "#3b82f6",
                    fontWeight: 800,
                    fontSize: 7,
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </span>
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 7,
                    display: "flex",
                    lineHeight: 1,
                  }}
                >
                  <FaChevronDown />
                </motion.span>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      style={{
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 7,
                          color: "var(--text-muted)",
                          lineHeight: 1.4,
                          borderTop: "1px solid rgba(255,255,255,0.04)",
                          paddingTop: 6,
                          marginTop: 4,
                          textAlign: "left",
                        }}
                      >
                        {item.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .home-root {
          --bg-primary: #ffffff;
          --bg-secondary: rgba(255, 255, 255, 0.05);
          --card-bg: rgba(255, 255, 255, 0.05);
          --text-primary: #f8fafc;
          --text-secondary: #4b5563;
          --text-muted: #9ca3af;
          --border-color: rgba(0, 0, 0, 0.08);
          --border-color-glow: rgba(59, 130, 246, 0.2);
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(0, 0, 0, 0.08) !important;
        }
      `}</style>
    </div>
  );
}

export default MobilePricing;
