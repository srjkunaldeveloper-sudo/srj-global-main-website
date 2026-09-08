import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle, FaCalculator, FaSearch,
  FaArrowRight, FaClock, FaBolt, FaRocket,
  FaShieldAlt, FaFire, FaStar,
} from "react-icons/fa";
import { categoryConfig, planStyles, planBadges, plans, addOns } from "../../config/pricing";

function DesktopPricing() {
  const navigate = useNavigate();
  const categories = categoryConfig.map((c) => c.label);

  const [selectedCategory, setSelectedCategory] = useState("Website");
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [days, setDays] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAddon = (addon) => {
    if (selectedAddons.some((a) => a.name === addon.name)) {
      setSelectedAddons(selectedAddons.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonTotal = selectedAddons.reduce((acc, item) => acc + item.price, 0);
  let total = selectedPlan.price + addonTotal;

  if (days < 5 && days > 0) {
    total += total * 0.2;
  }

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSavingText = () => {
    if (selectedAddons.length >= 3) return "You save 10% on 3+ add-ons!";
    return null;
  };

  const daysLabel = days >= 7 ? "Standard" : days >= 5 ? "Fast" : "Urgent";
  const daysColor = days >= 7 ? "#10b981" : days >= 5 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="home-root"
      style={{
        minHeight: "100vh",
        background: "transparent",
        padding: "130px 24px 100px",
        fontFamily: "var(--font-body)",
        color: "#f8fafc",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              padding: "10px 24px",
              borderRadius: "999px",
              marginBottom: "30px",
              backdropFilter: "blur(10px)",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            ✨ Flexible Pricing for Every Need
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 54px)",
              color: "#f8fafc",
              fontWeight: "900",
              fontFamily: "var(--font-headings)",
              marginBottom: "16px",
              lineHeight: "1.15",
            }}
          >
            SRJ Technologies Pricing Calculator
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            Smart pricing, premium deliverables — customized packages built specifically for startups, local businesses, and enterprise brands.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="searchBox"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto 50px",
            background: "rgba(15, 23, 42, 0.7)",
            borderRadius: "50px",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "4px 6px 4px 20px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          onFocusCapture={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-blue)";
            e.currentTarget.style.boxShadow = "0 10px 40px rgba(59, 130, 246, 0.15)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.3)";
          }}
        >
          <FaSearch color="var(--text-secondary)" size={16} style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search services, categories or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "14px 16px",
              fontSize: "15px",
              background: "transparent",
              color: "#f8fafc",
            }}
          />
          <button
            style={{
              border: "none",
              padding: "12px 28px",
              borderRadius: "30px",
              background: "var(--accent-gradient)",
              color: "#f8fafc",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(59, 130, 246, 0.25)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.03)";
              e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(59, 130, 246, 0.25)";
            }}
          >
            Search
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "50px",
          }}
        >
          {(filteredCategories.length > 0 ? filteredCategories : categories).map((item, index) => {
            const isSelected = selectedCategory === item;
            const catConfig = categoryConfig.find((c) => c.label === item);
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(item)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  background: isSelected
                    ? "var(--accent-gradient)"
                    : "rgba(255, 255, 255, 0.05)",
                  color: isSelected ? "#f8fafc" : "var(--text-secondary)",
                  boxShadow: isSelected
                    ? "0px 8px 20px rgba(59, 130, 246, 0.25)"
                    : "none",
                  border: isSelected ? "1px solid transparent" : "1px solid rgba(255,255,255,0.03)",
                }}
              >
                {catConfig?.icon}
                {item}
              </motion.button>
            );
          })}
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
            marginBottom: "60px",
          }}
        >
          {plans.map((plan, index) => {
            const isSelected = selectedPlan.name === plan.name;
            const style = planStyles[plan.name];
            const badge = planBadges[plan.name];

            return (
              <motion.div
                key={index}
                className="glass-panel"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={!isSelected ? { y: -6, transition: { duration: 0.2 } } : {}}
                onClick={() => setSelectedPlan(plan)}
                style={{
                  border: isSelected
                    ? `2px solid ${style.color}`
                    : "1px solid var(--border-color)",
                  borderRadius: "24px",
                  padding: "36px 30px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  transform: isSelected ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isSelected
                    ? `0 15px 40px ${style.glow}`
                    : "none",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--border-color-glow)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }
                }}
              >
                {badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-1px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: style.gradient,
                      color: "#f8fafc",
                      padding: "5px 14px",
                      borderRadius: "0 0 14px 14px",
                      fontSize: "11px",
                      fontWeight: "800",
                      letterSpacing: "0.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      boxShadow: `0 4px 15px ${style.glow}`,
                    }}
                  >
                    {badge.icon} {badge.label}
                  </div>
                )}

                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: isSelected ? style.gradient : style.lightBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                     color: isSelected ? "#f8fafc" : style.color,
                    marginBottom: "18px",
                    marginTop: badge ? "10px" : "0",
                    transition: "all 0.3s ease",
                    boxShadow: isSelected ? `0 4px 12px ${style.glow}` : "none",
                  }}
                >
                  {style.icon}
                </div>

                <h2
                  style={{
                    fontSize: "20px",
                    color: "#f8fafc",
                    marginBottom: "4px",
                    fontWeight: "800",
                    fontFamily: "var(--font-headings)",
                  }}
                >
                  {plan.name}
                </h2>

                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    marginBottom: "16px",
                    fontWeight: "500",
                  }}
                >
                  {plan.name === "Basic" && "Essential digital start"}
                  {plan.name === "Standard" && "Professional online presence"}
                  {plan.name === "Advanced" && "Full-featured business system"}
                  {plan.name === "Premium" && "Enterprise-grade solution"}
                </div>

                <h1
                  style={{
                    fontSize: "32px",
                    color: style.color,
                    marginBottom: "24px",
                    fontWeight: "900",
                    fontFamily: "var(--font-headings)",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "2px",
                  }}
                >
                  ₹{plan.price.toLocaleString()}
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>+</span>
                </h1>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "28px",
                    minHeight: "140px",
                  }}
                >
                  {plan.features.map((feature, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <FaCheckCircle color={style.color} size={12} style={{ flexShrink: 0 }} />
                      <span>{feature}</span>
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
                    background: isSelected
                      ? style.gradient
                      : "rgba(255, 255, 255, 0.05)",
                    border: isSelected
                      ? "none"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#f8fafc",
                    padding: "12px",
                    borderRadius: "14px",
                    fontSize: "13px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.background = "rgba(255, 255, 255, 0.15)";
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.background = "rgba(255, 255, 255, 0.05)";
                      e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }
                  }}
                >
                  View Details & Specs <FaArrowRight size={11} />
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            background: "rgba(15, 23, 42, 0.5)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "24px",
            padding: "32px 36px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3
                style={{
                  color: "#f8fafc",
                  fontWeight: "700",
                  fontSize: "18px",
                  marginBottom: "6px",
                  fontFamily: "var(--font-headings)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <FaClock color="#3b82f6" size={16} /> Delivery Timeline
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "480px" }}>
                Standard timeline is <strong style={{ color: "#10b981" }}>7+ days</strong>.
                {days < 5 && (
                  <span style={{ color: "#ef4444" }}>
                    {" "}Under 5 days triggers a <strong>20% priority express surcharge</strong>.
                  </span>
                )}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: `${daysColor}20`,
                  color: daysColor,
                  border: `1px solid ${daysColor}40`,
                }}
              >
                {daysLabel}
              </span>

              <input
                type="range"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{
                  width: "140px",
                  height: "4px",
                  accentColor: daysColor,
                  cursor: "pointer",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "4px 12px 4px 16px",
                }}
              >
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "600" }}>
                  Days:
                </span>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                  style={{
                    width: "56px",
                    padding: "8px 4px",
                    background: "transparent",
                    border: "none",
                    color: "#f8fafc",
                    fontSize: "16px",
                    fontWeight: "700",
                    textAlign: "center",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: "60px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                color: "#f8fafc",
                fontWeight: "800",
                fontFamily: "var(--font-headings)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaBolt color="#f59e0b" size={18} /> Add-On Tech Modules
            </h2>
            {getSavingText() && (
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#10b981",
                  background: "rgba(16, 185, 129, 0.12)",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                {getSavingText()}
              </span>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "12px",
            }}
          >
            {addOns.map((addon, index) => {
              const isSelected = selectedAddons.some((a) => a.name === addon.name);
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleAddon(addon)}
                  className="glass-panel"
                  style={{
                    background: isSelected
                      ? "rgba(59, 130, 246, 0.15)"
                      : "var(--card-bg)",
                    border: isSelected
                      ? "2px solid #3b82f6"
                      : "1px solid var(--border-color)",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 4px 15px rgba(59, 130, 246, 0.2)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "6px",
                        border: isSelected
                          ? "none"
                          : "1px solid rgba(255,255,255,0.2)",
                        background: isSelected
                          ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        color: "#f8fafc",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && "✓"}
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        color: isSelected ? "#f8fafc" : "var(--text-secondary)",
                        fontWeight: "600",
                      }}
                    >
                      {addon.name}
                    </span>
                  </div>

                  <span
                    style={{
                      color: isSelected ? "#60a5fa" : "var(--text-muted)",
                      fontWeight: "700",
                      fontSize: "14px",
                      flexShrink: 0,
                    }}
                  >
                    +₹{addon.price.toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="calculatorGrid glass-panel"
          style={{
            padding: "45px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "40px",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            background: "var(--card-bg)",
            borderRadius: "30px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              background: "rgba(59, 130, 246, 0.04)",
              filter: "blur(80px)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h3
              style={{
                color: "#f8fafc",
                fontSize: "20px",
                fontWeight: "800",
                marginBottom: "20px",
                fontFamily: "var(--font-headings)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaCalculator color="#3b82f6" /> Order Specification Breakdown
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                paddingBottom: "20px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-secondary)" }}>
                  Base Tier:{" "}
                  <strong style={{ color: planStyles[selectedPlan.name]?.color || "#f8fafc" }}>
                    {selectedPlan.name}
                  </strong>{" "}
                  Package
                </span>
                <span style={{ color: "#f8fafc", fontWeight: "700" }}>
                  ₹{selectedPlan.price.toLocaleString()}
                </span>
              </div>

              {selectedAddons.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>Add-on: {addon.name}</span>
                  <span style={{ color: "#f8fafc", fontWeight: "700" }}>
                    +₹{addon.price.toLocaleString()}
                  </span>
                </motion.div>
              ))}

              {days < 5 && days > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    background: "rgba(239, 68, 68, 0.08)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    marginTop: "4px",
                  }}
                >
                  <span style={{ color: "#ef4444", fontWeight: "600" }}>
                    <FaBolt size={12} style={{ marginRight: "4px" }} /> Urgent Priority Surcharge
                  </span>
                  <span style={{ color: "#ef4444", fontWeight: "700" }}>+20%</span>
                </motion.div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "16px",
                  color: "var(--text-secondary)",
                  fontWeight: "700",
                  fontFamily: "var(--font-headings)",
                }}
              >
                Estimated Investment
              </span>
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: "#10b981",
                  fontFamily: "var(--font-headings)",
                  textShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
                }}
              >
                ₹{Math.round(total).toLocaleString()}
              </span>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                border: "1px solid rgba(59, 130, 246, 0.15)",
                fontSize: "32px",
              }}
            >
              <FaRocket color="#3b82f6" />
            </div>
            <h3
              style={{
                color: "#f8fafc",
                fontSize: "18px",
                marginBottom: "10px",
                fontWeight: "700",
                fontFamily: "var(--font-headings)",
              }}
            >
              Ready to Initiate Project?
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                marginBottom: "24px",
                lineHeight: "1.6",
                maxWidth: "320px",
                margin: "0 auto 24px",
              }}
            >
              Proceed to specify your detailed project scope and send inquiry directly to our engineering desk.
            </p>
            <button
              onClick={() => navigate(selectedPlan.path)}
              style={{
                width: "100%",
                maxWidth: "320px",
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                color: "#f8fafc",
                padding: "16px 28px",
                border: "none",
                borderRadius: "30px",
                fontSize: "15px",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 14px 35px rgba(59, 130, 246, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 30px rgba(59, 130, 246, 0.35)";
              }}
            >
              Configure & Request {selectedPlan.name} Plan <FaArrowRight size={14} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: "60px" }}
        >
          <h2
            style={{
              fontSize: "22px",
              color: "#f8fafc",
              fontWeight: "800",
              fontFamily: "var(--font-headings)",
              marginBottom: "20px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <FaShieldAlt color="#3b82f6" size={18} /> Dynamic Pricing Conditions
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {[
              { label: "Urgent Delivery (< 5 days)", value: "+20–30% Rush Rate", icon: <FaBolt color="#ef4444" /> },
              { label: "Bulk Purchase (3+ Tiers)", value: "10–20% Slashed discount", icon: <FaFire color="#f59e0b" /> },
              { label: "Weekend Deployment", value: "+15% Critical surcharge", icon: <FaStar color="#a855f7" /> },
              { label: "Custom Systems Scope", value: "Interactive Custom Quote", icon: <FaCalculator color="#3b82f6" /> },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                style={{
                  background: "rgba(15, 23, 42, 0.45)",
                  borderRadius: "18px",
                  padding: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "all 0.2s ease",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.2)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {item.icon}
                  <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: "600" }}>
                    {item.label}
                  </span>
                </div>
                <span
                  style={{
                    color: "#3b82f6",
                    fontWeight: "800",
                    fontSize: "12px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>
        {`
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
          .pricing-bg-grid {
            animation: bgPulse 8s ease-in-out infinite alternate;
          }
          @keyframes bgPulse {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }
          @media(prefers-reduced-motion: reduce) {
            .pricing-bg-grid {
              animation: none;
            }
          }
          @media(max-width: 900px) {
            .calculatorGrid {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
              padding: 30px !important;
            }
            .searchBox {
              max-width: 100% !important;
            }
          }
          @media(max-width: 768px) {
            .calculatorGrid {
              padding: 24px !important;
            }
          }
          @media(max-width: 600px) {
            section {
              padding: 40px 16px !important;
            }
            input[type="range"] {
              width: 100px !important;
            }
          }
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            opacity: 1;
          }
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            outline: none;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 2px solid currentColor;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          }
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: 2px solid currentColor;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          }
        `}
      </style>
    </div>
  );
}

export default DesktopPricing;
