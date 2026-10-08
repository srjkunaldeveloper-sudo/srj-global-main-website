import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";
import SEO from "./SEO";
import { FaCookieBite, FaShieldAlt } from "react-icons/fa";

export default function CookiePolicy() {
  const location = useLocation();
  const { getSetting } = useSiteSettings();

  const companyName = getSetting('company_name', 'SRJ Global Technologies');
  const officeAddress = getSetting('office_address', 'C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304');
  const contactEmail = getSetting('contact_email', 'srjglobaltechnology@gmail.com');
  const contactPhone = getSetting('contact_phone', '+91 99904 30305');
  const whatsappPhone = getSetting('whatsapp_phone', '+91 92667 06599');

  const pageTitle = getSetting('cookie_policy_title', 'Cookie Policy');
  const lastUpdated = getSetting('cookie_policy_last_updated', 'October 2025');
  const rawContent = getSetting('cookie_policy_content', '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const resolvedContent = (rawContent || '')
    .replaceAll('{{company_name}}', companyName);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "120px 24px 80px",
      }}
    >
      <SEO 
        pageKey="cookies"
        title={pageTitle}
        description="Read the official Cookie Policy of SRJ Global Technologies to understand how we utilize cookies and how you can manage tracking preferences."
        keywords="cookie policy, cookies, browser cookies, analytics, tracking, privacy, user preferences"
        url="https://srjglobaltechnology.com/cookies"
      />

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Page Title */}
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "54px", height: "54px", borderRadius: "16px", background: "#f1f5f9", color: "#0f172a", marginBottom: "16px" }}>
            <FaCookieBite size={28} />
          </div>
          <h1
            style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              color: "#000000",
              fontSize: "clamp(34px, 5vw, 48px)",
              fontWeight: "800",
              marginBottom: "12px",
              letterSpacing: "-0.03em",
            }}
          >
            {pageTitle}
          </h1>

          <p
            style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontStyle: "italic",
              color: "#64748b",
              fontSize: "15px",
            }}
          >
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Dynamic HTML Content */}
        {resolvedContent ? (
          <div
            className="legal-content prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: resolvedContent }}
            style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#475569",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: "'Geist Sans', 'Inter', sans-serif",
              fontSize: "16px",
              lineHeight: "1.8",
              color: "#475569",
            }}
          >
            <p style={{ marginBottom: "20px" }}>
              This Cookie Policy explains how {companyName} uses cookies, pixels, tags, and similar tracking technologies when you visit our website, client portals, and digital services.
            </p>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginTop: "36px", marginBottom: "16px" }}>
              1. What Are Cookies?
            </h2>
            <p style={{ marginBottom: "20px" }}>
              Cookies are small data files placed on your device to store user preferences, provide secure session continuity, and improve overall website responsiveness.
            </p>
            <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", marginTop: "36px", marginBottom: "16px" }}>
              2. Categories of Cookies We Use
            </h2>
            <ul style={{ paddingLeft: "25px", marginBottom: "20px" }}>
              <li style={{ marginBottom: "8px" }}><strong>Strictly Necessary:</strong> Core operations, security, login sessions.</li>
              <li style={{ marginBottom: "8px" }}><strong>Performance & Analytics:</strong> Tracking aggregate visitor traffic and bounce rates (e.g. Google Analytics).</li>
              <li style={{ marginBottom: "8px" }}><strong>Functionality:</strong> Language settings, form preferences, and theme styling.</li>
              <li style={{ marginBottom: "8px" }}><strong>Targeting & Marketing:</strong> Measuring advertising performance across channels.</li>
            </ul>
          </div>
        )}

        {/* Official Contact Box */}
        <div
          style={{
            marginTop: "50px",
            padding: "28px",
            borderRadius: "16px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            fontSize: "15px",
            lineHeight: "1.9",
            color: "#334155",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#0f172a", marginBottom: "8px", fontSize: "16px" }}>
            <FaShieldAlt size={16} /> Contact For Privacy & Cookies
          </div>
          <div><strong>{companyName}</strong></div>
          {officeAddress && <div>📍 {officeAddress}</div>}
          {contactEmail && <div>📧 {contactEmail}</div>}
          {contactPhone && <div>📞 {contactPhone}</div>}
          {whatsappPhone && <div>💬 {whatsappPhone}</div>}
        </div>
      </div>
    </div>
  );
}
