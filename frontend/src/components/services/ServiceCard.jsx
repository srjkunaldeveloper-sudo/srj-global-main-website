import React, { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ServiceCard({ service, href, index, categoryTitle }) {
  const Icon = service.icon;
  const cardRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Format index as elegant 2-digit number (e.g. 01, 02)
  const elegantNumber = String((index ?? 0) + 1).padStart(2, "0");

  // Get concise category badge label
  const getBadgeLabel = (title) => {
    if (!title) return "Service";
    const lower = title.toLowerCase();
    if (lower.includes("software")) return "Software";
    if (lower.includes("mobile")) return "Mobile";
    if (lower.includes("ui/ux") || lower.includes("design")) return "UI/UX";
    if (lower.includes("ai") || lower.includes("intelligence")) return "AI";
    if (lower.includes("cloud") || lower.includes("devops")) return "Cloud";
    if (lower.includes("data") || lower.includes("analytics")) return "Data";
    if (lower.includes("cyber") || lower.includes("security")) return "Security";
    if (lower.includes("startup")) return "Startup";
    return "Tech";
  };

  const badgeLabel = getBadgeLabel(categoryTitle);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Normalize cursor position relative to card center (-1 to 1)
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setParallax({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0 });
  };

  // Interpolate movement for subtle 3D depth parallax
  const imageTranslate = isHovered
    ? `translate(${parallax.x * 6}px, ${parallax.y * 6}px)`
    : "translate(0px, 0px)";
  
  const iconTranslate = isHovered
    ? `translate(${parallax.x * -10}px, ${parallax.y * -10}px)`
    : "translate(0px, 0px)";

  const textTranslate = isHovered
    ? `translate(${parallax.x * 3}px, ${parallax.y * 3}px)`
    : "translate(0px, 0px)";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/services/${service.id}`)}
      className="relative flex flex-col justify-between h-full p-7 bg-white rounded-[24px] select-none overflow-hidden transition-all duration-600 border border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-2 hover:scale-[1.02] cursor-pointer group"
      style={{
        textDecoration: "none",
        transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
        background: isHovered
          ? "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)"
          : "#ffffff",
        borderColor: isHovered ? "rgba(59,130,246,0.12)" : "transparent",
      }}
    >
      {/* SERVICE NUMBER */}
      <span className="absolute top-6 right-8 text-5xl font-bold text-slate-900 select-none pointer-events-none opacity-[0.05] transition-opacity duration-300 group-hover:opacity-[0.08]">
        {elegantNumber}
      </span>

      <div className="flex flex-col h-full">
        {/* IMAGE AREA */}
        {service.image && (
          <div className="w-full h-48 rounded-[20px] overflow-hidden mb-6 relative z-10 bg-slate-50 flex items-center justify-center">
            {/* Subtle radial glow behind image */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
            
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 z-10"
              style={{
                borderRadius: "20px",
                transform: isHovered ? `${imageTranslate} scale(1.08)` : "scale(1) translate(0px, 0px)",
                transition: isHovered ? "transform 0.1s ease-out" : "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
        )}

        {/* CATEGORY BADGE */}
        <div className="mb-3 relative z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase text-blue-600 bg-blue-50/70 border border-blue-100/40 backdrop-blur-sm select-none">
            {badgeLabel}
          </span>
        </div>

        {/* TEXT CONTENT */}
        <div 
          style={{ 
            transform: textTranslate,
            transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)" 
          }}
        >
          <h3 className="text-[22px] font-semibold text-[#111111] tracking-tight mb-2">
            {service.title}
          </h3>
          <p className="text-[16px] font-normal text-[#6B7280] leading-[170%] mb-6 line-clamp-3 overflow-hidden h-[81px]">
            {service.description}
          </p>
        </div>
      </div>

      {/* FOOTER & CTA */}
      <div className="w-full mt-auto">
        {/* DIVIDER */}
        <div className="w-full h-[1px] bg-slate-200 opacity-[0.08] mb-4" />

        <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
          <span className="font-semibold text-sm">Explore Service</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-300"
            style={{
              transform: isHovered ? "translateX(6px)" : "translateX(0px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
