import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "../context/SiteSettingsContext";

function TermsConditions() {
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

  const textStyle = {
    fontFamily: "'Geist Sans', 'Inter', sans-serif",
    fontSize: "16px",
    lineHeight: "1.75",
    color: "#475569",
    marginBottom: "20px",
  };

  const headingStyle = {
    fontFamily: "'Geist Sans', 'Inter', sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginTop: "40px",
    marginBottom: "18px",
    letterSpacing: "-0.02em",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "120px 24px 80px",
      }}
    >
      {/* Page Title */}
      <h1
        style={{
          fontFamily: "'Geist Sans', 'Inter', sans-serif",
          textAlign: "center",
          color: "#000000",
          fontSize: "clamp(34px, 5vw, 48px)",
          fontWeight: "800",
          marginBottom: "45px",
          letterSpacing: "-0.03em",
        }}
      >
        Terms and Conditions
      </h1>

      {/* Content Box */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
            fontStyle: "italic",
            color: "#64748b",
            marginBottom: "35px",
            fontSize: "15px",
          }}
        >
          Last Updated: 10/9/2025
        </p>

        <p style={textStyle}>
          Welcome to {companyName} (“we,” “our,” or “us”). We’re
          delighted to have you here! These Terms and Conditions (“Terms”) are
          meant to provide clarity on how you can enjoy and make the most of our
          IT services, products, and solutions. By choosing to work with us,
          you’re placing your trust in our team, and we’re committed to
          supporting you every step of the way. If at any time these Terms don’t
          meet your expectations, you always have the option to discontinue
          using our services — though we’ll be sad to see you go.
        </p>

        {/* Section 1 */}
        <h2 style={headingStyle}>1. Introduction</h2>

        <p style={textStyle}>
          {companyName} is a leading IT solutions provider offering a
          wide range of digital and technology services. These Terms ensure
          transparency, clarity, and mutual understanding between {companyName} and our clients.
        </p>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>Website Design & Development</li>
          <li>Mobile App Development</li>
          <li>E-commerce Solutions</li>
          <li>Digital Marketing & SEO</li>
          <li>Hosting, Cloud, and Maintenance Services</li>
          <li>IT Consulting & Custom Software Development</li>
          <li>Bulk SMS & Email Marketing Services</li>
        </ul>

        {/* Section 2 */}
        <h2 style={headingStyle}>2. Services & Deliverables</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            Each service engagement will be defined by a separate service
            agreement, proposal, or contract.
          </li>

          <li>
            We may engage third-party tools, platforms, or APIs to deliver
            services.
          </li>
        </ul>

        {/* Section 3 */}
        <h2 style={headingStyle}>3. Client Responsibilities</h2>

        <p style={textStyle}>You, as our client, agree to:</p>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            Provide all required materials, approvals, and feedback within
            agreed timelines.
          </li>

          <li>
            Ensure that all content, data, or assets shared do not infringe any
            third-party intellectual property rights.
          </li>

          <li>
            Comply with all applicable laws and regulations (e.g. privacy,
            advertising, anti-spam, and data protection laws).
          </li>
        </ul>

        <p style={textStyle}>
          Delays or non-compliance on your part may affect project timelines or
          incur additional costs.
        </p>

        {/* Section 4 */}
        <h2 style={headingStyle}>4. Payment Terms</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            A non-refundable advance payment is required to initiate any
            project.
          </li>

          <li>
            Payments must follow the milestone plan outlined in the service
            agreement or invoice.
          </li>

          <li>
            Late payments may result in service suspension, penalties, or
            interest charges.
          </li>

          <li>
            All fees are exclusive of applicable taxes unless stated otherwise.
          </li>
        </ul>
        {/* Section 5 */}
        <h2 style={headingStyle}>5. Project Timelines & Delivery</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            We will adhere to timelines as per the mutually agreed project plan.
          </li>
          <li>
            Client-side delays (e.g., late approvals or content delivery) may
            lead to revised schedules.
          </li>
          <li>
            Maintenance and update requests may take 3–7 business days depending
            on complexity.
          </li>
        </ul>

        {/* Section 6 */}
        <h2 style={headingStyle}>6. Revisions & Modifications</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            Website/app design projects include a predefined number of revisions
            as per the service contract. Additional revisions will incur extra
            charges.
          </li>
          <li>
            Digital marketing & SEO campaigns require a minimum of 3–6 months
            for measurable results.
          </li>
          <li>
            Any request to alter the original project scope will require a
            revised quote or change order.
          </li>
        </ul>

        {/* Section 7 */}
        <h2 style={headingStyle}>7. Intellectual Property Rights</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            All deliverables remain the intellectual property of {companyName} until full payment is received.
          </li>
          <li>
            Upon final payment, ownership of deliverables (e.g., website, app,
            or software) is transferred to the client, excluding third-party
            licensed tools, plugins, or services.
          </li>
          <li>
            {companyName} reserves the right to showcase completed
            projects in its portfolio for marketing purposes.
          </li>
        </ul>

        {/* Section 8 */}
        <h2 style={headingStyle}>8. Third-Party Services</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            Some services depend on third-party platforms or providers. We are
            not liable for downtime, performance issues, or data breaches caused
            by such providers.
          </li>
          <li>
            Clients must also comply with the third-party provider’s terms of
            service.
          </li>
        </ul>

        {/* Section 9 */}
        <h2 style={headingStyle}>9. Confidentiality & Data Protection</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            Both parties agree to maintain confidentiality of all sensitive
            business and personal information.
          </li>
          <li>
            We adhere to applicable data protection laws and will not sell or
            misuse client data.
          </li>
          <li>
            Any data shared will be used strictly for service delivery purposes.
          </li>
        </ul>

        {/* Section 10 */}
        <h2 style={headingStyle}>10. Cancellation & Termination</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            Either party may terminate the agreement with 30 days’ written
            notice.
          </li>
          <li>
            If the client cancels midway, {companyName} will retain
            the advance payment as compensation for time, effort, and resources
            utilized.
          </li>
          <li>
            We reserve the right to terminate services immediately if the client
            breaches these Terms or engages in unlawful/unethical practices.
          </li>
        </ul>

        {/* Section 11 */}
        <h2 style={headingStyle}>11. Limitation of Liability</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            We are not responsible for indirect, incidental, or consequential
            damages arising from the use or inability to use our services.
          </li>
          <li>
            Our maximum liability under any agreement shall not exceed the total
            amount paid by the client for that particular service.
          </li>
        </ul>
        {/* Section 12 */}
        <h2 style={headingStyle}>12. Force Majeure</h2>

        <p style={textStyle}>
          {companyName} will not be held liable for delays or failures
          in service delivery due to events beyond our control, including but
          not limited to natural disasters, cyber-attacks, pandemics, government
          restrictions, or server downtime.
        </p>

        {/* Section 13 */}
        <h2 style={headingStyle}>13. Governing Law & Jurisdiction</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>These Terms shall be governed by the laws of India.</li>

          <li>
            Any disputes shall be subject to the exclusive jurisdiction of the
            courts located in Noida, Uttar Pradesh, India.
          </li>
        </ul>

        {/* Section 14 */}
        <h2 style={headingStyle}>14. Amendments to Terms</h2>

        <ul style={{ ...textStyle, paddingLeft: "25px" }}>
          <li>
            We reserve the right to update or modify these Terms at any time.
          </li>

          <li>
            Clients will be notified of significant changes, and continued use
            of our services will imply acceptance of the updated Terms.
          </li>
        </ul>

        {/* Section 15 */}
        <h2 style={headingStyle}>15. Contact Us</h2>

        <p style={textStyle}>
          For any questions, concerns, or clarifications regarding these Terms &
          Conditions, please contact us:
        </p>

        <div
          style={{
            marginTop: "20px",
            color: "#2f3c52",
            fontSize: "16px",
            lineHeight: "2",
            fontFamily: "'Geist Sans', 'Inter', sans-serif",
          }}
        >
          <strong>{companyName}</strong>
          {officeAddress && <p>📍 {officeAddress}</p>}
          {contactEmail && <p>📧 {contactEmail}</p>}
          {contactPhone && <p>📞 {contactPhone}</p>}
          {whatsappPhone && <p>📞 {whatsappPhone}</p>}
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;
