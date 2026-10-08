const db = require('./config/db');

/**
 * Auto-migration runner to ensure new tables and critical records
 * are seamlessly created on any environment (local, staging, production).
 */
async function runAutoMigrations() {
  try {
    // 1. Ensure collaboration_models table exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`collaboration_models\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`icon\` VARCHAR(100) NOT NULL DEFAULT 'Lightbulb',
        \`image\` VARCHAR(500) DEFAULT NULL,
        \`features\` TEXT NOT NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`sort_order\` INT NOT NULL DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`idx_collab_is_active\` (\`is_active\`),
        INDEX \`idx_collab_sort_order\` (\`sort_order\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Seed default collaboration models if empty
    const [collabRows] = await db.query('SELECT COUNT(*) as count FROM collaboration_models');
    if (collabRows[0].count === 0) {
      const defaultModels = [
        {
          title: 'Idea Validation & Consultation',
          description: 'We refine, validate, and strategically plan your business idea before a single line of code is written. Every successful product starts with proper planning and market research.',
          icon: 'Lightbulb',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
          features: JSON.stringify(['Market Research', 'Feasibility Analysis', 'MVP Scope Definition']),
          sort_order: 1
        },
        {
          title: 'Custom Software Development',
          description: 'We build mobile apps, websites, admin panels, CRM systems, SaaS platforms, and enterprise software using scalable architecture and future-ready technology stacks.',
          icon: 'Code',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          features: JSON.stringify(['Mobile Apps & Websites', 'Admin Panels & CRM', 'SaaS & Enterprise Software']),
          sort_order: 2
        },
        {
          title: 'Startup Launch Support',
          description: 'From MVP planning to go-to-market strategy, we help entrepreneurs launch successfully. We de-risk your launch with a proven product roadmap and execution framework.',
          icon: 'Rocket',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          features: JSON.stringify(['MVP Planning', 'Product Roadmap', 'Go-to-Market Strategy']),
          sort_order: 3
        },
        {
          title: 'Business Strategy & Guidance',
          description: "Technology alone isn't enough. We provide business consultation, market positioning, revenue strategy, customer acquisition guidance, and digital transformation advice.",
          icon: 'LineChart',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
          features: JSON.stringify(['Business Consultation', 'Revenue Strategy', 'Digital Transformation']),
          sort_order: 4
        },
        {
          title: 'B2B & B2C Digital Solutions',
          description: 'Expertise across B2B platforms, B2C applications, marketplace solutions, vendor systems, customer portals, and internal business automation tools.',
          icon: 'Globe',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
          features: JSON.stringify(['B2B / B2C Platforms', 'Marketplaces & Portals', 'Business Automation']),
          sort_order: 5
        },
        {
          title: 'Post-Launch Support & Growth',
          description: 'We stay with you after launch. Technical maintenance, feature enhancements, bug fixes, performance monitoring, security updates, and dedicated long-term partnership.',
          icon: 'ShieldCheck',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          features: JSON.stringify(['Maintenance & Support', 'Feature Enhancements', 'Long-Term Partnership']),
          sort_order: 6
        }
      ];

      for (const m of defaultModels) {
        await db.query(
          'INSERT INTO collaboration_models (title, description, icon, image, features, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)',
          [m.title, m.description, m.icon, m.image, m.features, m.sort_order]
        );
      }
      console.log('[Migration] Seeded default collaboration models');
    }

    // 2. Ensure critical site_settings exist
    const defaultSettings = [
      ['home_services_badge', 'CAPABILITIES', 'home'],
      ['home_services_title', 'Premium Engineering Services', 'home'],
      ['home_services_subtitle', 'We deliver state-of-the-art technological solutions built to drive growth and efficiency.', 'home'],
      ['collab_hero_badge', 'Partnership Hub', 'collaboration'],
      ['collab_hero_title', 'Build The Future Together.', 'collaboration'],
      ['collab_hero_subtitle', "We don't just write code; we build businesses. Explore how we partner with you at every stage of your digital journey to ensure scalable and sustainable success.", 'collaboration'],
      ['collab_section_badge', 'OUR OFFERINGS', 'collaboration'],
      ['collab_section_title', 'Collaboration Models', 'collaboration'],
      ['collab_section_subtitle', 'End-to-end technological and strategic support for your business.', 'collaboration'],
      ['collab_cta_title', 'Ready to Transform Your Idea?', 'collaboration'],
      ['collab_cta_subtitle', "Let's build something extraordinary together. Connect with our engineering and strategy experts today.", 'collaboration'],
      ['collab_cta_btn_primary', 'Discuss Your Project', 'collaboration'],
      ['collab_cta_btn_secondary', 'Explore Services', 'collaboration'],
      // Global AEO & GEO Knowledge Graph
      ['geo_knows_about', 'Custom Software Development, Web Applications, Mobile App Engineering, Unity Game Development, Real Money Games, AI Solutions, Cloud Infrastructure, DevOps', 'seo'],
      ['geo_ai_summary', 'SRJ Global Technologies is a premier global software engineering firm headquartered in India, specializing in enterprise digital transformation, scalable cloud architectures, custom web & mobile apps, and real-money gaming platforms.', 'seo'],
      // Page-by-Page SEO Metadata
      ['seo_home_title', 'Software Development & IT Solutions | SRJ Global Technologies', 'seo'],
      ['seo_home_description', 'SRJ Global Technologies specializes in custom software development, IT consulting, game engineering, and innovative digital solutions to propel your business forward.', 'seo'],
      ['seo_home_keywords', 'software development, IT solutions, SRJ Global Technologies, web development, app development, game development', 'seo'],
      ['seo_about_title', 'About Us | SRJ Global Technologies', 'seo'],
      ['seo_about_description', 'Learn more about SRJ Global Technologies, our mission, vision, and the expert team driving digital transformation for businesses worldwide.', 'seo'],
      ['seo_about_keywords', 'about SRJ Global Technologies, IT company, digital transformation, tech experts', 'seo'],
      ['seo_services_title', 'Enterprise IT & Custom Software Engineering Services | SRJ Global Technologies', 'seo'],
      ['seo_services_description', 'Explore our complete range of software development, artificial intelligence, cloud, and IT consulting services built for modern scale.', 'seo'],
      ['seo_services_keywords', 'custom software services, mobile app development, web development, cloud solutions, AI engineering', 'seo'],
      ['seo_pricing_title', 'B2B Software & IT Consulting Pricing | SRJ Global Technologies', 'seo'],
      ['seo_pricing_description', 'Explore transparent, flexible investment models for custom web development, mobile apps, enterprise software, and AI solutions.', 'seo'],
      ['seo_pricing_keywords', 'IT consulting pricing, software development cost, custom web app pricing, enterprise software quote, SRJ Global pricing', 'seo'],
      ['seo_industries_title', 'Industry-Specific Software & Tech Solutions | SRJ Global Technologies', 'seo'],
      ['seo_industries_description', 'Transforming key industries including Gaming, FinTech, E-Commerce, Healthcare, EdTech, Real Estate, and Enterprise with tailored software solutions.', 'seo'],
      ['seo_industries_keywords', 'industry software solutions, gaming technology, fintech development, ecommerce platforms, healthcare software', 'seo'],
      ['seo_collaboration_title', 'Partnership & Collaboration Models | SRJ Global Technologies', 'seo'],
      ['seo_collaboration_description', 'Collaborate with SRJ Global Technologies. Explore our flexible engagement models from MVP consultation to dedicated engineering teams.', 'seo'],
      ['seo_collaboration_keywords', 'software development partner, IT collaboration models, dedicated developers, startup MVP partner', 'seo'],
      ['seo_careers_title', 'Careers & Job Opportunities | Join SRJ Global Technologies', 'seo'],
      ['seo_careers_description', 'Explore exciting career opportunities at SRJ Global Technologies. Build cutting-edge technology and grow with a world-class engineering team.', 'seo'],
      ['seo_careers_keywords', 'tech jobs, software engineer careers, developer hiring, SRJ Global careers, remote IT jobs', 'seo'],
      ['seo_contact_title', 'Contact Us | Schedule a Project Consultation | SRJ Global Technologies', 'seo'],
      ['seo_contact_description', 'Get in touch with SRJ Global Technologies to discuss your next big project or software development needs with our senior architects.', 'seo'],
      ['seo_contact_keywords', 'contact SRJ Global Technologies, hire developers, IT consultation, project quote', 'seo'],
      ['seo_blog_title', 'Insights, Tech Articles & Engineering Blog | SRJ Global Technologies', 'seo'],
      ['seo_blog_description', 'Read the latest tech insights, engineering trends, software development best practices, and industry news from SRJ Global experts.', 'seo'],
      ['seo_blog_keywords', 'software development blog, IT articles, tech insights, web development trends', 'seo'],
      ['seo_privacy_title', 'Privacy Policy | SRJ Global Technologies', 'seo'],
      ['seo_privacy_description', 'Read the official Privacy Policy of SRJ Global Technologies explaining data collection, user protection, and compliance standards.', 'seo'],
      ['seo_privacy_keywords', 'privacy policy, data security, user privacy, SRJ Global compliance', 'seo'],
      ['seo_terms_title', 'Terms & Conditions | SRJ Global Technologies', 'seo'],
      ['seo_terms_description', 'Review our Terms and Conditions for utilizing SRJ Global Technologies services, platforms, and technological consulting.', 'seo'],
      ['seo_terms_keywords', 'terms and conditions, user agreement, service terms, legal notice', 'seo'],
      // Complete Footer & Contact Settings
      ['footer_description', 'Innovative digital solutions: we build high-quality websites, mobile apps, and custom enterprise platforms for growing brands.', 'footer'],
      ['footer_copyright', '© {year} SRJ Global Technologies. All rights reserved.', 'footer'],
      ['footer_col2_title', 'Quick Links', 'footer'],
      ['footer_col3_title', 'Get In Touch', 'footer'],
      ['footer_col3_email_label', 'EMAIL', 'footer'],
      ['footer_col3_phone_label', 'PHONE & WHATSAPP', 'footer'],
      ['footer_col3_office_label', 'OFFICE', 'footer'],
      ['footer_col4_title', 'Review Us', 'footer'],
      ['footer_review_text', 'Your feedback helps us deliver cutting-edge software products.', 'footer'],
      ['footer_review_btn_text', 'Google Review', 'footer'],
      ['footer_show_review_btn', '1', 'footer'],
      ['google_review_url', 'https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID', 'footer'],
      ['contact_email', 'srjglobaltechnology@gmail.com', 'contact'],
      ['contact_phone', '+91 99904 30305', 'contact'],
      ['whatsapp_phone', '+91 92667 06599', 'contact'],
      ['office_address', 'C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304', 'contact'],
      ['google_maps_url', 'https://maps.google.com/?q=Urbtech+Trade+Center+Tower+Noida+Sector+132', 'contact'],
      ['social_instagram', 'https://www.instagram.com/', 'social'],
      ['social_pinterest', 'https://www.pinterest.com/', 'social'],
      ['social_youtube', 'https://www.youtube.com/', 'social'],
      ['social_facebook', 'https://www.facebook.com/', 'social'],
      ['social_twitter', 'https://twitter.com/', 'social'],
      ['social_linkedin', 'https://www.linkedin.com/', 'social'],
      // Legal & Compliance Policies (Fully Editable from Admin Panel)
      ['privacy_policy_title', 'Privacy Policy', 'legal'],
      ['privacy_policy_last_updated', 'October 2025', 'legal'],
      ['privacy_policy_disclaimer', 'Disclaimer: In case of any discrepancy or difference, the English version of this Privacy Policy shall prevail.', 'legal'],
      ['privacy_policy_content', `<section class="policy-section">
  <h2>1. Introduction</h2>
  <p>At <strong>{{company_name}}</strong>, we value your privacy and are committed to safeguarding the personal information you share with us. This Privacy Policy explains how we collect, use, and protect your data when you interact with our website, digital platforms, and IT services. By using our services, you agree to the terms outlined in this policy.</p>
</section>

<section class="policy-section">
  <h2>2. Information We Collect</h2>
  <p>We may collect the following types of information to provide you with better services:</p>
  <ul>
    <li><strong>Personal Information:</strong> Name, email address, phone number, and postal address when you contact us, request a quote, or use our services. Billing and payment information (if applicable). Login credentials or platform access only when explicitly provided for services such as SEO, hosting, or digital marketing.</li>
    <li><strong>Non-Personal Information:</strong> IP address, browser type, operating system, and device details. Analytics data such as pages visited, time spent on site, and user behavior. Cookies and session data to improve your website experience.</li>
    <li><strong>Third-Party Integrations:</strong> Data from trusted third-party tools (such as Google Analytics, Meta Ads, or other marketing platforms) to measure performance and improve campaigns.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>3. How We Use Your Information</h2>
  <p>We use your information to:</p>
  <ul>
    <li>Deliver and manage our services such as website development, mobile apps, SEO, and IT solutions.</li>
    <li>Communicate with you regarding inquiries, project updates, or support requests.</li>
    <li>Process secure payments and invoices.</li>
    <li>Personalize your experience and optimize our website’s functionality.</li>
    <li>Track and analyze marketing campaign performance.</li>
    <li>Send newsletters, updates, or promotional offers (with an option to unsubscribe).</li>
    <li>Comply with legal and regulatory obligations.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>4. How We Share Your Information</h2>
  <p>We do not sell or rent your personal data. However, we may share your information in these cases:</p>
  <ul>
    <li><strong>With Trusted Service Providers:</strong> Payment processors, hosting companies, analytics providers, or SMS/email service partners.</li>
    <li><strong>For Legal Compliance:</strong> If required by law, regulation, or court order.</li>
    <li><strong>Business Transfers:</strong> If <strong>{{company_name}}</strong> undergoes a merger, acquisition, or restructuring.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>5. Cookies and Tracking Technologies</h2>
  <p>We use cookies, pixels, and similar technologies to:</p>
  <ul>
    <li>Enhance user experience and retain sessions.</li>
    <li>Track site performance and visitor behavior.</li>
    <li>Improve marketing and advertising effectiveness.</li>
    <li>Remember user preferences and settings.</li>
  </ul>
  <p>You can manage your cookie preferences at any time by visiting our dedicated <a href="/cookies">Cookie Policy</a>.</p>
</section>

<section class="policy-section">
  <h2>6. Data Security</h2>
  <p>We implement industry-standard measures such as SSL encryption, firewalls, and access controls to protect your information. However, no online system can guarantee 100% security. If you believe your data has been compromised, please contact us immediately.</p>
</section>

<section class="policy-section">
  <h2>7. Your Rights</h2>
  <p>You have the right to:</p>
  <ul>
    <li>Request access to the personal information we hold about you.</li>
    <li>Correct or update inaccurate data.</li>
    <li>Opt out of marketing communications at any time.</li>
    <li>Request deletion of your personal data, subject to legal and contractual obligations.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>8. Data Retention</h2>
  <p>We retain personal information only as long as necessary for business, legal, or security purposes. Where possible, we anonymize or aggregate data for analytics.</p>
</section>

<section class="policy-section">
  <h2>9. Children's Privacy</h2>
  <p>Our services are intended for individuals 18 years and older. We do not knowingly collect personal information from minors. If such data is discovered, it will be deleted promptly.</p>
</section>

<section class="policy-section">
  <h2>10. Third-Party Links</h2>
  <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices, policies, or content of those websites. We encourage users to review their privacy policies before providing personal information.</p>
</section>

<section class="policy-section">
  <h2>11. Updates to This Policy</h2>
  <p>We may update this Privacy Policy from time to time to reflect changes in technology, regulations, or our services. Updates will be posted here with a revised “Last Updated” date. Continued use of our services constitutes acceptance of the updated policy.</p>
</section>`, 'legal'],
      ['terms_conditions_title', 'Terms and Conditions', 'legal'],
      ['terms_conditions_last_updated', 'October 2025', 'legal'],
      ['terms_conditions_content', `<p>Welcome to <strong>{{company_name}}</strong> (“we,” “our,” or “us”). We’re delighted to have you here! These Terms and Conditions (“Terms”) are meant to provide clarity on how you can enjoy and make the most of our IT services, products, and solutions. By choosing to work with us, you’re placing your trust in our team, and we’re committed to supporting you every step of the way.</p>

<section class="policy-section">
  <h2>1. Introduction</h2>
  <p><strong>{{company_name}}</strong> is a leading IT solutions provider offering a wide range of digital and technology services. These Terms ensure transparency, clarity, and mutual understanding between our team and our clients:</p>
  <ul>
    <li>Website Design & Development</li>
    <li>Mobile App Development</li>
    <li>E-commerce Solutions</li>
    <li>Digital Marketing & SEO</li>
    <li>Hosting, Cloud, and Maintenance Services</li>
    <li>IT Consulting & Custom Software Development</li>
    <li>Bulk SMS & Email Marketing Services</li>
  </ul>
</section>

<section class="policy-section">
  <h2>2. Services & Deliverables</h2>
  <ul>
    <li>Each service engagement will be defined by a separate service agreement, proposal, or contract.</li>
    <li>We may engage third-party tools, platforms, or APIs to deliver services.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>3. Client Responsibilities</h2>
  <p>You, as our client, agree to:</p>
  <ul>
    <li>Provide all required materials, approvals, and feedback within agreed timelines.</li>
    <li>Ensure that all content, data, or assets shared do not infringe any third-party intellectual property rights.</li>
    <li>Comply with all applicable laws and regulations (e.g. privacy, advertising, anti-spam, and data protection laws).</li>
  </ul>
  <p>Delays or non-compliance on your part may affect project timelines or incur additional costs.</p>
</section>

<section class="policy-section">
  <h2>4. Payment Terms</h2>
  <ul>
    <li>A non-refundable advance payment is required to initiate any project.</li>
    <li>Payments must follow the milestone plan outlined in the service agreement or invoice.</li>
    <li>Late payments may result in service suspension, penalties, or interest charges.</li>
    <li>All fees are exclusive of applicable taxes unless stated otherwise.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>5. Project Timelines & Delivery</h2>
  <ul>
    <li>We will adhere to timelines as per the mutually agreed project plan.</li>
    <li>Client-side delays (e.g., late approvals or content delivery) may lead to revised schedules.</li>
    <li>Maintenance and update requests may take 3–7 business days depending on complexity.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>6. Revisions & Modifications</h2>
  <ul>
    <li>Website/app design projects include a predefined number of revisions as per the service contract. Additional revisions will incur extra charges.</li>
    <li>Digital marketing & SEO campaigns require a minimum of 3–6 months for measurable results.</li>
    <li>Any request to alter the original project scope will require a revised quote or change order.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>7. Intellectual Property Rights</h2>
  <ul>
    <li>All deliverables remain the intellectual property of <strong>{{company_name}}</strong> until full payment is received.</li>
    <li>Upon final payment, ownership of deliverables (e.g., website, app, or software) is transferred to the client, excluding third-party licensed tools, plugins, or services.</li>
    <li><strong>{{company_name}}</strong> reserves the right to showcase completed projects in its portfolio for marketing purposes.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>8. Third-Party Services</h2>
  <ul>
    <li>Some services depend on third-party platforms or providers. We are not liable for downtime, performance issues, or data breaches caused by such providers.</li>
    <li>Clients must also comply with the third-party provider’s terms of service.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>9. Confidentiality & Data Protection</h2>
  <ul>
    <li>Both parties agree to maintain confidentiality of all sensitive business and personal information.</li>
    <li>We adhere to applicable data protection laws and will not sell or misuse client data.</li>
    <li>Any data shared will be used strictly for service delivery purposes.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>10. Cancellation & Termination</h2>
  <ul>
    <li>Either party may terminate the agreement with 30 days’ written notice.</li>
    <li>If the client cancels midway, <strong>{{company_name}}</strong> will retain the advance payment as compensation for time, effort, and resources utilized.</li>
    <li>We reserve the right to terminate services immediately if the client breaches these Terms or engages in unlawful/unethical practices.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>11. Limitation of Liability</h2>
  <ul>
    <li>We are not responsible for indirect, incidental, or consequential damages arising from the use or inability to use our services.</li>
    <li>Our maximum liability under any agreement shall not exceed the total amount paid by the client for that particular service.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>12. Force Majeure</h2>
  <p><strong>{{company_name}}</strong> will not be held liable for delays or failures in service delivery due to events beyond our control, including but not limited to natural disasters, cyber-attacks, pandemics, government restrictions, or server downtime.</p>
</section>

<section class="policy-section">
  <h2>13. Governing Law & Jurisdiction</h2>
  <ul>
    <li>These Terms shall be governed by the laws of India.</li>
    <li>Any disputes shall be subject to the exclusive jurisdiction of the courts located in Noida, Uttar Pradesh, India.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>14. Amendments to Terms</h2>
  <ul>
    <li>We reserve the right to update or modify these Terms at any time.</li>
    <li>Clients will be notified of significant changes, and continued use of our services will imply acceptance of the updated Terms.</li>
  </ul>
</section>`, 'legal'],
      ['cookie_policy_title', 'Cookie Policy', 'legal'],
      ['cookie_policy_last_updated', 'October 2025', 'legal'],
      ['cookie_policy_content', `<p>This Cookie Policy explains how <strong>{{company_name}}</strong> uses cookies, pixels, tags, and similar technologies when you visit our website, client portals, and associated digital services.</p>

<section class="policy-section">
  <h2>1. What Are Cookies?</h2>
  <p>Cookies are small text files that are stored on your computer, tablet, or smartphone when you access a website. They help websites recognize your device, remember preferences, and analyze how you interact with content to provide a faster, safer, and more personalized experience.</p>
</section>

<section class="policy-section">
  <h2>2. Categories of Cookies We Use</h2>
  <p>We categorize cookies into four main types based on their purpose:</p>
  <ul>
    <li><strong>Strictly Necessary Cookies:</strong> Essential for core website operations, security authentication, server load balancing, and CSRF protection. The website cannot function correctly without these cookies.</li>
    <li><strong>Performance & Analytics Cookies:</strong> Collect anonymous data regarding how visitors navigate our pages (e.g., Google Analytics). This helps us evaluate bounce rates, popular content, and improve our platform's responsiveness.</li>
    <li><strong>Functionality Cookies:</strong> Remember your choices such as language preferences, region selection, and form autofill data to provide an enhanced personal experience.</li>
    <li><strong>Targeting & Marketing Cookies:</strong> Track browsing habits across websites to deliver relevant digital advertisements and evaluate the efficacy of our marketing campaigns.</li>
  </ul>
</section>

<section class="policy-section">
  <h2>3. Third-Party Cookies</h2>
  <p>In addition to first-party cookies set directly by our domain, certain trusted third-party partners may place cookies on your browser:</p>
  <ul>
    <li><strong>Google Analytics:</strong> Traffic analytics and user interaction tracking.</li>
    <li><strong>Google Fonts & CDN:</strong> Font rendering and global asset caching.</li>
    <li><strong>Social Media Integrations:</strong> Features enabling you to share content or view social feeds (e.g. LinkedIn, YouTube, Meta).</li>
  </ul>
</section>

<section class="policy-section">
  <h2>4. How to Manage and Disable Cookies</h2>
  <p>You have complete control over whether to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to reject them or notify you before a cookie is stored:</p>
  <ul>
    <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies</li>
    <li><strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Enhanced Tracking Protection</li>
    <li><strong>Apple Safari:</strong> Preferences → Privacy → Block all cookies</li>
    <li><strong>Microsoft Edge:</strong> Settings → Cookies and site permissions</li>
  </ul>
  <p><em>Please note: Disabling strictly necessary cookies may degrade certain core website functionalities, including login sessions and interactive quote forms.</em></p>
</section>

<section class="policy-section">
  <h2>5. Updates to This Cookie Policy</h2>
  <p>We may periodically revise this Cookie Policy to reflect technical, operational, or legal changes. Any modifications become effective immediately upon posting on this page.</p>
</section>`, 'legal'],
      ['seo_cookies_title', 'Cookie Policy | SRJ Global Technologies', 'seo'],
      ['seo_cookies_description', 'Learn how SRJ Global Technologies uses cookies and how you can manage your preferences.', 'seo'],
      ['seo_cookies_keywords', 'cookie policy, cookies, browser tracking, user preferences', 'seo']
    ];

    for (const [key, val, grp] of defaultSettings) {
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value, group_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE group_name = VALUES(group_name)',
        [key, val, grp]
      );
    }

    // Update Cookies link in footer_legal navigation to point to /cookies instead of #contact
    await db.query(
      "UPDATE navigation_items SET url = '/cookies' WHERE group_location = 'footer_legal' AND (label = 'Cookies' OR label = 'Cookie Policy') AND (url = '#contact' OR url = '#')"
    );

    // 3. Ensure navigation items sync: Careers in header, removed from footer
    await db.query("DELETE FROM navigation_items WHERE group_location = 'footer_quick' AND (label = 'Careers' OR url = '/careers')");
    
    const [headerCareer] = await db.query("SELECT id FROM navigation_items WHERE group_location = 'header' AND parent_id IS NULL AND (label = 'Careers' OR url = '/careers')");
    if (headerCareer.length === 0) {
      await db.query(
        "INSERT INTO navigation_items (group_location, parent_id, label, url, item_type, target, sort_order, is_active) VALUES ('header', NULL, 'Careers', '/careers', 'route', '_self', 4, 1)"
      );
    }

    // Reorder header and footer items
    await db.query("UPDATE navigation_items SET sort_order = 1 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'Home'");
    await db.query("UPDATE navigation_items SET sort_order = 2 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'Services'");
    await db.query("UPDATE navigation_items SET sort_order = 3 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'Pricing'");
    await db.query("UPDATE navigation_items SET sort_order = 4 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'Careers'");
    await db.query("UPDATE navigation_items SET sort_order = 5 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'Collaboration'");
    await db.query("UPDATE navigation_items SET sort_order = 6 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'Industries'");
    await db.query("UPDATE navigation_items SET sort_order = 7 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'About Us'");
    await db.query("UPDATE navigation_items SET sort_order = 8 WHERE group_location = 'header' AND parent_id IS NULL AND label = 'Contact Us'");

    // 4. Ensure blogs table has SEO, AEO, and rich article columns
    const [blogCols] = await db.query(
      'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?',
      ['blogs']
    );
    const existingBlogCols = new Set(blogCols.map(c => c.COLUMN_NAME));

    const blogColumnsToAdd = [
      { name: 'meta_title', definition: 'VARCHAR(255) DEFAULT NULL' },
      { name: 'meta_description', definition: 'TEXT DEFAULT NULL' },
      { name: 'meta_keywords', definition: 'VARCHAR(500) DEFAULT NULL' },
      { name: 'tags', definition: 'VARCHAR(500) DEFAULT NULL' },
      { name: 'author_role', definition: 'VARCHAR(255) DEFAULT NULL' },
      { name: 'author_image', definition: 'VARCHAR(500) DEFAULT NULL' },
      { name: 'reading_time', definition: 'VARCHAR(50) DEFAULT NULL' },
      { name: 'aeo_summary', definition: 'TEXT DEFAULT NULL' },
      { name: 'aeo_faqs', definition: 'TEXT DEFAULT NULL' },
      { name: 'key_takeaways', definition: 'TEXT DEFAULT NULL' }
    ];

    for (const col of blogColumnsToAdd) {
      if (!existingBlogCols.has(col.name)) {
        await db.query(`ALTER TABLE \`blogs\` ADD COLUMN \`${col.name}\` ${col.definition}`);
        console.log(`[Migration] Added column ${col.name} to blogs table`);
      }
    }

    // 5. Ensure jobs table has description, responsibilities, requirements, and perks columns
    const [jobCols] = await db.query(
      'SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?',
      ['jobs']
    );
    const existingJobCols = new Set(jobCols.map(c => c.COLUMN_NAME));

    const jobColumnsToAdd = [
      { name: 'description', definition: 'TEXT DEFAULT NULL' },
      { name: 'responsibilities', definition: 'TEXT DEFAULT NULL' },
      { name: 'requirements', definition: 'TEXT DEFAULT NULL' },
      { name: 'perks', definition: 'TEXT DEFAULT NULL' }
    ];

    for (const col of jobColumnsToAdd) {
      if (!existingJobCols.has(col.name)) {
        await db.query(`ALTER TABLE \`jobs\` ADD COLUMN \`${col.name}\` ${col.definition}`);
        console.log(`[Migration] Added column ${col.name} to jobs table`);
      }
    }

    // Seed default comprehensive engineering jobs if fewer than 3 active jobs
    const [jobCountRows] = await db.query('SELECT COUNT(*) as count FROM jobs');
    if (jobCountRows[0].count <= 1) {
      const defaultJobs = [
        {
          title: 'Senior Full-Stack Cloud Engineer',
          location: 'Remote / Mumbai',
          experience: '4-7 Years',
          type: 'Full-time',
          salary: '₹18 - ₹30 LPA',
          category: 'Engineering',
          tags: JSON.stringify(['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS']),
          description: 'We are seeking an experienced Senior Full-Stack Engineer to lead the architecture and implementation of highly scalable enterprise web applications and distributed cloud services.',
          responsibilities: JSON.stringify([
            'Architect, build, and deploy low-latency, high-availability microservices using Node.js and TypeScript.',
            'Collaborate with product designers to implement responsive, performant React web interfaces.',
            'Design and optimize relational and document database schemas with PostgreSQL and Redis.',
            'Drive automated CI/CD pipeline deployments and Docker containerization on AWS.'
          ]),
          requirements: JSON.stringify([
            '4+ years of professional full-stack development experience with Node.js and React.',
            'Strong understanding of RESTful API design, GraphQL, and microservice architectures.',
            'Hands-on experience with cloud infrastructure (AWS/GCP), Docker, and container orchestration.',
            'Solid grasp of SQL performance tuning and transactional integrity.'
          ]),
          perks: JSON.stringify([
            'Remote-first work flexibility with home office stipend',
            'Competitive equity and bi-annual performance bonuses',
            'Annual learning budget for tech courses and certifications',
            'Comprehensive family health & medical insurance'
          ])
        },
        {
          title: 'Lead Mobile Application Architect',
          location: 'Remote / Hybrid',
          experience: '5-8 Years',
          type: 'Full-time',
          salary: '₹22 - ₹35 LPA',
          category: 'Engineering',
          tags: JSON.stringify(['Flutter', 'Dart', 'React Native', 'iOS', 'Android']),
          description: 'Join SRJ Global to spearhead cross-platform mobile app development. You will architect robust, fluid mobile experiences deployed to hundreds of thousands of users.',
          responsibilities: JSON.stringify([
            'Lead the end-to-end design and release of high-performance iOS and Android applications using Flutter and React Native.',
            'Integrate real-time WebSockets, push notification engines, and secure payment SDKs.',
            'Establish automated mobile testing, crash reporting, and App Store / Play Store deployment workflows.',
            'Mentor mid-level mobile developers on clean state management (Bloc, Riverpod, Redux).'
          ]),
          requirements: JSON.stringify([
            '5+ years in mobile development with at least 3 years building production Flutter or React Native apps.',
            'Proven track record of publishing multiple consumer-facing mobile apps on Apple App Store and Google Play.',
            'Deep expertise in native platform bridging (Java/Kotlin and Swift/Objective-C).',
            'Strong sense for 60fps UI animations, fluid touch gestures, and responsive layouts.'
          ]),
          perks: JSON.stringify([
            'Latest Apple M-series MacBook Pro and device testing lab provided',
            'Flexible working hours with async-friendly collaboration',
            'Health and wellness allowances',
            'Paid leaves and parental benefits'
          ])
        },
        {
          title: 'Principal AI & ML Solutions Engineer',
          location: 'Remote',
          experience: '3-6 Years',
          type: 'Full-time',
          salary: '₹24 - ₹38 LPA',
          category: 'Engineering',
          tags: JSON.stringify(['Python', 'PyTorch', 'LLMs', 'RAG', 'LangChain', 'Vector DB']),
          description: 'Build the next generation of applied artificial intelligence at SRJ Global. You will design and deploy Retrieval-Augmented Generation (RAG) pipelines, fine-tuned LLM agents, and real-time inference systems.',
          responsibilities: JSON.stringify([
            'Design production RAG pipelines integrating enterprise knowledge bases with advanced vector databases (Pinecone, Qdrant, Milvus).',
            'Develop custom agentic workflows utilizing LangChain, LlamaIndex, and function-calling LLM models.',
            'Optimize inference latency, caching layers, and token efficiency for enterprise clients.',
            'Evaluate and implement model safety guards, hallucinations detection, and evaluation benchmarks.'
          ]),
          requirements: JSON.stringify([
            'Strong background in computer science, mathematics, or related field with 3+ years in AI/ML engineering.',
            'Proficiency with Python, PyTorch/TensorFlow, Hugging Face transformers, and LLM APIs.',
            'Practical experience building RAG architectures, semantic embeddings, and vector databases.',
            'Familiarity with containerized model serving (vLLM, Triton, FastAPI, Docker).'
          ]),
          perks: JSON.stringify([
            'Generous cloud GPU budget for experimentation and benchmarking',
            'Direct access to cutting-edge AI enterprise projects',
            'Full conference sponsorships (NeurIPS, ICML, PyCon)',
            'Comprehensive health coverage'
          ])
        },
        {
          title: 'Senior UI/UX Product Designer',
          location: 'Hybrid / Mumbai',
          experience: '3-6 Years',
          type: 'Full-time',
          salary: '₹14 - ₹22 LPA',
          category: 'Product & Design',
          tags: JSON.stringify(['Figma', 'Design Systems', 'User Research', 'Wireframing']),
          description: 'Shape the visual identity and usability of modern digital products. You will turn complex user workflows into intuitive, visually stunning web and mobile interfaces.',
          responsibilities: JSON.stringify([
            'Create high-fidelity interactive prototypes, design systems, and component libraries in Figma.',
            'Conduct user interviews, usability testing, and translate analytical insights into product design improvements.',
            'Collaborate closely with front-end developers to ensure pixel-perfect design implementation.',
            'Define design guidelines for accessibility (WCAG), micro-interactions, and responsive design.'
          ]),
          requirements: JSON.stringify([
            '3+ years of professional product design experience with an outstanding portfolio of web & mobile apps.',
            'Mastery of Figma, auto-layout, interactive prototyping, and design token management.',
            'Deep empathy for user needs paired with strong aesthetic and typography taste.',
            'Experience collaborating closely with software development teams.'
          ]),
          perks: JSON.stringify([
            'Top-tier creative hardware setup and Figma enterprise access',
            'Flexible hybrid working environment',
            'Design workshop stipends and portfolio growth support'
          ])
        },
        {
          title: 'DevOps & Cloud Infrastructure Lead',
          location: 'Remote',
          experience: '4-8 Years',
          type: 'Full-time',
          salary: '₹20 - ₹34 LPA',
          category: 'Engineering',
          tags: JSON.stringify(['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Prometheus']),
          description: 'Lead SRJ Global’s cloud infrastructure strategy, automated zero-downtime CI/CD pipelines, and multi-region high availability architectures.',
          responsibilities: JSON.stringify([
            'Provision and manage immutable cloud infrastructure using Terraform and Infrastructure-as-Code (IaC).',
            'Maintain Kubernetes clusters (EKS/GKE) with GitOps workflows (ArgoCD) and automated autoscaling.',
            'Implement centralized observability with Prometheus, Grafana, OpenTelemetry, and ELK stack.',
            'Enforce SOC2/ISO security standards, IAM policies, and automated vulnerability scanning.'
          ]),
          requirements: JSON.stringify([
            '4+ years in DevOps/SRE roles managing production cloud workloads on AWS or GCP.',
            'Strong production experience with Kubernetes container orchestration and Helm charts.',
            'Expertise in Terraform, GitHub Actions CI/CD pipelines, and Linux system administration.',
            'Proven track record in setting up distributed tracing and alerting systems.'
          ]),
          perks: JSON.stringify([
            'Full remote flexibility',
            'Annual AWS/Cloud certification reimbursements',
            'Premium health and wellness insurance',
            'Annual performance rewards'
          ])
        }
      ];

      for (const dj of defaultJobs) {
        await db.query(
          'INSERT INTO jobs (title, location, experience, type, salary, category, tags, description, responsibilities, requirements, perks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            dj.title,
            dj.location,
            dj.experience,
            dj.type,
            dj.salary,
            dj.category,
            dj.tags,
            dj.description,
            dj.responsibilities,
            dj.requirements,
            dj.perks
          ]
        );
      }
      console.log('[Migration] Seeded default comprehensive engineering jobs');
    }

    console.log('[Migration] Database tables, site settings, blogs, jobs schema, and navigation sync completed successfully.');
  } catch (err) {
    console.error('[Migration Error] Non-fatal migration check failed:', err.message);
  }
}

module.exports = { runAutoMigrations };
