import {
  FaRocket, FaShieldAlt, FaBolt, FaGem, FaStar, FaFire,
  FaGlobe, FaMobileAlt, FaChartBar, FaBuilding, FaSearch,
  FaPalette, FaWordpress, FaShoppingCart, FaBoxes, FaBullhorn, FaGamepad,
} from "react-icons/fa";

export const categoryConfig = [
  { label: "Website", icon: <FaGlobe /> },
  { label: "Mobile App", icon: <FaMobileAlt /> },
  { label: "Dashboard", icon: <FaChartBar /> },
  { label: "ERP/CRM", icon: <FaBuilding /> },
  { label: "SEO", icon: <FaSearch /> },
  { label: "Graphics", icon: <FaPalette /> },
  { label: "WordPress", icon: <FaWordpress /> },
  { label: "Shopify", icon: <FaShoppingCart /> },
  { label: "Bulk", icon: <FaBoxes /> },
  { label: "Ads", icon: <FaBullhorn /> },
  { label: "Gaming", icon: <FaGamepad /> },
];

export const planStyles = {
  Basic: {
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    glow: "rgba(59, 130, 246, 0.25)",
    color: "#3b82f6",
    lightBg: "rgba(59, 130, 246, 0.08)",
    icon: <FaRocket />,
  },
  Standard: {
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    glow: "rgba(59, 130, 246, 0.25)",
    color: "#3b82f6",
    lightBg: "rgba(255, 255, 255, 0.06)",
    icon: <FaShieldAlt />,
  },
  Advanced: {
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    glow: "rgba(59, 130, 246, 0.25)",
    color: "#3b82f6",
    lightBg: "rgba(255, 255, 255, 0.06)",
    icon: <FaBolt />,
  },
  Premium: {
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    glow: "rgba(59, 130, 246, 0.25)",
    color: "#3b82f6",
    lightBg: "rgba(255, 255, 255, 0.06)",
    icon: <FaGem />,
  },
};

export const planBadges = {
  Basic: null,
  Standard: { label: "Most Popular", icon: <FaStar /> },
  Advanced: { label: "Best Value", icon: <FaFire /> },
  Premium: { label: "Enterprise", icon: <FaGem /> },
};

export const plans = [
  {
    name: "Basic",
    displayName: "Starter Scope",
    path: "/pricing/starter",
    priceDisplay: "₹20K – ₹40K",
    pricingLabel: "Estimated Investment",
    ctaText: "Discuss Your Project",
    description: "Ideal for early-stage startups and essential web platforms.",
    features: [
      "4–5 Core Modules / Pages",
      "Responsive UI/UX Architecture",
      "API & Contact Form Integration",
      "Basic SEO & Performance Setup"
    ],
  },
  {
    name: "Standard",
    displayName: "Professional",
    path: "/pricing/professional",
    priceDisplay: "₹40K – ₹1L+",
    pricingLabel: "Estimated Investment",
    ctaText: "Talk to Sales",
    description: "Designed for growing businesses requiring custom web & mobile features.",
    features: [
      "7–10 Custom Modules",
      "Interactive Dashboards & Integrations",
      "Dynamic Content & CMS System",
      "WhatsApp & Customer Communication APIs"
    ],
  },
  {
    name: "Advanced",
    displayName: "Enterprise",
    path: "/pricing/enterprise",
    priceDisplay: "₹1L – ₹3L+",
    pricingLabel: "Estimated Investment",
    ctaText: "Get Custom Quote",
    description: "Full-scale digital platforms with advanced automation & custom workflows.",
    features: [
      "Custom Microservices Architecture",
      "Motion Animations & High-End UX",
      "AI Chatbot & Automation Systems",
      "Cloud Infrastructure & DevOps Setup"
    ],
  },
  {
    name: "Premium",
    displayName: "Custom Scope",
    path: "/pricing/custom",
    priceDisplay: "Custom Pricing",
    pricingLabel: "Custom Quote",
    ctaText: "Contact Sales",
    description: "Tailored enterprise software, multi-tenant platforms & dedicated team allocation.",
    features: [
      "E-commerce / Multi-Tenant Systems",
      "Custom Payment & Banking Gateways",
      "Advanced Admin Control Center",
      "Dedicated Engineering Support"
    ],
  },
];

export const addOns = [
  { name: "Chatbot (Web/App)", priceDisplay: "+₹3K – ₹5K (Est.)", description: "AI-powered customer support" },
  { name: "WhatsApp Automation", priceDisplay: "+₹2.5K – ₹4K (Est.)", description: "Send notifications & alerts" },
  { name: "Payment Gateway Integration", priceDisplay: "+₹4K – ₹7K (Est.)", description: "Secure online payments" },
  { name: "Admin Panel", priceDisplay: "+₹6K – ₹10K (Est.)", description: "Complete admin dashboard" },
  { name: "Hosting + Domain (1 yr)", priceDisplay: "+₹3K (Est.)", description: "Premium hosting & domain" },
  { name: "Content Writing (per page)", priceDisplay: "+₹1.3K (Est.)", description: "SEO-friendly content writing" },
  { name: "Email Setup + SMTP", priceDisplay: "+₹2K (Est.)", description: "Professional email setup" },
  { name: "SEO Optimization & Analytics", priceDisplay: "+₹1.5K (Est.)", description: "Boost ranking & track performance" },
  { name: "Multi-Language Support", priceDisplay: "+₹3K – ₹5K (Est.)", description: "Add multiple languages" },
];
