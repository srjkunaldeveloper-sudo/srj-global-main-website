import React, { useState } from 'react';

const brands = [
  { 
    id: "adani", 
    domain: "adani.com", 
    alt: "Adani Group",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Adani_logo_2012.svg",
    customStyle: { transform: "scale(1.0)" }
  },
  { 
    id: "reliance", 
    domain: "ril.com", 
    alt: "Reliance Industries",
    forceUrl: "https://upload.wikimedia.org/wikipedia/en/0/0e/Reliance_Industries.svg"
  },
  { 
    id: "maruti-suzuki", 
    domain: "marutisuzuki.com", 
    alt: "Maruti Suzuki",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/8/86/Maruti_Suzuki_logo.svg",
    customStyle: { transform: "scale(1.15)" } 
  },
  { 
    id: "samsung", 
    domain: "samsung.com", 
    alt: "Samsung",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Samsung_logo.svg",
    customStyle: { transform: "scale(1.7)" }
  },
  { id: "lg", domain: "lg.com", alt: "LG" },
  { 
    id: "nissan", 
    domain: "nissan-global.com", 
    alt: "Nissan",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg",
    customStyle: { transform: "scale(1.15)" }
  },
  { 
    id: "mahindra", 
    domain: "mahindra.com", 
    alt: "Mahindra Group",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Mahindra_logo.svg" 
  },
  { 
    id: "gem", 
    domain: "gem.gov.in", 
    alt: "Government e-Marketplace",
    forceUrl: "https://upload.wikimedia.org/wikipedia/en/9/91/Government_e_Marketplace_Logo.png",
    customStyle: { mixBlendMode: "multiply", transform: "scale(1.2)" }
  },
  { 
    id: "bajaj", 
    domain: "bajajauto.com", 
    alt: "Bajaj Group",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Bajaj_Auto_logo.svg",
    customStyle: { transform: "scale(1.15)" }
  },
  { 
    id: "jio", 
    domain: "jio.com", 
    alt: "Reliance Jio",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Reliance_Jio_Logo.svg"
  },
  { 
    id: "infosys", 
    domain: "infosys.com", 
    alt: "Infosys",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
  },
  { 
    id: "aristocrat", 
    domain: "aristocrat.com", 
    alt: "Aristocrat",
    forceUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/Aristocrat_Leisure_logo.svg" 
  },
  { 
    id: "sun-pharma", 
    domain: "sunpharma.com", 
    alt: "Sun Pharma",
    forceUrl: "https://upload.wikimedia.org/wikipedia/en/5/50/Sun_Pharma_logo.svg"
  },
  { 
    id: "micromax", 
    domain: "micromaxinfo.com", 
    alt: "Micromax",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Micromax_logo.svg"
  },
  { 
    id: "philips", 
    domain: "philips.com", 
    alt: "Philips",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg" 
  },
  { 
    id: "tvs", 
    domain: "tvsmotor.com", 
    alt: "TVS Motor",
    forceUrl: "https://upload.wikimedia.org/wikipedia/en/e/e9/TVS_Motor_logo.svg"
  },
  { 
    id: "hawkins", 
    domain: "hawkinscookers.com", 
    alt: "Hawkins Cookers",
    forceUrl: "https://upload.wikimedia.org/wikipedia/en/f/ff/Hawkins_Cookers.svg"
  },
  { 
    id: "united", 
    domain: "unitedbreweries.com", 
    alt: "United",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Heineken_Logo.svg" // United Breweries Group
  },
  { 
    id: "honda", 
    domain: "honda.com", 
    alt: "Honda",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg",
    customStyle: { transform: "scale(1.15)" }
  },
  { 
    id: "itc", 
    domain: "itcportal.com", 
    alt: "ITC Limited",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/f/ff/ITC_Limited_Logo.svg",
    customStyle: { transform: "scale(1.15)" }
  },
  { 
    id: "whirlpool", 
    domain: "whirlpool.com", 
    alt: "Whirlpool",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Whirlpool_Corporation_Logo_(as_of_2017).svg",
    customStyle: { transform: "scale(1.15)" }
  },
  { 
    id: "kirloskar", 
    domain: "kirloskar.com", 
    alt: "Kirloskar Group",
    forceUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Kirloskar_Group_Logo.svg",
    customStyle: { transform: "scale(1.3)" }
  },
];

export function BrandLogo({ domain, id, alt, lazy, forceUrl, customStyle }) {
  // Try wide/high-quality transparent logo APIs first, fallback to square icons
  const sources = [
    ...(forceUrl ? [forceUrl] : []),
    `https://logo.clearbit.com/${domain}`,
    `https://vectorlogo.zone/logos/${id}/default.svg`,
    `https://logo.uplead.com/${domain}`,
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`
  ];
  
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleError = () => {
    if (currentIdx < sources.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  return (
    <img
      src={sources[currentIdx]}
      alt={alt}
      onError={handleError}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      style={{
        height: "100%",
        width: "100%",
        objectFit: "contain",
        display: "block",
        pointerEvents: "none",
        filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.05))",
        ...customStyle
      }}
    />
  );
}

function TrustedBy({
  title = "Trusted by Industry Leaders",
  speed = 40,
  dark = false,
}) {
  const maskColor = "white";
  return (
    <section
      aria-label="Trusted by Industry Leaders"
      style={{
        width: "100%",
        padding: "48px 0 24px",
        background: "#ffffff",
        overflow: "hidden",
        position: "relative",
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      {/* Section title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "28px",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            color: "#64748b",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            padding: "5px 14px",
            borderRadius: "999px"
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0f172a" }}></span>
          {title}
        </p>
      </div>

      {/* Marquee wrapper */}
      <div
        className="tm-wrapper"
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
          maskImage:
            `linear-gradient(to right, transparent 0%, ${maskColor} 15%, ${maskColor} 85%, transparent 100%)`,
          WebkitMaskImage:
            `linear-gradient(to right, transparent 0%, ${maskColor} 15%, ${maskColor} 85%, transparent 100%)`,
        }}
      >
        <div
          className="tm-track"
          style={{
            display: "flex",
            gap: "24px",
            width: "max-content",
            alignItems: "center",
            padding: "20px 0",
          }}
        >
          {/* Render brands twice for seamless loop */}
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="tm-logo-cell"
              title={brand.alt}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "80px",
                width: "180px",
                transition: "transform 0.3s ease",
                willChange: "transform",
                cursor: "pointer",
                padding: "20px",
              }}
            >
              <BrandLogo 
                domain={brand.domain} 
                id={brand.id} 
                alt={brand.alt} 
                lazy={i >= brands.length} 
                forceUrl={brand.forceUrl}
                customStyle={brand.customStyle}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tm-track {
          animation: tm-scroll ${speed}s linear infinite;
          animation-delay: 0s;
          backface-visibility: hidden;
          perspective: 1000px;
        }

        .tm-wrapper:hover .tm-track {
          animation-play-state: paused;
        }

        .tm-logo-cell:hover {
          transform: translateY(-4px) scale(1.02);
        }

        @keyframes tm-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .tm-track {
            animation: none;
          }
          .tm-wrapper {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .tm-wrapper::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 1024px) {
          .tm-logo-cell {
            height: 90px !important;
            width: 180px !important;
            padding: 20px !important;
          }
        }

        @media (max-width: 768px) {
          .tm-logo-cell {
            height: 75px !important;
            width: 150px !important;
            padding: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}

export default TrustedBy;
