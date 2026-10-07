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
      ['collab_cta_btn_secondary', 'Explore Services', 'collaboration']
    ];

    for (const [key, val, grp] of defaultSettings) {
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value, group_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE group_name = VALUES(group_name)',
        [key, val, grp]
      );
    }

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

    console.log('[Migration] Database tables, site settings, and navigation sync completed successfully.');
  } catch (err) {
    console.error('[Migration Error] Non-fatal migration check failed:', err.message);
  }
}

module.exports = { runAutoMigrations };
