import React, { useState, useEffect } from 'react';
import api from '../../../config/api';
import { useSiteSettings } from '../../../context/SiteSettingsContext';
import {
  ShieldCheck,
  FileText,
  Cookie,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Code,
  Columns,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Heading,
  Bold,
  List,
  Link as LinkIcon,
  Info
} from 'lucide-react';

const DEFAULT_TEMPLATES = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'October 2025',
    disclaimer: 'Disclaimer: In case of any discrepancy or difference, the English version of this Privacy Policy shall prevail.',
    content: `<section class="policy-section">
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
</section>`
  },
  terms: {
    title: 'Terms and Conditions',
    lastUpdated: 'October 2025',
    disclaimer: '',
    content: `<p>Welcome to <strong>{{company_name}}</strong> (“we,” “our,” or “us”). We’re delighted to have you here! These Terms and Conditions (“Terms”) are meant to provide clarity on how you can enjoy and make the most of our IT services, products, and solutions. By choosing to work with us, you’re placing your trust in our team, and we’re committed to supporting you every step of the way.</p>

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
</section>`
  },
  cookies: {
    title: 'Cookie Policy',
    lastUpdated: 'October 2025',
    disclaimer: '',
    content: `<p>This Cookie Policy explains how <strong>{{company_name}}</strong> uses cookies, pixels, tags, and similar technologies when you visit our website, client portals, and associated digital services.</p>

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
</section>`
  }
};

