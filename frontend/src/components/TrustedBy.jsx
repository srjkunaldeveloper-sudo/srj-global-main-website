import React, { useState, useEffect } from 'react';
import api from '../config/api';

export function BrandLogo({ domain, id, alt, lazy, forceUrl, customStyle, logoUrl, fallbackDomain, altText }) {
  const finalLogoUrl = logoUrl || forceUrl;
  const finalDomain = fallbackDomain || domain;
  const finalAlt = altText || alt || 'Partner Logo';

  const sources = [
    ...(finalLogoUrl ? [finalLogoUrl] : []),
    ...(finalDomain ? [
      `https://logo.clearbit.com/${finalDomain}`,
      `https://vectorlogo.zone/logos/${id || finalDomain}/default.svg`,
      `https://logo.uplead.com/${finalDomain}`,
      `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${finalDomain}&size=128`
    ] : [])
  ].filter(Boolean);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    setCurrentIdx(0);
  }, [finalLogoUrl, finalDomain]);

  const handleError = () => {
    if (currentIdx < sources.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  return (
    <img
      src={sources[currentIdx] || finalLogoUrl}
      alt={finalAlt}
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
        {isLoading ? (
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '20px 0' }}>
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={`trustedby-sk-${sk}`}
                style={{
                  width: '180px',
                  height: '80px',
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.04)',
                  animation: 'pulse 1.5s infinite ease-in-out'
                }}
              />
            ))}
          </div>
        ) : error || brands.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '14px' }}>
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
            {/* Render brands twice for seamless loop */}
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
                  height: "80px",
                  width: "180px",
                  transition: "transform 0.3s ease",
                  willChange: "transform",
                  cursor: "pointer",
                  padding: "20px",
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

export default TrustedBy;
