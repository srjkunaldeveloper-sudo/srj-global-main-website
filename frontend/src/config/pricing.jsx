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
    path: "/pricing/basic",
    price: 14999,
    features: ["4–5 pages", "Contact form", "Responsive", "Basic SEO"],
  },
  {
    name: "Standard",
    path: "/pricing/standard",
    price: 24999,
    features: ["7–10 pages", "WhatsApp + Map", "Dynamic sections", "Social links"],
  },
  {
    name: "Advanced",
    path: "/pricing/advanced",
    price: 39999,
    features: ["UI/UX design", "Motion animations", "Full blog system", "Chatbot integration", "Domain + Hosting"],
  },
  {
    name: "Premium",
    path: "/pricing/premium",
    price: 69999,
    features: ["E-commerce/Booking", "Advanced Admin Panel", "Customer Analytics", "Payment gateways"],
  },
];

export const addOns = [
  { name: "Chatbot (Web/App)", price: 2999 },
  { name: "WhatsApp Automation", price: 2499 },
  { name: "Payment Gateway Integration", price: 3999 },
  { name: "Admin Panel", price: 5999 },
  { name: "Hosting + Domain (1 yr)", price: 2999 },
  { name: "Content Writing (per page)", price: 1299 },
  { name: "Email Setup + SMTP", price: 1999 },
  { name: "SEO Optimization & Analytics", price: 1499 },
  { name: "Multi-Language Support", price: 2999 },
];