export default function LegalPoliciesManager({ onNotify }) {
  const { refreshSettings } = useSiteSettings();
  const [activePolicy, setActivePolicy] = useState('privacy'); // 'privacy' | 'terms' | 'cookies'
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: 'SRJ Global Technologies',
    privacy_policy_title: DEFAULT_TEMPLATES.privacy.title,
    privacy_policy_last_updated: DEFAULT_TEMPLATES.privacy.lastUpdated,
    privacy_policy_disclaimer: DEFAULT_TEMPLATES.privacy.disclaimer,
    privacy_policy_content: DEFAULT_TEMPLATES.privacy.content,

    terms_conditions_title: DEFAULT_TEMPLATES.terms.title,
    terms_conditions_last_updated: DEFAULT_TEMPLATES.terms.lastUpdated,
    terms_conditions_content: DEFAULT_TEMPLATES.terms.content,

    cookie_policy_title: DEFAULT_TEMPLATES.cookies.title,
    cookie_policy_last_updated: DEFAULT_TEMPLATES.cookies.lastUpdated,
    cookie_policy_content: DEFAULT_TEMPLATES.cookies.content,
  });

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    fetchLegalSettings();
  }, []);

  const fetchLegalSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/settings');
      if (res.data && res.data.settings) {
        const s = res.data.settings;
        const loaded = {
          companyName: s.company_name || 'SRJ Global Technologies',
          privacy_policy_title: s.privacy_policy_title || DEFAULT_TEMPLATES.privacy.title,
          privacy_policy_last_updated: s.privacy_policy_last_updated || DEFAULT_TEMPLATES.privacy.lastUpdated,
          privacy_policy_disclaimer: s.privacy_policy_disclaimer || DEFAULT_TEMPLATES.privacy.disclaimer,
          privacy_policy_content: s.privacy_policy_content || DEFAULT_TEMPLATES.privacy.content,

          terms_conditions_title: s.terms_conditions_title || DEFAULT_TEMPLATES.terms.title,
          terms_conditions_last_updated: s.terms_conditions_last_updated || DEFAULT_TEMPLATES.terms.lastUpdated,
          terms_conditions_content: s.terms_conditions_content || DEFAULT_TEMPLATES.terms.content,

          cookie_policy_title: s.cookie_policy_title || DEFAULT_TEMPLATES.cookies.title,
          cookie_policy_last_updated: s.cookie_policy_last_updated || DEFAULT_TEMPLATES.cookies.lastUpdated,
          cookie_policy_content: s.cookie_policy_content || DEFAULT_TEMPLATES.cookies.content,
        };
        setFormData(loaded);
        setInitialData(loaded);
      }
    } catch (err) {
      console.error('Error loading legal policy settings:', err);
      onNotify?.('error', 'Failed to load policy settings from database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetToDefault = () => {
    if (!window.confirm(`Reset ${activePolicy.toUpperCase()} policy content to default template? Unsaved changes will be lost.`)) {
      return;
    }

    if (activePolicy === 'privacy') {
      setFormData((prev) => ({
        ...prev,
        privacy_policy_title: DEFAULT_TEMPLATES.privacy.title,
        privacy_policy_last_updated: DEFAULT_TEMPLATES.privacy.lastUpdated,
        privacy_policy_disclaimer: DEFAULT_TEMPLATES.privacy.disclaimer,
        privacy_policy_content: DEFAULT_TEMPLATES.privacy.content
      }));
    } else if (activePolicy === 'terms') {
      setFormData((prev) => ({
        ...prev,
        terms_conditions_title: DEFAULT_TEMPLATES.terms.title,
        terms_conditions_last_updated: DEFAULT_TEMPLATES.terms.lastUpdated,
        terms_conditions_content: DEFAULT_TEMPLATES.terms.content
      }));
    } else if (activePolicy === 'cookies') {
      setFormData((prev) => ({
        ...prev,
        cookie_policy_title: DEFAULT_TEMPLATES.cookies.title,
        cookie_policy_last_updated: DEFAULT_TEMPLATES.cookies.lastUpdated,
        cookie_policy_content: DEFAULT_TEMPLATES.cookies.content
      }));
    }

    onNotify?.('info', `Reset ${activePolicy} to default template.`);
  };

  const handleInsertSnippet = (snippet) => {
    const contentKey = 
      activePolicy === 'privacy' ? 'privacy_policy_content' :
      activePolicy === 'terms' ? 'terms_conditions_content' : 'cookie_policy_content';

    const currentVal = formData[contentKey] || '';
    handleInputChange(contentKey, currentVal + '\n\n' + snippet);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        settings: {
          privacy_policy_title: formData.privacy_policy_title,
          privacy_policy_last_updated: formData.privacy_policy_last_updated,
          privacy_policy_disclaimer: formData.privacy_policy_disclaimer,
          privacy_policy_content: formData.privacy_policy_content,

          terms_conditions_title: formData.terms_conditions_title,
          terms_conditions_last_updated: formData.terms_conditions_last_updated,
          terms_conditions_content: formData.terms_conditions_content,

          cookie_policy_title: formData.cookie_policy_title,
          cookie_policy_last_updated: formData.cookie_policy_last_updated,
          cookie_policy_content: formData.cookie_policy_content,
        }
      };

      const res = await api.put('/settings/bulk', payload);
      if (res.data && res.data.success) {
        setInitialData({ ...formData });
        await refreshSettings();
        onNotify?.('success', 'Legal policies updated and published successfully!');
      } else {
        throw new Error(res.data?.message || 'Failed to save');
      }
    } catch (err) {
      console.error('Error saving legal settings:', err);
      onNotify?.('error', err.response?.data?.message || 'Error updating policies');
    } finally {
      setIsSaving(false);
    }
  };

  // Preview computation
  const activeTitle = 
    activePolicy === 'privacy' ? formData.privacy_policy_title :
    activePolicy === 'terms' ? formData.terms_conditions_title : formData.cookie_policy_title;

  const activeLastUpdated = 
    activePolicy === 'privacy' ? formData.privacy_policy_last_updated :
    activePolicy === 'terms' ? formData.terms_conditions_last_updated : formData.cookie_policy_last_updated;

  const activeRawContent = 
    activePolicy === 'privacy' ? formData.privacy_policy_content :
    activePolicy === 'terms' ? formData.terms_conditions_content : formData.cookie_policy_content;

  const previewHtml = (activeRawContent || '').replaceAll('{{company_name}}', formData.companyName);

  const livePageUrl = 
    activePolicy === 'privacy' ? '/privacy' :
    activePolicy === 'terms' ? '/terms' : '/cookies';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          <span>Loading Legal & Compliance Policies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <ShieldCheck size={20} />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">Legal & Compliance Policies Manager</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Edit full policy sections, clauses, titles, and revision dates for Privacy Policy, Terms & Conditions, and Cookie Policy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={livePageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
          >
            <ExternalLink size={14} />
            <span>View Live Page</span>
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save All Policies</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActivePolicy('privacy')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activePolicy === 'privacy'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck size={16} />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePolicy('terms')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activePolicy === 'terms'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText size={16} />
            <span>Terms & Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePolicy('cookies')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activePolicy === 'cookies'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cookie size={16} />
            <span>Cookie Policy</span>
          </button>
        </div>

        {/* View Layout Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Editor Only"
          >
            <Code size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Split View"
          >
            <Columns size={16} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Preview Only"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Meta Fields (Title, Last Updated, Disclaimer) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Document Title
          </label>
          <input
            type="text"
            value={activeTitle}
            onChange={(e) => {
              const f = 
                activePolicy === 'privacy' ? 'privacy_policy_title' :
                activePolicy === 'terms' ? 'terms_conditions_title' : 'cookie_policy_title';
              handleInputChange(f, e.target.value);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Last Updated Date / Version
          </label>
          <input
            type="text"
            value={activeLastUpdated}
            onChange={(e) => {
              const f = 
                activePolicy === 'privacy' ? 'privacy_policy_last_updated' :
                activePolicy === 'terms' ? 'terms_conditions_last_updated' : 'cookie_policy_last_updated';
              handleInputChange(f, e.target.value);
            }}
            placeholder="e.g. October 2025"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {activePolicy === 'privacy' ? (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Disclaimer Note
            </label>
            <input
              type="text"
              value={formData.privacy_policy_disclaimer}
              onChange={(e) => handleInputChange('privacy_policy_disclaimer', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
            <Info size={18} className="shrink-0 text-blue-600" />
            <span>Use placeholder <code>{`{{company_name}}`}</code> inside the text to automatically render your live company name.</span>
          </div>
        )}
      </div>

      {/* Editor & Live Preview Canvas */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor Column */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
            {/* Editor Toolbar */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Insert:</span>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('<section class="policy-section">\n  <h2>New Section Title</h2>\n  <p>Section explanation and guidelines...</p>\n</section>')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <Heading size={13} />
                  <span>Section</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('<p>Enter your paragraph content here.</p>')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700"
                >
                  Paragraph
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n  <li>List item 3</li>\n</ul>')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <List size={13} />
                  <span>Bullet List</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('<strong>Important Bold Term</strong>')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <Bold size={13} />
                  <span>Bold</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('<a href="/contact">Contact Page</a>')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1"
                >
                  <LinkIcon size={13} />
                  <span>Link</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all cursor-pointer"
                title="Restore default policy template"
              >
                <RotateCcw size={12} />
                <span>Reset Template</span>
              </button>
            </div>

            {/* Code / Textarea Editor */}
            <div className="p-4 flex-1 flex flex-col">
              <textarea
                rows={viewMode === 'split' ? 24 : 32}
                value={activeRawContent}
                onChange={(e) => {
                  const f = 
                    activePolicy === 'privacy' ? 'privacy_policy_content' :
                    activePolicy === 'terms' ? 'terms_conditions_content' : 'cookie_policy_content';
                  handleInputChange(f, e.target.value);
                }}
                className="w-full flex-1 p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm leading-relaxed border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                placeholder="Enter policy HTML/text content..."
                spellCheck={false}
              />
              <span className="text-[11px] text-slate-400 mt-2">
                Semantic HTML tags <code>&lt;section&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;a&gt;</code> are supported.
              </span>
            </div>
          </div>
        )}

        {/* Live Preview Column */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Public Preview</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {livePageUrl}
              </span>
            </div>

            <div className="p-8 max-h-[720px] overflow-y-auto bg-white space-y-6">
              {/* Header */}
              <div className="text-center pb-6 border-b border-slate-100">
                <h1 className="text-3xl font-extrabold text-slate-950 mb-2 tracking-tight">
                  {activeTitle}
                </h1>
                {activeLastUpdated && (
                  <p className="text-xs font-medium italic text-slate-400 mb-2">
                    Last Updated: {activeLastUpdated}
                  </p>
                )}
                {activePolicy === 'privacy' && formData.privacy_policy_disclaimer && (
                  <p className="text-xs text-slate-500 italic max-w-lg mx-auto">
                    {formData.privacy_policy_disclaimer}
                  </p>
                )}
              </div>

              {/* Rendered HTML */}
              <div
                className="legal-preview prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />

              {/* Dynamic Company Details Box */}
              <div className="mt-8 p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-900 text-sm mb-1">{formData.companyName}</div>
                <div>📍 Official address dynamically pulled from Site Settings</div>
                <div>📧 Official contact email dynamically pulled from Site Settings</div>
                <div>📞 Official phone & WhatsApp numbers dynamically pulled from Site Settings</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .legal-preview h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }
        .legal-preview p {
          margin-bottom: 0.85rem;
          line-height: 1.7;
        }
        .legal-preview ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-bottom: 1rem;
        }
        .legal-preview li {
          margin-bottom: 0.35rem;
        }
        .legal-preview a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
