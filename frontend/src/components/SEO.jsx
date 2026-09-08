import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image = 'https://srjglobaltechnology.com/og-image.png', 
  url = 'https://srjglobaltechnology.com',
  isArticle = false,
  articleData = null
}) {
  const siteTitle = 'SRJ Global Technologies';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SRJ Global Technologies",
    "url": "https://srjglobaltechnology.com",
    "logo": "https://srjglobaltechnology.com/og-image.png",
    "description": "SRJ Global Technologies builds premium, scalable digital platforms, applications, and artificial intelligence solutions for modern businesses."
  };

  const articleSchema = isArticle && articleData ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title || title,
    "image": [image],
    "datePublished": articleData.datePublished || new Date().toISOString(),
    "author": [{
        "@type": "Organization",
        "name": "SRJ Global Technologies",
        "url": "https://srjglobaltechnology.com"
      }]
  } : null;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

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
