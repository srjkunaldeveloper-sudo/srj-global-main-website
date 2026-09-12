-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `srj_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `srj_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user',
  `reset_password_token` VARCHAR(255) DEFAULT NULL,
  `reset_password_expires` DATETIME DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_reset_token` (`reset_password_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blogs Table
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `image` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) NOT NULL,
  `type` VARCHAR(100) DEFAULT 'Fresh Perspectives',
  `description` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `author` VARCHAR(255) DEFAULT 'SRJ Global Softech',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_blogs_slug` (`slug`),
  INDEX `idx_blogs_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts Table
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `service` VARCHAR(150) NOT NULL,
  `budget` VARCHAR(100) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_contacts_created_at` (`created_at` DESC),
  INDEX `idx_contacts_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services Table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `short_description` TEXT NOT NULL,
  `full_description` LONGTEXT NOT NULL,
  `category_id` VARCHAR(100) DEFAULT NULL,
  `price` DECIMAL(10,2) DEFAULT NULL,
  `tags` JSON DEFAULT NULL,
  `is_home` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_services_created_at` (`created_at` DESC),
  INDEX `idx_services_is_home_sort` (`is_home`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Plan Inquiries Table
CREATE TABLE IF NOT EXISTS `plan_inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `plan_name` VARCHAR(100) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `company_name` VARCHAR(255) DEFAULT NULL,
  `project_type` VARCHAR(150) DEFAULT NULL,
  `budget` VARCHAR(100) DEFAULT NULL,
  `requirements` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_plan_inquiries_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Promotions Table
