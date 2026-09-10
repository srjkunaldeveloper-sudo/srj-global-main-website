# Site Settings CMS — Step 1: Discovery, Hardcoded Global Data Audit & Data Ownership Mapping

## 1. Executive Summary & Audit Scope

This document presents the complete technical discovery, hardcoded global data audit, and data ownership mapping for the upcoming **Site Settings CMS** module of the SRJ Global Website.

### Audit Objectives
1. Identify all hardcoded company identity, contact information, social media links, branding assets, footer details, business hours, and global SEO metadata across `frontend/src` and `backend/`.
2. Map duplicated global values and establish strict data ownership boundaries between **Site Settings**, **Navigation CMS**, **SEO CMS**, **Environment Variables**, and **Feature CMS Modules**.
3. Evaluate existing database schema ([`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql)) and Admin Panel ([`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx)).
4. Propose a scalable future Site Settings database model and step-by-step implementation plan without altering application source code or executing database migrations during this read-only discovery phase.

---

## 2. Files & Directories Inspected

### Frontend Codebase (`frontend/src/`)
- **Global Structure & Shell**: [`frontend/index.html`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/index.html), [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx), [`frontend/src/main.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/main.jsx)
- **Header & Navigation**: [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx)
- **Footer**: [`frontend/src/components/Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx)
- **Contact Page**: [`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx)
- **Global SEO**: [`frontend/src/components/SEO.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/SEO.jsx)
- **Legal & Static Pages**: [`frontend/src/components/PrivacyPolicy.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/PrivacyPolicy.jsx), [`frontend/src/components/TermsConditions.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/TermsConditions.jsx)
- **Config & Data**: [`frontend/src/config/api.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/config/api.js), [`frontend/src/config/industries.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/config/industries.jsx), [`frontend/src/config/pricing.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/config/pricing.jsx), [`frontend/src/data/popupData.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/data/popupData.js)
- **Admin Panel**: [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx)

### Backend Codebase (`backend/`)
- **Schema & Database**: [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql), [`backend/config/db.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/config/db.js)
- **Environment & Server**: [`backend/server.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/server.js), `backend/.env`
- **Routes & Controllers**: [`backend/routes/`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/routes/), [`backend/controllers/`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/controllers/)

---

## 3. Detailed Hardcoded Global Data Findings

### Category A: Company Identity
| Data Item | Current Hardcoded Value | Discovered Locations | Candidate for Site Settings? |
|---|---|---|---|
| Company Brand Name | `"SRJ Global Technologies"` / `"SRJ Global"` | `Navbar.jsx`, `Footer.jsx`, `SEO.jsx`, `index.html`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | **YES** |
| Company Legal Name | `"SRJ Global Technologies"` / `"SRJ Global Softech"` | `Footer.jsx`, `SEO.jsx`, `testimonialController.js`, `blogController.js` | **YES** |
| Tagline / Slogan | `"Premium Scalable IT & Software Solutions"` / `"Innovative digital solutions: we build high-quality websites, mobile apps, and custom enterprise platforms..."` | `index.html`, `Footer.jsx`, `SEO.jsx` | **YES** |
| Website Canonical Domain | `"https://srjglobaltechnology.com"` | `SEO.jsx`, `Contact.jsx`, `index.html` | **YES** |

### Category B: Contact Information
| Data Item | Current Hardcoded Value | Discovered Locations | Candidate for Site Settings? |
|---|---|---|---|
| Primary Contact Email | `srjglobaltechnology@gmail.com` | `Footer.jsx` (L127-128), `Contact.jsx` (L277-283), `PrivacyPolicy.jsx` (L332), `TermsConditions.jsx` (L344) | **YES** |
| Primary Phone Number | `+91 99904 30305` | `Footer.jsx` (L134-135), `Contact.jsx` (L287) | **YES** |
| Secondary / WhatsApp Number | `+91 92667 06599` / `https://wa.me/919266706599` | `Footer.jsx` (L137-138) | **YES** |
| Physical Office Address | `C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304` | `Footer.jsx` (L150-152), `Contact.jsx` (L309), `PrivacyPolicy.jsx` (L329), `TermsConditions.jsx` (L341) | **YES** |
| Google Maps Link | `https://www.google.com/maps/search/?api=1&query=Urbtech+Trade+Center+Tower+C-1101+Noida+Sector+132` | `Footer.jsx` (L145), `Contact.jsx` (L298) | **YES** |
| Google Maps Embed Iframe URL | `https://www.google.com/maps?q=Urbtech+Trade+Center+Tower+Noida+Sector+132&output=embed` | `Contact.jsx` (L322) | **YES** |

