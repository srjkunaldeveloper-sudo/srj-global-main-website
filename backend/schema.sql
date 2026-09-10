-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS `srj_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `srj_db`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
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
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_services_created_at` (`created_at` DESC)
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
('business_hours', 'Mon - Sat: 9:00 AM - 7:00 PM IST', 'business', 'text', 'Company business operating hours')
ON DUPLICATE KEY UPDATE
  `group_name` = VALUES(`group_name`),
  `field_type` = VALUES(`field_type`),
  `description` = VALUES(`description`);
