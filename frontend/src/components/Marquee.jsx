import React, { useState, useEffect } from 'react';
import api from '../config/api';

export function BrandLogo({ logoUrl, fallbackDomain, altText, lazy, customStyle }) {
  const sources = [
    ...(logoUrl ? [logoUrl] : []),
    ...(fallbackDomain ? [
      `https://logo.clearbit.com/${fallbackDomain}`,
      `https://logo.uplead.com/${fallbackDomain}`,
      `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${fallbackDomain}&size=128`
    ] : [])
  ].filter(Boolean);

  const [currentIdx, setCurrentIdx] = useState(0);

  // Reset index if logoUrl changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [logoUrl, fallbackDomain]);

  const handleError = () => {
    if (currentIdx < sources.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  return (
    <img
      src={sources[currentIdx] || logoUrl}
      alt={altText || 'Partner Logo'}
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

export default function Marquee({
  title = "Trusted by Industry Leaders",
  speed = 40,
  dark = false,
}) {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLogos = async () => {
      try {
        const res = await api.get('/partner-logos');
        if (isMounted && res.data && res.data.success && Array.isArray(res.data.logos)) {
          setBrands(res.data.logos);
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load partner logos');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLogos();
    return () => { isMounted = false; };
  }, []);

  const bgColor = dark ? "#000000" : "#ffffff";
  const textColor = dark ? "#ffffff" : "#0F172A";
  const maskColor = dark ? "black" : "white";

  return (
    <section
      aria-label="Trusted by Industry Leaders"
      style={{
        width: "100%",
        padding: "42px 0",
        background: bgColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "56px",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            color: textColor,
            fontSize: "clamp(24px, 3vw, 36px)",
            fontWeight: "800",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans)",
          }}
        >
          {title}
        </p>
        <div style={{
          width: "60px",
          height: "4px",
          background: "#0F172A",
          margin: "16px auto 0",
          borderRadius: "2px",
        }} />
      </div>

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
        {isLoading ? (
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '20px 0' }}>
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={`skeleton-${sk}`}
                style={{
                  width: '220px',
                  height: '110px',
                  borderRadius: '12px',
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }}
              />
            ))}
          </div>
        ) : error || brands.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: textColor, opacity: 0.5, fontSize: '14px' }}>
            {error || 'No partner logos available.'}
          </div>
        ) : (
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
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={`${brand.id}-${i}`}
                className="tm-logo-cell"
                title={brand.alt_text || brand.name}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "110px",
                  width: "220px",
                  transition: "transform 0.3s ease, filter 0.3s ease",
                  willChange: "transform",
                  cursor: "pointer",
                  padding: "28px",
                }}
              >
                <BrandLogo
                  logoUrl={brand.logo_url}
                  fallbackDomain={brand.fallback_domain}
                  altText={brand.alt_text || brand.name}
                  lazy={i >= brands.length}
                />
              </div>
            ))}
          </div>
        )}
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
        
        .tm-logo-cell:hover img {
          filter: drop-shadow(0px 2px 5px rgba(0,0,0,0.05)) grayscale(0%) !important;
        }

        @keyframes tm-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
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