### Category C: Social Media Links
| Platform | Current Hardcoded URL | Discovered Locations | Notes / Status | Candidate for Site Settings? |
|---|---|---|---|---|
| Instagram | `https://www.instagram.com/` | `Footer.jsx` (L11) | Generic placeholder URL | **YES** |
| Pinterest | `https://www.pinterest.com/` | `Footer.jsx` (L20) | Generic placeholder URL | **YES** |
| YouTube | `https://www.youtube.com/` | `Footer.jsx` (L29) | Generic placeholder URL | **YES** |
| Facebook | `https://www.facebook.com/` | `Footer.jsx` (L38) | Generic placeholder URL | **YES** |
| Twitter / X | `https://twitter.com/` | `Footer.jsx` (L47) | Generic placeholder URL | **YES** |
| LinkedIn | `https://www.linkedin.com/` | `Footer.jsx` (L56), `AdminDashboard.jsx` (L3059) | Generic placeholder URL | **YES** |
| GitHub | `https://github.com/` | Team social links (`teamController.js`) | Per-team member links belong to Team CMS | **NO** (Team CMS) |

### Category D: Branding & Visual Assets
| Asset Item | Current Hardcoded Value | Discovered Locations | Candidate for Site Settings? |
|---|---|---|---|
| Main Brand Logo Image | `../assets/Logo.png` | `Navbar.jsx` (L120), `Footer.jsx` (L73) | **YES** |
| Open Graph Default Share Image | `https://srjglobaltechnology.com/og-image.png` | `SEO.jsx` (L7, L20) | **YES** |
| Favicon Asset | `/favicon.png` | `index.html` (L5) | **YES** |
| Google Review Place URL | `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID` | `Footer.jsx` (L164) | **YES** |

### Category E: Footer Configuration
| Element | Current Hardcoded Value | Discovered Locations | Candidate for Site Settings? |
|---|---|---|---|
| Copyright Text | `© {currentYear} SRJ Global Technologies. All rights reserved.` | `Footer.jsx` (L189) | **YES** |
| Company Summary Description | `"Innovative digital solutions: we build high-quality websites..."` | `Footer.jsx` (L90) | **YES** |
| Google Review Prompt Text | `"Your feedback helps us deliver cutting-edge software products."` | `Footer.jsx` (L160) | **YES** |

### Category F: Global SEO & Metadata Defaults
| Metadata Item | Current Hardcoded Value | Discovered Locations | Candidate for Site Settings? |
|---|---|---|---|
| Default Site Title | `"SRJ Global Technologies \| Premium Scalable IT & Software Solutions"` | `index.html` (L12), `SEO.jsx` (L12) | **YES** |
| Default Meta Description | `"SRJ Global Technologies builds premium, scalable digital platforms, applications, and artificial intelligence solutions for modern businesses."` | `index.html` (L7), `SEO.jsx` (L21) | **YES** |
| Default Keywords | `"contact SRJ Global Technologies, hire developers, IT consultation"` | `Contact.jsx` (L67) | **YES** (Global default) |
| Organization Schema JSON-LD | Structured Organization Metadata (`name`, `url`, `logo`, `description`) | `SEO.jsx` (L15-22) | **YES** |

### Category G: Business Configuration
| Item | Current Hardcoded Value | Discovered Locations | Candidate for Site Settings? |
|---|---|---|---|
| Consultation SLA / Response Promise | `"get back to you within 24 hours"` | `Contact.jsx` (L82) | **YES** |
| Business Operating Hours | Currently unlisted / implied 24x7 online submission | None | **YES** (Future field) |

---

## 4. Component Audits

### 4.1 Header / Navbar Audit ([`Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx))
- **Logo Source**: `import logoImg from '../assets/Logo.png'` (L120).
- **Brand Text**: `"SRJ Global"` (L124).
- **Navigation Links**:
  - `Home` (`/`)
  - `Services` (`/services`) with Mega Menu
  - `Pricing` (`/pricing`) with Mega Menu
  - `Collaboration` (`/collaboration`)
  - `Industries` (`/industries`)
  - `About Us` (`/about`)
  - `Contact Us` (`/contact`)
