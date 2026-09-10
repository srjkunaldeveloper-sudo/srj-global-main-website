import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url,
  isArticle = false,
  articleData = null
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

  // Precedence Rules: Page-specific props > Site Settings > Fallback
  const siteName = companyName;
  const fullTitle = title 
    ? (title.includes(siteName) ? title : `${title} | ${siteName}`) 
    : globalTitle;

  const finalDescription = description || globalDescription;
  const finalKeywords = keywords || globalKeywords;
  const rawImage = image || globalOgImage;
  const finalImage = resolveUrl(rawImage, globalCanonicalUrl);
  const finalUrl = resolveCanonicalUrl(url, globalCanonicalUrl);

  // Favicon Runtime Update (preserves existing link element, prevents duplication)
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

  // Structured Data Schemas
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": companyName,
    "url": globalCanonicalUrl,
    "logo": finalImage,
    "description": globalDescription
  };

  const articleSchema = isArticle && articleData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title || title || companyName,
    "image": [finalImage],
    "datePublished": articleData.datePublished || new Date().toISOString(),
    "author": [{
        "@type": "Organization",
        "name": companyName,
        "url": globalCanonicalUrl
      }]
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}

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

      {/* Structured Data (JSON-LD Schema) */}
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
      {isArticle && articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
}