CREATE TABLE IF NOT EXISTS `promotions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `cta_text` VARCHAR(100) DEFAULT 'Learn More',
  `cta_link` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_promotions_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Testimonials Table
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `quote` TEXT NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `rating` INT DEFAULT 5,
  `image` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_testimonials_is_active` (`is_active`),
  INDEX `idx_testimonials_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Portfolio Table
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(150) NOT NULL,
  `tags` JSON DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `project_url` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_portfolio_is_active` (`is_active`),
  INDEX `idx_portfolio_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FAQs Table
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_faqs_is_active` (`is_active`),
  INDEX `idx_faqs_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Industries Table
CREATE TABLE IF NOT EXISTS `industries` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NOT NULL,
  `icon` VARCHAR(100) NOT NULL,
  `color` VARCHAR(20) NOT NULL,
  `description` TEXT NOT NULL,
  `badge` VARCHAR(100) NOT NULL,
  `features` TEXT NOT NULL,
  `benefits` TEXT NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_industries_is_active` (`is_active`),
  INDEX `idx_industries_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team Members Table
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(150) NOT NULL,
  `role_class` VARCHAR(50) DEFAULT 'dev',
  `bio` TEXT NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `featured` TINYINT(1) DEFAULT 0,
  `online` TINYINT(1) DEFAULT 1,
  `verified` TINYINT(1) DEFAULT 0,
  `badge` VARCHAR(100) DEFAULT NULL,
  `linkedin` VARCHAR(500) DEFAULT NULL,
  `github` VARCHAR(500) DEFAULT NULL,
  `twitter` VARCHAR(500) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `website` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_team_is_active` (`is_active`),
  INDEX `idx_team_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subscribers Table
CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `source` VARCHAR(100) DEFAULT 'website_footer_blog',
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_subscribers_email` (`email`),
  INDEX `idx_subscribers_status` (`status`),
  INDEX `idx_subscribers_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings Table
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT DEFAULT NULL,
  `group_name` VARCHAR(50) NOT NULL DEFAULT 'general',
  `field_type` VARCHAR(50) NOT NULL DEFAULT 'text',
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_settings_key` (`setting_key`),
  INDEX `idx_settings_group` (`group_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Site Settings Seed Data
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `group_name`, `field_type`, `description`) VALUES
-- Identity Group
('company_name', 'SRJ Global Technologies', 'identity', 'text', 'Official brand name of the company'),
('brand_tagline', 'Premium Scalable IT & Software Solutions', 'identity', 'text', 'Global company tagline/slogan'),
('logo_url', '/src/assets/Logo.png', 'identity', 'url', 'Path to company logo asset'),
('favicon_url', '/favicon.png', 'identity', 'url', 'Path to site favicon'),
('canonical_url', 'https://srjglobaltechnology.com', 'identity', 'url', 'Canonical site URL'),

-- Contact Group
('contact_email', 'srjglobaltechnology@gmail.com', 'contact', 'email', 'Primary business contact email'),
('contact_phone', '+91 99904 30305', 'contact', 'phone', 'Primary customer phone number'),
('whatsapp_phone', '+91 92667 06599', 'contact', 'phone', 'WhatsApp support phone number'),
('office_address', 'C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304', 'contact', 'textarea', 'Physical office address'),
('google_maps_url', 'https://maps.google.com/?q=Urbtech+Trade+Center+Tower+Noida+Sector+132', 'contact', 'url', 'Google Maps direction link'),
('maps_iframe_url', 'https://www.google.com/maps?q=Urbtech+Trade+Center+Tower+Noida+Sector+132&output=embed', 'contact', 'url', 'Google Maps embed iframe URL'),

-- Social Group
('social_instagram', 'https://www.instagram.com/', 'social', 'url', 'Instagram page URL'),
('social_pinterest', 'https://www.pinterest.com/', 'social', 'url', 'Pinterest page URL'),
('social_youtube', 'https://www.youtube.com/', 'social', 'url', 'YouTube channel URL'),
('social_facebook', 'https://www.facebook.com/', 'social', 'url', 'Facebook page URL'),
('social_twitter', 'https://twitter.com/', 'social', 'url', 'Twitter / X profile URL'),
('social_linkedin', 'https://www.linkedin.com/', 'social', 'url', 'LinkedIn company page URL'),

-- Footer Group
('footer_description', 'Innovative digital solutions: we build high-quality websites, mobile apps, and custom enterprise platforms for growing brands.', 'footer', 'textarea', 'Short company bio displayed in footer'),
('footer_copyright', '© {year} SRJ Global Technologies. All rights reserved.', 'footer', 'text', 'Footer copyright statement'),
('google_review_url', 'https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID', 'footer', 'url', 'Google Business Review URL'),

-- SEO Group
('global_seo_title', 'SRJ Global Technologies | Premium Scalable IT & Software Solutions', 'seo', 'text', 'Default global site SEO title'),
('global_seo_description', 'SRJ Global Technologies builds premium, scalable digital platforms, applications, and artificial intelligence solutions for modern businesses.', 'seo', 'textarea', 'Default global meta description'),
('global_seo_keywords', 'contact SRJ Global Technologies, hire developers, IT consultation', 'seo', 'text', 'Default global meta keywords'),
('global_og_image', 'https://srjglobaltechnology.com/og-image.png', 'seo', 'url', 'Default Open Graph share image URL'),

-- Business Group
('response_sla', 'within 24 hours', 'business', 'text', 'Standard inquiry response SLA promise'),
('business_hours', 'Mon - Sat: 9:00 AM - 7:00 PM IST', 'business', 'text', 'Company business operating hours'),

-- Hero Group
('hero_badge', 'Trusted by Leaders in Enterprise Technology', 'hero', 'text', 'Hero section top badge text'),
('hero_headings', '["Grow Your Business with Smart Technology", "Scalable Web & App Development Solutions", "Complete Digital Growth Solutions", "Building Future-Ready Digital Experiences"]', 'hero', 'json', 'Hero section rotating headline variants'),
('hero_subtitle', 'SRJ Global Technologies helps startups and businesses build modern websites, mobile apps, AI solutions, and scalable software.', 'hero', 'textarea', 'Hero section subtitle paragraph'),
('hero_cta_primary_text', 'Explore Services', 'hero', 'text', 'Hero primary CTA button text'),
('hero_cta_primary_url', '#services', 'hero', 'text', 'Hero primary CTA target URL/anchor'),
('hero_cta_secondary_text', 'View Our Work', 'hero', 'text', 'Hero secondary CTA button text'),
('hero_cta_secondary_url', '#portfolio', 'hero', 'text', 'Hero secondary CTA target URL/anchor'),

-- Process Group
('process_badge', 'Our Process', 'process', 'text', 'Process section top badge text'),
('process_title', 'From Idea to Market Success', 'process', 'text', 'Process section main heading'),
('process_subtitle', 'A clear, proven path that takes your concept from first sketch to a product your customers love — with strategy, craft, and partnership at every step.', 'process', 'textarea', 'Process section subtitle paragraph'),
('process_cta_primary_text', 'Start Your Project', 'process', 'text', 'Process primary CTA button text'),
('process_cta_primary_url', '#contact', 'process', 'text', 'Process primary CTA target URL/anchor'),
('process_cta_secondary_text', 'Book a Consultation', 'process', 'text', 'Process secondary CTA button text'),
('process_cta_secondary_url', '#contact', 'process', 'text', 'Process secondary CTA target URL/anchor'),
('process_image_url', '/src/assets/still-life-business-roles-with-various-mechanism-pieces.jpg', 'process', 'url', 'Process illustration image asset path'),

-- Trust & Stats Group
('trust_heading', 'We Don\'t Just Deliver Software. We Build Businesses.', 'trust', 'text', 'Trust section main heading'),
('trust_subtitle', 'Every product we ship comes with strategic thinking, business alignment, and a commitment to your long-term success.', 'trust', 'textarea', 'Trust section subtitle paragraph'),
('stats_heading', 'Our Achievements', 'trust', 'text', 'Achievements & stats section main heading'),
('stats_subtitle', 'Delivering high-quality IT solutions with proven success and trusted by clients worldwide.', 'trust', 'textarea', 'Achievements & stats section subtitle paragraph'),

-- Services Page Group
('services_hero_badge', 'Enterprise Technology Partner', 'services', 'text', 'Services page hero section top badge text'),
('services_hero_heading', 'Technology Solutions Built for Growth.', 'services', 'text', 'Services page hero section main title'),
('services_hero_subtitle', 'We build scalable web applications, enterprise software, AI-powered solutions, cloud infrastructure, and mobile applications that help startups and enterprises grow faster.', 'services', 'textarea', 'Services page hero section subtitle paragraph'),
('services_intro_badge', 'The SRJ Ecosystem', 'services', 'text', 'Services directory section top eyebrow/badge text'),
('services_intro_title', 'Everything You Need to Build, Scale, and Transform', 'services', 'text', 'Services directory section main heading'),
('services_intro_description', 'Explore our complete range of technology services designed to help businesses turn ideas into powerful digital products.', 'services', 'textarea', 'Services directory section subtitle paragraph')
ON DUPLICATE KEY UPDATE
  `group_name` = VALUES(`group_name`),
  `field_type` = VALUES(`field_type`),
  `description` = VALUES(`description`);

-- Navigation Items Table
CREATE TABLE IF NOT EXISTS `navigation_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_location` ENUM('header', 'footer_quick', 'footer_legal') NOT NULL DEFAULT 'header',
  `parent_id` INT NULL DEFAULT NULL,
  `label` VARCHAR(100) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `item_type` ENUM('route', 'hash', 'external') NOT NULL DEFAULT 'route',
  `target` ENUM('_self', '_blank') NOT NULL DEFAULT '_self',
  `icon_name` VARCHAR(50) NULL DEFAULT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_navigation_parent` FOREIGN KEY (`parent_id`) REFERENCES `navigation_items` (`id`) ON DELETE CASCADE,
  INDEX `idx_group_location_sort` (`group_location`, `sort_order`),
  INDEX `idx_parent_sort` (`parent_id`, `sort_order`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Navigation Items Seed Data (Idempotent Seed)
INSERT INTO `navigation_items` (`id`, `group_location`, `parent_id`, `label`, `url`, `item_type`, `target`, `icon_name`, `description`, `sort_order`, `is_active`) VALUES
-- Header Top-Level Items
(1, 'header', NULL, 'Home', '/', 'route', '_self', NULL, NULL, 1, 1),
(2, 'header', NULL, 'Services', '/services', 'route', '_self', NULL, NULL, 2, 1),
(3, 'header', NULL, 'Pricing', '/pricing', 'route', '_self', NULL, NULL, 3, 1),
(4, 'header', NULL, 'Collaboration', '/collaboration', 'route', '_self', NULL, NULL, 4, 1),
(5, 'header', NULL, 'Industries', '/industries', 'route', '_self', NULL, NULL, 5, 1),
(6, 'header', NULL, 'About Us', '/about', 'route', '_self', NULL, NULL, 6, 1),
(7, 'header', NULL, 'Contact Us', '/contact', 'route', '_self', NULL, NULL, 7, 1),

-- Services Dropdown Children (Parent ID: 2)
(8, 'header', 2, 'Game Development', '/services#game-development', 'hash', '_self', 'Rocket', 'Immersive 2D/3D games for mobile, PC & console', 1, 1),
(9, 'header', 2, 'Software Development', '/services#software-development', 'hash', '_self', 'Code', 'Enterprise-grade custom software & web applications', 2, 1),
(10, 'header', 2, 'Mobile App Development', '/services#mobile-app-development', 'hash', '_self', 'Smartphone', 'Native & cross-platform iOS/Android mobile apps', 3, 1),
(11, 'header', 2, 'UI/UX & Digital Product Design', '/services#ui-ux-design', 'hash', '_self', 'PenTool', 'User-centric interfaces & engaging digital experiences', 4, 1),
(12, 'header', 2, 'AI & Intelligent Solutions', '/services#ai-intelligent-solutions', 'hash', '_self', 'Cpu', 'Machine learning, LLMs & intelligent automation', 5, 1),
(13, 'header', 2, 'Cloud & DevOps', '/services#cloud-devops', 'hash', '_self', 'Cloud', 'Scalable cloud infrastructure & DevOps automation', 6, 1),
(14, 'header', 2, 'Data & Analytics', '/services#data-analytics', 'hash', '_self', 'Database', 'Data engineering, business intelligence & analytics', 7, 1),
(15, 'header', 2, 'Cybersecurity', '/services#cybersecurity', 'hash', '_self', 'Shield', 'Security audits, penetration testing & compliance', 8, 1),
(16, 'header', 2, 'Startup Launch Support', '/services#startup-launch-support', 'hash', '_self', 'Rocket', 'MVP development & technical advisory for startups', 9, 1),

-- Pricing Dropdown Children (Parent ID: 3)
(17, 'header', 3, 'Base Architecture', '/pricing', 'route', '_self', 'Code', 'Perfect for startups and small business websites.', 1, 1),
(18, 'header', 3, 'Premium Experience', '/pricing', 'route', '_self', 'PenTool', 'Advanced features, integrations, and performance.', 2, 1),
(19, 'header', 3, 'Enterprise Suite', '/pricing', 'route', '_self', 'Database', 'Custom tailored platforms for massive scale.', 3, 1),

-- Footer Quick Links
(20, 'footer_quick', NULL, 'Contact Us', '/contact', 'route', '_self', NULL, NULL, 1, 1),
(21, 'footer_quick', NULL, 'Pricing Plans', '/pricing', 'route', '_self', NULL, NULL, 2, 1),
(22, 'footer_quick', NULL, 'Blog', '/blog', 'route', '_self', NULL, NULL, 3, 1),
(23, 'footer_quick', NULL, 'Careers', '/careers', 'route', '_self', NULL, NULL, 4, 1),
(24, 'footer_quick', NULL, 'Collaboration', '/collaboration', 'route', '_self', NULL, NULL, 5, 1),

-- Footer Legal Links
(25, 'footer_legal', NULL, 'Privacy Policy', '/privacy', 'route', '_self', NULL, NULL, 1, 1),
(26, 'footer_legal', NULL, 'Cookies', '#contact', 'hash', '_self', NULL, NULL, 2, 1),
(27, 'footer_legal', NULL, 'Terms & Conditions', '/terms', 'route', '_self', NULL, NULL, 3, 1)
ON DUPLICATE KEY UPDATE
  `group_location` = VALUES(`group_location`),
  `parent_id` = VALUES(`parent_id`),
  `label` = VALUES(`label`),
  `url` = VALUES(`url`),
  `item_type` = VALUES(`item_type`),
  `target` = VALUES(`target`),
  `icon_name` = VALUES(`icon_name`),
  `description` = VALUES(`description`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`);

-- Partner Logos Table
CREATE TABLE IF NOT EXISTS `partner_logos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `logo_url` VARCHAR(500) NOT NULL,
  `website_url` VARCHAR(500) DEFAULT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `fallback_domain` VARCHAR(100) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_partner_logos_active` (`is_active`),
  INDEX `idx_partner_logos_sort` (`sort_order`),
  INDEX `idx_partner_logos_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Partner Logos Seed Data
INSERT INTO `partner_logos` (`id`, `name`, `logo_url`, `website_url`, `alt_text`, `fallback_domain`, `sort_order`, `is_active`) VALUES
(1, 'Adani Group', 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Adani_logo_2012.svg', 'https://adani.com', 'Adani Group', 'adani.com', 1, 1),
(2, 'Reliance Industries', 'https://upload.wikimedia.org/wikipedia/en/0/0e/Reliance_Industries.svg', 'https://ril.com', 'Reliance Industries', 'ril.com', 2, 1),
(3, 'Maruti Suzuki', 'https://upload.wikimedia.org/wikipedia/commons/8/86/Maruti_Suzuki_logo.svg', 'https://marutisuzuki.com', 'Maruti Suzuki', 'marutisuzuki.com', 3, 1),
(4, 'Samsung', 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Samsung_logo.svg', 'https://samsung.com', 'Samsung', 'samsung.com', 4, 1),
(5, 'LG', 'https://logo.clearbit.com/lg.com', 'https://lg.com', 'LG', 'lg.com', 5, 1),
(6, 'Nissan', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_2020_logo.svg', 'https://nissan-global.com', 'Nissan', 'nissan-global.com', 6, 1),
(7, 'Mahindra Group', 'https://upload.wikimedia.org/wikipedia/commons/8/89/Mahindra_logo.svg', 'https://mahindra.com', 'Mahindra Group', 'mahindra.com', 7, 1),
(8, 'Government e-Marketplace', 'https://upload.wikimedia.org/wikipedia/en/9/91/Government_e_Marketplace_Logo.png', 'https://gem.gov.in', 'Government e-Marketplace', 'gem.gov.in', 8, 1),
(9, 'Bajaj Group', 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Bajaj_Auto_logo.svg', 'https://bajajauto.com', 'Bajaj Group', 'bajajauto.com', 9, 1),
(10, 'Reliance Jio', 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Reliance_Jio_Logo.svg', 'https://jio.com', 'Reliance Jio', 'jio.com', 10, 1),
(11, 'Infosys', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'https://infosys.com', 'Infosys', 'infosys.com', 11, 1),
(12, 'Aristocrat', 'https://upload.wikimedia.org/wikipedia/en/4/4a/Aristocrat_Leisure_logo.svg', 'https://aristocrat.com', 'Aristocrat', 'aristocrat.com', 12, 1),
(13, 'Sun Pharma', 'https://upload.wikimedia.org/wikipedia/en/5/50/Sun_Pharma_logo.svg', 'https://sunpharma.com', 'Sun Pharma', 'sunpharma.com', 13, 1),
(14, 'Micromax', 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Micromax_logo.svg', 'https://micromaxinfo.com', 'Micromax', 'micromaxinfo.com', 14, 1),
(15, 'Philips', 'https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg', 'https://philips.com', 'Philips', 'philips.com', 15, 1),
(16, 'TVS Motor', 'https://upload.wikimedia.org/wikipedia/en/e/e9/TVS_Motor_logo.svg', 'https://tvsmotor.com', 'TVS Motor', 'tvsmotor.com', 16, 1),
(17, 'Hawkins Cookers', 'https://upload.wikimedia.org/wikipedia/en/f/ff/Hawkins_Cookers.svg', 'https://hawkinscookers.com', 'Hawkins Cookers', 'hawkinscookers.com', 17, 1),
(18, 'United', 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Heineken_Logo.svg', 'https://unitedbreweries.com', 'United', 'unitedbreweries.com', 18, 1),
(19, 'Honda', 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Honda_Logo.svg', 'https://honda.com', 'Honda', 'honda.com', 19, 1),
(20, 'ITC Limited', 'https://upload.wikimedia.org/wikipedia/commons/f/ff/ITC_Limited_Logo.svg', 'https://itcportal.com', 'ITC Limited', 'itcportal.com', 20, 1),
(21, 'Whirlpool', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Whirlpool_Corporation_Logo_(as_of_2017).svg', 'https://whirlpool.com', 'Whirlpool', 'whirlpool.com', 21, 1),
(22, 'Kirloskar Group', 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Kirloskar_Group_Logo.svg', 'https://kirloskar.com', 'Kirloskar Group', 'kirloskar.com', 22, 1)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `logo_url` = VALUES(`logo_url`),
  `website_url` = VALUES(`website_url`),
  `alt_text` = VALUES(`alt_text`),
  `fallback_domain` = VALUES(`fallback_domain`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`);

-- Process Steps Table
CREATE TABLE IF NOT EXISTS `process_steps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `icon_name` VARCHAR(100) NOT NULL DEFAULT 'Lightbulb',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_process_steps_active` (`is_active`),
  INDEX `idx_process_steps_sort` (`sort_order`),
  INDEX `idx_process_steps_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Process Steps Seed Data
INSERT INTO `process_steps` (`id`, `title`, `description`, `icon_name`, `sort_order`, `is_active`) VALUES
(1, 'Idea', 'We start by understanding your vision, goals, and the problem you want to solve.', 'Lightbulb', 1, 1),
(2, 'Consultation', 'Strategic sessions to align on scope, market fit, and the right technology approach.', 'Search', 2, 1),
(3, 'Planning', 'Detailed roadmaps, architecture, and milestones that keep the build predictable.', 'Compass', 3, 1),
(4, 'Design', 'User-centric interfaces and experiences crafted for clarity and conversion.', 'Palette', 4, 1),
(5, 'Development', 'Clean, scalable code delivered in agile iterations with constant visibility.', 'Code2', 5, 1),
(6, 'Testing', 'Rigorous QA across devices and edge cases to guarantee a flawless experience.', 'FlaskConical', 6, 1),
(7, 'Launch', 'A confident go-live with monitoring, optimization, and zero surprises.', 'Send', 7, 1),
(8, 'Growth', 'Data-driven improvements that turn a launch into measurable momentum.', 'TrendingUp', 8, 1),
(9, 'Scaling', 'Future-proof infrastructure that grows smoothly with your business.', 'Maximize2', 9, 1)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `icon_name` = VALUES(`icon_name`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`);

-- Company Stats Table
CREATE TABLE IF NOT EXISTS `company_stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `metric_key` VARCHAR(100) NOT NULL UNIQUE,
  `target_value` INT NOT NULL DEFAULT 0,
  `prefix` VARCHAR(20) DEFAULT NULL,
  `suffix` VARCHAR(20) DEFAULT '+',
  `label` VARCHAR(255) NOT NULL,
  `icon_name` VARCHAR(100) DEFAULT 'Award',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_company_stats_active` (`is_active`),
  INDEX `idx_company_stats_sort` (`sort_order`),
  INDEX `idx_company_stats_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Company Stats Seed Data
INSERT INTO `company_stats` (`id`, `metric_key`, `target_value`, `prefix`, `suffix`, `label`, `icon_name`, `sort_order`, `is_active`) VALUES
(1, 'projects_completed', 18000, NULL, '+', 'Projects Completed', 'CheckCircle', 1, 1),
(2, 'happy_clients', 6000, NULL, '+', 'Happy Clients', 'Users', 2, 1),
(3, 'years_experience', 19, NULL, '+', 'Years Experience', 'Award', 3, 1),
(4, 'expert_support', 24, NULL, '/7', 'Expert Support', 'Shield', 4, 1)
ON DUPLICATE KEY UPDATE
  `metric_key` = VALUES(`metric_key`),
  `target_value` = VALUES(`target_value`),
  `prefix` = VALUES(`prefix`),
  `suffix` = VALUES(`suffix`),
  `label` = VALUES(`label`),
  `icon_name` = VALUES(`icon_name`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`);

-- Trust Points Table
CREATE TABLE IF NOT EXISTS `trust_points` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `icon_name` VARCHAR(100) NOT NULL DEFAULT 'CheckCircle2',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_trust_points_active` (`is_active`),
  INDEX `idx_trust_points_sort` (`sort_order`),
  INDEX `idx_trust_points_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Trust Points Seed Data
INSERT INTO `trust_points` (`id`, `title`, `description`, `icon_name`, `sort_order`, `is_active`) VALUES
(1, 'End-to-End Product Development', 'From idea validation to post-launch growth — we own the entire lifecycle.', 'CheckCircle2', 1, 1),
(2, 'Business & Technology Consultation', 'Strategic guidance that aligns technology investments with business outcomes.', 'CheckCircle2', 2, 1),
(3, 'Scalable & Future-Proof Solutions', 'Architecture built to grow with your business and adapt to market shifts.', 'CheckCircle2', 3, 1),
(4, 'Long-Term Partnership', 'We don\'t disappear after delivery. We invest in your success for years.', 'CheckCircle2', 4, 1)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `description` = VALUES(`description`),
  `icon_name` = VALUES(`icon_name`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`);