- **Navigation Assessment**: Navigation hierarchy belongs to **Navigation CMS / Code Router**, NOT Site Settings. Company Name and Logo Image belong to **Site Settings**.

### 4.2 Footer Audit ([`Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx))
- **Logo Source**: `import logoImg from '../assets/Logo.png'` (L73).
- **Brand Name**: `"SRJ GLOBAL TECHNOLOGIES"` (L80-84).
- **Company Description**: `"Innovative digital solutions: we build high-quality websites, mobile apps..."` (L90).
- **Social Links**: Array of 6 platforms (Instagram, Pinterest, YouTube, Facebook, Twitter, LinkedIn) with hardcoded URLs (L8-63).
- **Contact Info**:
  - Email: `srjglobaltechnology@gmail.com`
  - Phone: `+91 99904 30305`
  - WhatsApp: `+91 92667 06599`
  - Address: `Urbtech Trade Center Tower, C-1101 Noida Sector-132, Uttar Pradesh 201304`
- **Google Review Button**: `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID` (L164).
- **Copyright Line**: `© {currentYear} SRJ Global Technologies. All rights reserved.` (L189).

### 4.3 Contact Page Audit ([`Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx))
- **Inquiry Form**: Already 100% integrated with backend API (`POST /api/contact`) in Step 5.
- **Hardcoded Company Contact Information (Right Panel)**:
  - Email: `srjglobaltechnology@gmail.com` (L277, L283)
  - Phone: `+91 99904 30305` (L287)
  - Address: `C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304` (L309)
  - Google Maps Link: `https://maps.google.com/?q=Urbtech+Trade+Center+Tower+Noida+Sector+132` (L298)
  - Google Maps Iframe: `https://www.google.com/maps?q=Urbtech+Trade+Center+Tower+Noida+Sector+132&output=embed` (L322)
- **Site Settings Dependency**: The inquiry submission flow is CMS-driven, but the company contact details in the right sidebar depend directly on global company contact data.

---

## 5. Config, Environment & Security Audit

### Environment Configuration (`backend/.env` & `backend/config/`)
- **Discovered Variables**: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `NODE_ENV`.
- **Secrets Boundary**:
  - Database Credentials (`DB_PASSWORD`, `DB_USER`)
  - JWT Signing Secret (`JWT_SECRET`)
  - Server Port (`PORT`) & Environment (`NODE_ENV`)
  - Any future API Keys (Twilio, SendGrid, Groq, AWS credentials)
- **CRITICAL RULE**: Server infrastructure and secrets **MUST REMAIN in `.env` / environment configuration**. They **MUST NOT** be stored in Site Settings or exposed via public API endpoints.

---

## 6. Database & Admin Panel State Audit

### Database State (`srj_db`)
- **Current Tables (10)**: `users`, `blogs`, `contacts`, `services`, `plan_inquiries`, `promotions`, `testimonials`, `portfolio`, `faqs`, `industries`, `team_members`, `subscribers`.
- **Findings**: No `site_settings` or `global_settings` table currently exists in `schema.sql`.

### Admin Dashboard State ([`AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx))
- **Current Tabs (13)**: `blogs`, `services`, `contacts`, `plans`, `users`, `promotions`, `testimonials`, `portfolio`, `faqs`, `industries`, `team`, `subscribers`, `careers`.
- **Findings**: No Site Settings tab or global settings management interface currently exists in `AdminDashboard.jsx`.

---

## 7. Global Data Duplication Map

| Data Item | Current Duplicated Occurrences | Recommended Single Source of Truth |
|---|---|---|
| Company Name | `Navbar.jsx`, `Footer.jsx`, `SEO.jsx`, `Contact.jsx`, `index.html`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | **Site Settings CMS** |
| Primary Email | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | **Site Settings CMS** |
| Primary Phone | `Footer.jsx`, `Contact.jsx` | **Site Settings CMS** |
| Physical Address | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | **Site Settings CMS** |
| Google Maps Link / Iframe | `Footer.jsx`, `Contact.jsx` | **Site Settings CMS** |
| Social Media URLs | `Footer.jsx` (6 platforms) | **Site Settings CMS** |
| Logo Asset URL | `Navbar.jsx`, `Footer.jsx`, `SEO.jsx` | **Site Settings CMS** |
| Copyright Text | `Footer.jsx` | **Site Settings CMS** |
| Global SEO Title & Description | `index.html`, `SEO.jsx` | **Site Settings CMS** |

