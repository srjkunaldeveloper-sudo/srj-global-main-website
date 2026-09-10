import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaInfoCircle,
  FaGlobe,
  FaCog,
  FaShareAlt,
  FaCogs,
  FaUserShield,
  FaUserCheck,
  FaLock,
  FaExternalLinkAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { useSiteSettings } from "../context/SiteSettingsContext";

function PrivacyPolicy() {
  const location = useLocation();
  const { getSetting } = useSiteSettings();

  const companyName = getSetting('company_name', 'SRJ Global Technologies');
  const officeAddress = getSetting('office_address', 'C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304');
  const contactEmail = getSetting('contact_email', 'srjglobaltechnology@gmail.com');
  const contactPhone = getSetting('contact_phone', '+91 99904 30305');
  const whatsappPhone = getSetting('whatsapp_phone', '+91 92667 06599');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const sectionTitle = {
    fontFamily: "'Geist Sans', 'Inter', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
    marginTop: "40px",
    letterSpacing: "-0.02em",
  };

  const iconStyle = {
    color: "#0f172a",
    fontSize: "18px",
  };

  const textStyle = {
    fontFamily: "'Geist Sans', 'Inter', sans-serif",
    fontSize: "16px",
    lineHeight: "1.75",
    color: "#475569",
    marginBottom: "16px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "120px 24px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            textAlign: "center",
            color: "#000000",
            fontSize: "clamp(34px, 5vw, 48px)",
            fontWeight: "800",
            marginBottom: "20px",
            letterSpacing: "-0.03em",
          }}
        >
          Privacy Policy
        </h1>

        <p
          style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            textAlign: "center",
            fontStyle: "italic",
            color: "#64748b",
            fontSize: "15px",
            marginBottom: "50px",
          }}
        >
          Disclaimer: In case of any discrepancy or difference, the English
          version of this Privacy Policy shall prevail.
        </p>

        {/* Section 1 */}
        <h2 style={sectionTitle}>
          <FaInfoCircle style={iconStyle} />
          1. Introduction
        </h2>

        <p style={textStyle}>
          At {companyName}, we value your privacy and are committed to
          safeguarding the personal information you share with us. This Privacy
          Policy explains how we collect, use, and protect your data when you
          interact with our website, digital platforms, and IT services. By
          using our services, you agree to the terms outlined in this policy.
        </p>

        {/* Section 2 */}
        <h2 style={sectionTitle}>
          <FaGlobe style={iconStyle} />
          2. Information We Collect
        </h2>

        <p style={textStyle}>
          We may collect the following types of information to provide you with
          better services:
        </p>

        <p style={textStyle}>
          <strong>a) Personal Information:</strong> Name, email address, phone
          number, and postal address when you contact us, request a quote, or
          use our services. Billing and payment information (if applicable).
          Login credentials or platform access only when explicitly provided for
          services such as SEO, hosting, or digital marketing.
        </p>

        <p style={textStyle}>
          <strong>b) Non-Personal Information:</strong> IP address, browser
          type, operating system, and device details. Analytics data such as
          pages visited, time spent on site, and user behavior. Cookies and
          session data to improve your website experience.
        </p>

        <p style={textStyle}>
          <strong>c) Third-Party Integrations:</strong> Data from trusted
          third-party tools (such as Google Analytics, Meta Ads, or other
          marketing platforms) to measure performance and improve campaigns.
        </p>

        {/* Section 3 */}
        <h2 style={sectionTitle}>
          <FaCog style={iconStyle} />
          3. How We Use Your Information
        </h2>

        <p style={textStyle}>We use your information to:</p>

        <ul
          style={{
            ...textStyle,
            paddingLeft: "25px",
          }}
        >
          <li>
            Deliver and manage our services such as website development, mobile
            apps, SEO, and IT solutions.
          </li>
          <li>
            Communicate with you regarding inquiries, project updates, or
            support requests.
          </li>
          <li>Process secure payments and invoices.</li>
          <li>
            Personalize your experience and optimize our website’s
            functionality.
          </li>
          <li>Track and analyze marketing campaign performance.</li>
          <li>
            Send newsletters, updates, or promotional offers (with an option to
            unsubscribe).
          </li>
          <li>Comply with legal and regulatory obligations.</li>
        </ul>

        {/* Section 4 */}
        <h2 style={sectionTitle}>
          <FaShareAlt style={iconStyle} />
          4. How We Share Your Information
        </h2>

        <p style={textStyle}>
          We do not sell or rent your personal data. However, we may share your
          information in these cases:
        </p>

        <ul
          style={{
            ...textStyle,
            paddingLeft: "25px",
          }}
        >
          <li>
            <strong>With Trusted Service Providers:</strong> Payment processors,
            hosting companies, analytics providers, or SMS/email service
            partners.
          </li>

          <li>
            <strong>For Legal Compliance:</strong> If required by law,
            regulation, or court order.
          </li>

          <li>
            <strong>Business Transfers:</strong> If {companyName}
            undergoes a merger, acquisition, or restructuring.
          </li>
        </ul>

        {/* Section 5 */}
        <h2 style={sectionTitle}>
          <FaCogs style={iconStyle} />
          5. Cookies and Tracking Technologies
        </h2>

        <p style={textStyle}>
          We use cookies, pixels, and similar technologies to:
        </p>

        <ul
          style={{
            ...textStyle,
            paddingLeft: "25px",
          }}
        >
          <li>Enhance user experience.</li>
          <li>Track site performance and visitor behavior.</li>
          <li>Improve marketing and advertising effectiveness.</li>
          <li>Remember user preferences and settings.</li>
        </ul>
        {/* Section 6 */}
        <h2 style={sectionTitle}>
          <FaUserShield style={iconStyle} />
          6. Data Security
        </h2>

        <p style={textStyle}>
          We implement industry-standard measures such as SSL encryption,
          firewalls, and access controls to protect your information. However,
          no online system can guarantee 100% security. If you believe your data
          has been compromised, please contact us immediately.
        </p>

        {/* Section 7 */}
        <h2 style={sectionTitle}>
          <FaUserCheck style={iconStyle} />
          7. Your Rights
        </h2>

        <p style={textStyle}>You have the right to:</p>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>Request access to the personal information we hold about you.</li>
          <li>Correct or update inaccurate data.</li>
          <li>Opt out of marketing communications at any time.</li>
          <li>
            Request deletion of your personal data, subject to legal and
            contractual obligations.
          </li>
        </ul>

        {/* Section 8 */}
        <h2 style={sectionTitle}>
          <FaLock style={iconStyle} />
          8. Data Retention
        </h2>

        <p style={textStyle}>
          We retain personal information only as long as necessary for business,
          legal, or security purposes. Where possible, we anonymize or aggregate
          data for analytics.
        </p>

        {/* Section 9 */}
        <h2 style={sectionTitle}>
          <FaInfoCircle style={iconStyle} />
          9. Children's Privacy
        </h2>

        <p style={textStyle}>
          Our services are intended for individuals 18 years and older. We do
          not knowingly collect personal information from minors. If such data
          is discovered, it will be deleted promptly.
        </p>

        {/* Section 10 */}
        <h2 style={sectionTitle}>
          <FaExternalLinkAlt style={iconStyle} />
          10. Third-Party Links
        </h2>

        <p style={textStyle}>
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices, policies, or content of those
          websites. We encourage users to review their privacy policies before
          providing personal information.
        </p>

        {/* Section 11 */}
        <h2 style={sectionTitle}>
          <FaSyncAlt style={iconStyle} />
          11. Updates to This Policy
        </h2>

        <p style={textStyle}>
          We may update this Privacy Policy from time to time to reflect changes
          in technology, regulations, or our services. Updates will be posted
          here with a revised “Last Updated” date. Continued use of our services
          constitutes acceptance of the updated policy.
        </p>

        {/* Section 12 */}
        <h2 style={sectionTitle}>
          <FaInfoCircle style={iconStyle} />
          12. Contact Us
        </h2>

        <p style={textStyle}>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy, please reach out to us:
        </p>

        <div
          style={{
            ...textStyle,
            marginTop: "15px",
            lineHeight: "2",
          }}
        >
          <strong>{companyName}</strong>
          <br />
          📍 {officeAddress}
          <br />
          📧 {contactEmail}
          {contactPhone && (
            <>
              <br />
              📞 {contactPhone}
            </>
          )}
          {whatsappPhone && (
            <>
              <br />
              📞 {whatsappPhone}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
