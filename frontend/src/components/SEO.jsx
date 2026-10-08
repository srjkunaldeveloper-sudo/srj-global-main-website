import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  pageKey = null,
  isArticle = false,
  articleData = null,
  faqs = null,
  extraSchema = null
}) {
  const { getSetting } = useSiteSettings();

  // Dynamic Site Settings (Global Defaults)
  const globalTitle = getSetting('global_seo_title', 'SRJ Global Technologies | Premium Scalable IT & Software Solutions');
  const globalDescription = getSetting('global_seo_description', 'SRJ Global Technologies builds premium, scalable digital platforms, applications, and artificial intelligence solutions for modern businesses.');
  const globalKeywords = getSetting('global_seo_keywords', 'contact SRJ Global Technologies, hire developers, IT consultation');
  const globalOgImage = getSetting('global_og_image', 'https://srjglobaltechnology.com/og-image.png');
  const globalCanonicalUrl = getSetting('canonical_url', 'https://srjglobaltechnology.com');
  const companyName = getSetting('company_name', 'SRJ Global Technologies');
  const faviconUrl = getSetting('favicon_url', '/favicon.png');

  // AEO & GEO Settings from Admin Panel
  const geoKnowsAboutRaw = getSetting('geo_knows_about', 'Custom Software Development, Web Applications, Mobile App Engineering, Unity Game Development, Real Money Games, AI Solutions, Cloud Infrastructure, DevOps');
  const geoAiSummary = getSetting('geo_ai_summary', 'SRJ Global Technologies is a premier global software engineering firm headquartered in India, specializing in enterprise digital transformation, scalable cloud architectures, custom web & mobile apps, and real-money gaming platforms.');
  
  const knowsAboutTopics = geoKnowsAboutRaw 
    ? geoKnowsAboutRaw.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  // Page-specific settings override from Admin DB (if pageKey provided)
  const dbPageTitle = pageKey ? getSetting(`seo_${pageKey}_title`) : '';
  const dbPageDesc = pageKey ? getSetting(`seo_${pageKey}_description`) : '';
  const dbPageKeywords = pageKey ? getSetting(`seo_${pageKey}_keywords`) : '';
  const dbPageOgImage = pageKey ? getSetting(`seo_${pageKey}_og_image`) : '';

  // Helper function to resolve image URLs safely
  const resolveUrl = (targetUrl, baseUrl) => {
    if (!targetUrl) return '';
    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      return targetUrl;
    }
    const cleanBase = (baseUrl || 'https://srjglobaltechnology.com').replace(/\/+$/, '');
    const cleanPath = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
    return `${cleanBase}${cleanPath}`;
  };

  // Helper function to resolve canonical route URLs safely
  const resolveCanonicalUrl = (passedUrl, baseUrl) => {
    const cleanBase = (baseUrl || 'https://srjglobaltechnology.com').replace(/\/+$/, '');
    if (!passedUrl) return cleanBase;
    if (passedUrl.startsWith('http://') || passedUrl.startsWith('https://')) {
      return passedUrl;
    }
    const cleanPath = passedUrl.startsWith('/') ? passedUrl : `/${passedUrl}`;
    return `${cleanBase}${cleanPath}`;
  };

  // Precedence Rules: Admin page DB setting > JSX prop > Global Site Setting
  const siteName = companyName;
  const chosenTitle = dbPageTitle || title;
  const fullTitle = chosenTitle 
    ? (chosenTitle.includes(siteName) ? chosenTitle : `${chosenTitle} | ${siteName}`) 
    : globalTitle;

  const finalDescription = dbPageDesc || description || globalDescription;
  const finalKeywords = dbPageKeywords || keywords || globalKeywords;
  const rawImage = dbPageOgImage || image || globalOgImage;
  const finalImage = resolveUrl(rawImage, globalCanonicalUrl);
  const finalUrl = resolveCanonicalUrl(url, globalCanonicalUrl);

  // Favicon Runtime Update
  useEffect(() => {
    if (!faviconUrl) return;
    try {
      const resolvedFavicon = faviconUrl.startsWith('http') 
        ? faviconUrl 
        : (faviconUrl.startsWith('/') ? faviconUrl : `/${faviconUrl}`);
      
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      if (link.getAttribute('href') !== resolvedFavicon) {
        link.href = resolvedFavicon;
      }
    } catch (err) {
      console.warn('Favicon update warning:', err);
    }
  }, [faviconUrl]);

  // Brand Logo & OG Share Image resolution
  const logoSetting = getSetting('logo_url', '/src/assets/Logo.png');
  const finalLogo = resolveUrl(logoSetting, globalCanonicalUrl);

  // Contact & Social Site Settings
  const contactEmail = getSetting('contact_email', '');
  const contactPhone = getSetting('contact_phone', '');
  const officeAddress = getSetting('office_address', '');

  // Filter valid social profiles for sameAs array (GEO Knowledge Graph)
  const sameAsLinks = [
    getSetting('social_linkedin', ''),
    getSetting('social_twitter', ''),
    getSetting('social_facebook', ''),
    getSetting('social_instagram', ''),
    getSetting('social_youtube', ''),
    getSetting('social_pinterest', '')
  ].filter(link => link && typeof link === 'string' && link.trim().startsWith('http'));

  // Entity IDs for single coherent @graph architecture
  const orgId = `${globalCanonicalUrl}/#organization`;
  const websiteId = `${globalCanonicalUrl}/#website`;
  const serviceProviderId = `${globalCanonicalUrl}/#professional-service`;

  // 1. Organization Entity (Enhanced with GEO / AEO properties)
  const orgEntity = {
    "@type": "Organization",
    "@id": orgId,
    "name": companyName,
    "url": globalCanonicalUrl,
    "logo": finalLogo,
    "description": finalDescription,
    ...(geoAiSummary ? { "disambiguatingDescription": geoAiSummary } : {}),
    ...(knowsAboutTopics.length > 0 ? { "knowsAbout": knowsAboutTopics } : {}),
    ...(contactEmail ? { "email": contactEmail } : {}),
    ...(contactPhone ? { "telephone": contactPhone } : {}),
    ...(officeAddress ? { "address": officeAddress } : {}),
    ...(sameAsLinks.length > 0 ? { "sameAs": sameAsLinks } : {})
  };

  // 2. WebSite Entity
  const websiteEntity = {
    "@type": "WebSite",
    "@id": websiteId,
    "url": globalCanonicalUrl,
    "name": companyName,
    "description": globalDescription,
    "publisher": {
      "@id": orgId
    }
  };

  // 3. ProfessionalService Entity (IT & Software Solutions Agency with GEO details)
  const serviceEntity = {
    "@type": "ProfessionalService",
    "@id": serviceProviderId,
    "name": companyName,
    "url": globalCanonicalUrl,
    "logo": finalLogo,
    "description": finalDescription,
    "areaServed": "Worldwide",
    "parentOrganization": {
      "@id": orgId
    },
    ...(knowsAboutTopics.length > 0 ? { "knowsAbout": knowsAboutTopics } : {}),
    ...(contactEmail ? { "email": contactEmail } : {}),
    ...(contactPhone ? { "telephone": contactPhone } : {}),
    ...(officeAddress ? { "address": officeAddress } : {}),
    ...(sameAsLinks.length > 0 ? { "sameAs": sameAsLinks } : {})
  };

  // 4. AEO FAQPage Entity (Provides direct structured Q&A for Answer Engines like Perplexity & ChatGPT)
  const faqEntity = (faqs && Array.isArray(faqs) && faqs.length > 0) ? {
    "@type": "FAQPage",
    "@id": `${finalUrl}#faq`,
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question || faq.q || faq.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || faq.a || faq.desc || faq.description
      }
    }))
  } : null;

  // 5. Article entity if article props provided
  const articleEntity = isArticle && articleData ? {
    "@type": "Article",
    "headline": articleData.title || chosenTitle || companyName,
    "image": [finalImage],
    "datePublished": articleData.datePublished || new Date().toISOString(),
    "author": [{
      "@type": "Organization",
      "@id": orgId
    }]
  } : null;

  // Single coherent JSON-LD @graph architecture
  const extraSchemaArray = extraSchema
    ? (Array.isArray(extraSchema) ? extraSchema : [extraSchema])
    : [];

  const graphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      orgEntity,
      websiteEntity,
      serviceEntity,
      ...(faqEntity ? [faqEntity] : []),
      ...(articleEntity ? [articleEntity] : []),
      ...extraSchemaArray
    ]
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}

      {/* AEO / AI Engine Direct Summary Meta */}
      {geoAiSummary && <meta name="ai-summary" content={geoAiSummary} />}

      {/* Canonical Link */}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={isArticle ? "article" : "website"} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />

      {/* Structured Data (JSON-LD Schema Graph with AEO & GEO entities) */}
      <script type="application/ld+json">
        {JSON.stringify(graphSchema)}
      </script>
    </Helmet>
  );
}