---

## 8. Data Ownership & System Boundaries

```text
               +-------------------------------------------------------+
               |                  SRJ GLOBAL WEBSITE                   |
               +-------------------------------------------------------+
                                           |
    +-------------------+------------------+-------------------+-------------------+
    |                   |                  |                   |                   |
+-------+           +-------+          +-------+           +-------+           +-------+
|  SITE |           | NAV   |          | SEO   |           | ENV   |           |FEATURE|
|SETTING|           | CMS   |          | CMS   |           | SECR. |           | CMS   |
+-------+           +-------+          +-------+           +-------+           +-------+
    |                   |                  |                   |                   |
    |-- Company Name    |-- Main Menu      |-- Page Titles     |-- DB Password     |-- Blogs
    |-- Brand Logo      |-- Submenus       |-- Meta Descr.     |-- JWT Secret      |-- Services
    |-- Email & Phone   |-- Footer Links   |-- OG Tags         |-- Server Port     |-- Portfolio
    |-- Address & Map   |-- Mega Menus     |-- Structured      |-- API Keys        |-- Team
    |-- Social Links    |                  |   Article Schema  |-- Twilio Keys     |-- Contacts
    |-- Copyright       |                  |                   |                   |-- Subscribers
```

### Boundary Definitions
1. **Site Settings CMS**: Owns global company identity, brand assets, contact channels, social profiles, footer text, business hours, and global SEO fallback defaults.
2. **Navigation CMS**: Owns menu hierarchy, submenus, mega menu configurations, and footer link structures.
3. **SEO CMS / Page SEO**: Owns route-specific title overrides, meta descriptions, and article structured schema for individual pages (`/blog/:slug`, `/services/:id`).
4. **Environment Configuration**: Owns database credentials, JWT secrets, server ports, and third-party API keys.
5. **Feature CMS Modules**: Owns domain entity records (Blogs, Services, Portfolio, Team, FAQs, Industries, Contacts, Subscribers).

---

## 9. Proposed Future Database Model (`site_settings`)

To support maximum flexibility and group organization, a **Grouped Key-Value Settings Schema** is recommended:

```sql
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
```

### Proposed Initial Settings Keys
- **Group `identity`**: `company_name`, `brand_tagline`, `logo_url`, `favicon_url`, `canonical_url`
- **Group `contact`**: `contact_email`, `contact_phone`, `whatsapp_phone`, `office_address`, `google_maps_url`, `maps_iframe_url`
- **Group `social`**: `social_linkedin`, `social_instagram`, `social_facebook`, `social_twitter`, `social_youtube`, `social_pinterest`
- **Group `footer`**: `footer_description`, `footer_copyright`, `google_review_url`
- **Group `seo`**: `global_seo_title`, `global_seo_description`, `global_seo_keywords`, `global_og_image`
- **Group `business`**: `business_hours`, `response_sla`

---

## 10. Recommended Step-by-Step Implementation Roadmap

1. **Step 1 — Discovery & Audit**: **COMPLETE** (This document).
2. **Step 2 — Database Schema & Initial Seeds**: Create `site_settings` table and seed existing hardcoded values.
3. **Step 3 — Backend API Implementation**: Create `GET /api/settings` (public cacheable endpoint) and `PUT /api/settings` (admin protected endpoint).
4. **Step 4 — Admin Panel UI Integration**: Add "Site Settings" tab in `AdminDashboard.jsx` with tabbed form sections (Identity, Contact, Social, Footer, Global SEO).
5. **Step 5 — Frontend Integration**: Wrap frontend in a `SiteSettingsContext` provider so `Navbar.jsx`, `Footer.jsx`, `Contact.jsx`, and `SEO.jsx` consume settings dynamically from the API.

---

## 11. Verification & Read-Only Safety Confirmation

- **Application Code**: No files modified in `frontend/src` or `backend`.
- **Database Schema**: No tables created or modified in `srj_db`.
- **Unrelated Deleted Upload**: `backend/public/uploads/1788851060523-246555465.jpeg` preserved **UNSTAGED** in working tree.
- **Git Operations**: `git add`, `git commit`, and `git push` were **NOT** executed.
