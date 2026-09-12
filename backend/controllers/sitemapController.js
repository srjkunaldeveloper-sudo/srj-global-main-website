const db = require("../config/db");

const generateSitemap = async (req, res) => {
  try {
    let baseUrl = "https://srjglobaltechnology.com";

    try {
      const [settings] = await db.query(
        "SELECT setting_value FROM site_settings WHERE setting_key = 'canonical_url' LIMIT 1"
      );
      if (settings && settings.length > 0 && settings[0].setting_value) {
        baseUrl = settings[0].setting_value.replace(/\/+$/, "");
      }
    } catch (settingErr) {
      console.warn("Could not query canonical_url setting for sitemap, using fallback:", settingErr.message);
    }

    // 1. Define Static Routes (All Public Pages)
    const staticRoutes = [
      { url: "/", changefreq: "weekly", priority: 1.0 },
      { url: "/about", changefreq: "monthly", priority: 0.8 },
      { url: "/services", changefreq: "weekly", priority: 0.9 },
      { url: "/pricing", changefreq: "monthly", priority: 0.8 },
      { url: "/collaboration", changefreq: "monthly", priority: 0.8 },
      { url: "/industries", changefreq: "monthly", priority: 0.8 },
      { url: "/contact", changefreq: "yearly", priority: 0.7 },
      { url: "/blog", changefreq: "weekly", priority: 0.9 },
      { url: "/careers", changefreq: "monthly", priority: 0.7 },
      { url: "/privacy", changefreq: "monthly", priority: 0.5 },
      { url: "/terms", changefreq: "monthly", priority: 0.5 },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add Static Routes to XML
    staticRoutes.forEach((route) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // 2. Fetch Dynamic Services
    const [services] = await db.query("SELECT id, created_at FROM services ORDER BY id DESC");
    services.forEach((service) => {
      const date = service.created_at ? new Date(service.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/services/${service.id}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // 3. Fetch Dynamic Blogs
    const [blogs] = await db.query("SELECT id, created_at FROM blogs ORDER BY id DESC");
    blogs.forEach((blog) => {
      const date = blog.created_at ? new Date(blog.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${blog.id}</loc>\n`;
      xml += `    <lastmod>${date}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);

  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ error: "Failed to generate sitemap" });
  }
};

module.exports = { generateSitemap };
