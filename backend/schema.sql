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
  `service` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_contacts_created_at` (`created_at` DESC)
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

