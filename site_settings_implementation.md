# Site Settings CMS — Implementation & Migration Log

## Overview

This document tracks the technical implementation, schema updates, backend API development, and frontend integration of the **Site Settings CMS** for the SRJ Global Website.

---

## Step 1 — Discovery & Data Ownership Audit
- **Status**: COMPLETE
- **Documentation**: [`site_settings_discovery_audit.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/site_settings_discovery_audit.md)
- **Summary**: Identified 26 non-secret global setting items across 6 logical groups (`identity`, `contact`, `social`, `footer`, `seo`, `business`). Established strict ownership boundaries separating Site Settings from Navigation CMS, SEO CMS, Environment Variables, and Feature CMS modules.

---

## Step 2 — Database Schema + Initial Settings Seed
- **Status**: COMPLETE
- **Scope**: Database-only implementation. Created `site_settings` table in MySQL (`srj_db`), updated `backend/schema.sql`, and seeded initial global non-secret settings.

### 1. Database Table DDL (`site_settings`)

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

---

### 2. Initial Seed Data (26 Discovered Global Settings)

| Group | Setting Key (`setting_key`) | Field Type | Default Seed Value | Description |
|---|---|---|---|---|
| **identity** | `company_name` | `text` | `SRJ Global Technologies` | Official brand name of the company |
| **identity** | `brand_tagline` | `text` | `Premium Scalable IT & Software Solutions` | Global company tagline/slogan |
| **identity** | `logo_url` | `url` | `/src/assets/Logo.png` | Path to company logo asset |
| **identity** | `favicon_url` | `url` | `/favicon.png` | Path to site favicon |
| **identity** | `canonical_url` | `url` | `https://srjglobaltechnology.com` | Canonical site URL |
| **contact** | `contact_email` | `email` | `srjglobaltechnology@gmail.com` | Primary business contact email |
| **contact** | `contact_phone` | `phone` | `+91 99904 30305` | Primary customer phone number |
| **contact** | `whatsapp_phone` | `phone` | `+91 92667 06599` | WhatsApp support phone number |
| **contact** | `office_address` | `textarea` | `C-1101, Urbtech Trade Center Tower, Noida Sector-132, Uttar Pradesh 201304` | Physical office address |
| **contact** | `google_maps_url` | `url` | `https://maps.google.com/?q=Urbtech+Trade+Center+Tower+Noida+Sector+132` | Google Maps direction link |
| **contact** | `maps_iframe_url` | `url` | `https://www.google.com/maps?q=Urbtech+Trade+Center+Tower+Noida+Sector+132&output=embed` | Google Maps embed iframe URL |
| **social** | `social_instagram` | `url` | `https://www.instagram.com/` | Instagram page URL |
| **social** | `social_pinterest` | `url` | `https://www.pinterest.com/` | Pinterest page URL |
| **social** | `social_youtube` | `url` | `https://www.youtube.com/` | YouTube channel URL |
| **social** | `social_facebook` | `url` | `https://www.facebook.com/` | Facebook page URL |
| **social** | `social_twitter` | `url` | `https://twitter.com/` | Twitter / X profile URL |
| **social** | `social_linkedin` | `url` | `https://www.linkedin.com/` | LinkedIn company page URL |
| **footer** | `footer_description` | `textarea` | `Innovative digital solutions: we build high-quality websites, mobile apps, and custom enterprise platforms for growing brands.` | Short company bio displayed in footer |
| **footer** | `footer_copyright` | `text` | `© {year} SRJ Global Technologies. All rights reserved.` | Footer copyright statement |
| **footer** | `google_review_url` | `url` | `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID` | Google Business Review URL |
| **seo** | `global_seo_title` | `text` | `SRJ Global Technologies \| Premium Scalable IT & Software Solutions` | Default global site SEO title |
| **seo** | `global_seo_description` | `textarea` | `SRJ Global Technologies builds premium, scalable digital platforms, applications, and artificial intelligence solutions for modern businesses.` | Default global meta description |
| **seo** | `global_seo_keywords` | `text` | `contact SRJ Global Technologies, hire developers, IT consultation` | Default global meta keywords |
| **seo** | `global_og_image` | `url` | `https://srjglobaltechnology.com/og-image.png` | Default Open Graph share image URL |
| **business** | `response_sla` | `text` | `within 24 hours` | Standard inquiry response SLA promise |
| **business** | `business_hours` | `text` | `Mon - Sat: 9:00 AM - 7:00 PM IST` | Company business operating hours |

---

### 3. Verification & Results

- **Table Creation**: `site_settings` created in MySQL database `srj_db`.
- **Seed Execution**: Executed `INSERT INTO site_settings ... ON DUPLICATE KEY UPDATE`.
- **Total Records in Database**: **26 rows**.
- **Group Breakdown**:
  - `business`: 2 settings
  - `contact`: 6 settings
  - `footer`: 3 settings
  - `identity`: 5 settings
  - `seo`: 4 settings
  - `social`: 6 settings
- **Schema File Updated**: [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql) updated with standard DDL and seed statements.

---

## Step 2 Scope Verification

- **Controllers modified**: NONE (0)
- **Routes modified**: NONE (0)
- **API Endpoints created**: NONE (0)
- **Frontend Components modified**: NONE (0)
- **Packages installed**: NONE (0)
- **Git operations**: NO commits or pushes executed. Unstaged image asset `backend/public/uploads/1788851060523-246555465.jpeg` preserved.

---

## Step 3 — Backend API Implementation
- **Status**: COMPLETE
- **Scope**: Backend API only. Implemented controller, routes, validations, registered `/api/settings` endpoint, and tested all public and protected admin behavior.

### 1. Database Seed Idempotency Verification
- Verified `INSERT INTO site_settings ... ON DUPLICATE KEY UPDATE` behavior in [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql).
- The `ON DUPLICATE KEY UPDATE` clause updates metadata fields (`group_name`, `field_type`, `description`) but **does NOT touch `setting_value`**.
- Tested via idempotency test script (`test_seed_idempotency.js`): Any custom administrator-edited setting value is preserved upon subsequent schema initializations/re-seeds.

---

### 2. Endpoints Implemented

#### Public Endpoint
- **`GET /api/settings`**
  - **Access**: Public
  - **Description**: Returns key-value dictionary map (`settings`) and grouped map (`groups`) of all 26 non-secret global settings for fast public site rendering.
  - **Sample Response**:
    ```json
    {
      "success": true,
      "settings": {
        "company_name": "SRJ Global Technologies",
        "contact_email": "srjglobaltechnology@gmail.com",
        "contact_phone": "+91 99904 30305",
        "logo_url": "/src/assets/Logo.png"
      },
      "groups": {
        "identity": { "company_name": "SRJ Global Technologies", ... },
        "contact": { "contact_email": "srjglobaltechnology@gmail.com", ... }
      }
    }
    ```

#### Protected Admin Endpoints (`verifyToken` + `isAdmin`)
- **`GET /api/settings/admin`**
  - **Access**: Admin JWT required
  - **Description**: Returns all 26 settings with full metadata (`id`, `setting_key`, `setting_value`, `group_name`, `field_type`, `description`, `created_at`, `updated_at`) and group arrays.
- **`PUT /api/settings/:key`**
  - **Access**: Admin JWT required
  - **Description**: Updates single setting by key. Accepts `{ "value": "..." }` or `{ "setting_value": "..." }`.
  - **Validation**: Enforces 404 for unknown keys, format checks for email/URL field types.
- **`PUT /api/settings/bulk`** (and `PUT /api/settings`)
  - **Access**: Admin JWT required
  - **Description**: Bulk updates multiple settings in a single request. Accepts object dictionary `{ "settings": { "key": "val" } }` or key-value map.
  - **Validation**: Validates keys exist in DB and validates value formats. Returns updated keys list and fresh settings dictionary map.

---

### 3. Files Created / Modified in Step 3
1. **New Controller**: [`backend/controllers/siteSettingController.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/controllers/siteSettingController.js)
2. **New Routes**: [`backend/routes/siteSettingRoutes.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/routes/siteSettingRoutes.js)
3. **Middleware Validators**: Updated [`backend/middleware/validators.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/middleware/validators.js) with `validateUpdateSettingKey` and `validateBulkUpdateSettings`.
4. **Server Entry Point**: Registered `app.use("/api/settings", siteSettingRoutes)` in [`backend/server.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/server.js).

---

### 4. Automated API Testing Results (`test_site_settings_api.js`)
All 8 test scenarios passed against running test server:
- `GET /api/settings` -> 200 OK (26 settings, 6 groups)
- `GET /api/settings/admin` (Unauthenticated) -> 401 Unauthorized
- `GET /api/settings/admin` (Admin Token) -> 200 OK (26 settings with metadata)
- `PUT /api/settings/company_name` -> 200 OK (Updated setting_value)
- `GET /api/settings` -> Verified public endpoint returns updated `company_name`
- `PUT /api/settings/bulk` -> 200 OK (Updated 3 settings in bulk)
- `PUT /api/settings/contact_email` (Invalid email format) -> 400 Bad Request
- `PUT /api/settings/bulk` (Unknown key `non_existent_secret_key`) -> 400 Bad Request

---

## Step 3 Scope Verification

- **Frontend Components modified**: NONE (0)
- **Admin UI modified**: NONE (0)
- **Packages installed**: NONE (0)
- **Git operations**: NO commits or pushes executed. Unstaged image asset `backend/public/uploads/1788851060523-246555465.jpeg` preserved.

---

## Step 3 Verification Completion Pass
- **Status**: 100% PASSED & VERIFIED
- **Script Executed**: `scratch/verify_step3_completion.js`

### Verification Summary Results

1. **Public Group Filtering (`GET /api/settings?group=contact`)**:
   - **Result**: HTTP 200 OK.
   - **Behavior**: Returns only the 6 settings belonging to group `'contact'` (`contact_email`, `contact_phone`, `whatsapp_phone`, `office_address`, `google_maps_url`, `maps_iframe_url`). Non-contact settings (`identity`, `social`, `footer`, `seo`, `business`) are completely excluded.
   - **Invalid Group Query (`GET /api/settings?group=invalid_group_xyz`)**:
     - **Result**: HTTP 200 OK.
     - **Behavior**: Returns intentional 200 OK empty maps (`settings: {}`, `groups: {}`), matching REST conventions.

2. **Authentication States**:
   - **No JWT (`GET /api/settings/admin`)**: HTTP 401 Unauthorized (`No token provided`).
   - **Invalid JWT (`GET /api/settings/admin`)**: HTTP 401 Unauthorized (`Invalid or expired token`).
   - **Non-Admin Role (`GET /api/settings/admin` with role `'user'`)**: HTTP 403 Forbidden (`Admin access required`).

3. **Setting Update + Direct Database Integrity**:
   - Tested updating `response_sla` from `"within 24 hours"` to `"within 6 hours"`.
   - **API Response**: HTTP 200 OK (`Setting 'response_sla' updated successfully`).
   - **Direct MySQL Query**: Verified `SELECT setting_value FROM site_settings WHERE setting_key = 'response_sla'` returned `"within 6 hours"`.
   - **Public GET**: Verified `GET /api/settings` returned `"within 6 hours"`.
   - **Restoration**: Restored `"within 24 hours"` and verified direct MySQL database restoration.

4. **URL Validation**:
   - Tested updating `google_maps_url` with invalid value `"invalid-url-string"`.
   - **Result**: HTTP 400 Bad Request (`Invalid URL format for key 'google_maps_url'`). Value in database remained unchanged.

5. **Phone Validation**:
   - Tested updating `contact_phone` with invalid value `"invalid_phone_abc"`.
   - **Result**: HTTP 400 Bad Request (`Invalid phone number format for key 'contact_phone'`). Value in database remained unchanged.

6. **Secret Exposure Audit**:
   - Audited all output keys and values from `GET /api/settings` and `GET /api/settings/admin`.
   - **Result**: **ZERO** sensitive keys, passwords (`DB_PASSWORD`), JWT secrets (`JWT_SECRET`), API keys (`GROQ_API_KEY`), or environment variables exposed in any response.

7. **Bulk Update Verification**:
   - Tested `PUT /api/settings/bulk` updating `response_sla` and `business_hours` in a single request.
   - **Result**: Requires admin auth, HTTP 200 OK (`Successfully updated 2 setting(s)`).
   - **Unknown Key Check**: Tested `PUT /api/settings/bulk` with unknown key `non_existent_key_xyz` -> HTTP 400 Bad Request (`Unknown setting key(s): non_existent_key_xyz`).
   - **Restoration**: Restored all original values.

8. **Redundant Endpoint Observation**:
   - Observed that `PUT /api/settings` is an alias to `PUT /api/settings/bulk`.
   - **Recommendation**: Documented as redundant; `PUT /api/settings/bulk` is the primary bulk endpoint and `PUT /api/settings/:key` is the primary single setting endpoint.

9. **Row Count & Database Integrity**:
   - `SELECT COUNT(*) FROM site_settings;` -> **26 rows**.
   - `SELECT setting_key, COUNT(*) FROM site_settings GROUP BY setting_key HAVING COUNT(*) > 1;` -> **0 duplicate rows**.
   - `SELECT COUNT(*) FROM contacts;` -> **4 rows** (including test submission from Contact CMS E2E verification).
   - Database tables count: **15 tables** (all pre-existing feature tables intact).

---

## Step 4 — Admin Panel UI Discovery & Design Specification
- **Status**: DISCOVERY COMPLETE (Design Specification Prepared)
- **Scope**: Discovery and architectural specification for the upcoming Admin Panel UI implementation. Zero code or database modifications executed in this step.

### 1. Current Admin Panel Architecture
- **Location**: [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx)
- **Navigation Pattern**: Sidebar navigation menu driven by `activeTab` state (`blogs`, `services`, `contacts`, `plans`, `careers`, `promotions`, `testimonials`, `portfolio`, `faqs`, `industries`, `team`, `subscribers`, `users`).
- **Icons & Styling**: `lucide-react` icon set, Tailwind CSS with dark slate sidebars, rounded cards (`rounded-2xl`), bold headings, and clean input controls.
- **API Client**: Centralized Axios client ([`frontend/src/config/api.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/config/api.js)) with automatic JWT header injection from `localStorage.getItem('adminToken')`.

---

### 2. Recommended Component Structure
- **Component File**: Create standalone modular component [`frontend/src/components/admin/SiteSettingsManager.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/SiteSettingsManager.jsx).
- **Integration Point in `AdminDashboard.jsx`**:
  1. Add `Settings` to `lucide-react` imports (already imported).
  2. Add Sidebar navigation button:
     ```jsx
     <button
       onClick={() => setActiveTab('settings')}
       className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
         activeTab === 'settings' 
           ? 'bg-slate-900 text-white shadow-md' 
           : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
       }`}
     >
       <Settings size={18} />
       Site Settings
     </button>
     ```
  3. Render manager inside main content container:
     ```jsx
     {activeTab === 'settings' && <SiteSettingsManager />}
     ```
- **Rationale**: Isolating Site Settings management into `SiteSettingsManager.jsx` prevents bloat in `AdminDashboard.jsx` and maintains clean modular separation.

---

### 3. Complete 26 Settings UI Control & Validation Mapping

| Setting Key | Group | Field Type | Intended UI Control | Editable | Validation Rules | Helper Text |
|---|---|---|---|---|---|---|
| `company_name` | `identity` | `text` | Text Input | Yes | Required, 2-100 chars | Official brand name displayed across header, footer, & meta tags |
| `brand_tagline` | `identity` | `text` | Text Input | Yes | Required, 5-150 chars | Global company slogan/tagline |
| `logo_url` | `identity` | `url` | Text/URL Input + Preview | Yes | Valid relative or HTTP/HTTPS URL | Path or URL to brand logo asset |
| `favicon_url` | `identity` | `url` | Text/URL Input + Preview | Yes | Valid relative or HTTP/HTTPS URL | Path or URL to site favicon asset |
| `canonical_url` | `identity` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | Canonical base domain URL |
| `contact_email` | `contact` | `email` | Email Input (`type="email"`) | Yes | Valid email format | Primary business contact email |
| `contact_phone` | `contact` | `phone` | Tel Input (`type="tel"`) | Yes | Valid phone regex | Primary customer support phone number |
| `whatsapp_phone` | `contact` | `phone` | Tel Input (`type="tel"`) | Yes | Valid phone regex | WhatsApp support phone number |
| `office_address` | `contact` | `textarea` | Textarea (3 rows) | Yes | Required, max 255 chars | Physical office address displayed on Contact page and Footer |
| `google_maps_url` | `contact` | `url` | URL Input (`type="url"`) | Yes | Valid HTTP/HTTPS URL | Direct Google Maps direction link |
| `maps_iframe_url` | `contact` | `url` | URL Input (`type="url"`) | Yes | Valid Google Maps embed iframe URL | Google Maps embed iframe URL |
| `social_instagram` | `social` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | Instagram profile URL |
| `social_pinterest` | `social` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | Pinterest business URL |
| `social_youtube` | `social` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | YouTube channel URL |
| `social_facebook` | `social` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | Facebook page URL |
| `social_twitter` | `social` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | Twitter / X profile URL |
| `social_linkedin` | `social` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | LinkedIn company page URL |
| `footer_description` | `footer` | `textarea` | Textarea (3 rows) | Yes | Max 500 chars | Short company summary displayed in footer |
| `footer_copyright` | `footer` | `text` | Text Input | Yes | Required text (supports `{year}`) | Footer copyright template |
| `google_review_url` | `footer` | `url` | URL Input | Yes | Valid HTTP/HTTPS URL | Direct Google Business review link |
| `global_seo_title` | `seo` | `text` | Text Input | Yes | Max 150 chars | Default global `<title>` tag |
| `global_seo_description` | `seo` | `textarea` | Textarea (3 rows) | Yes | Max 500 chars | Default global meta description |
| `global_seo_keywords` | `seo` | `text` | Text Input | Yes | Comma-separated words | Default search keywords |
| `global_og_image` | `seo` | `url` | URL Input + Preview | Yes | Valid HTTP/HTTPS image URL | Default social share image (`og:image`) |
| `response_sla` | `business` | `text` | Text Input | Yes | Max 100 chars | Customer inquiry response SLA promise |
| `business_hours` | `business` | `text` | Text Input | Yes | Max 100 chars | Operating business hours |

---

### 4. Save & State Management Strategy
- **Initial Fetch**: `GET /api/settings/admin` loads all settings with group metadata.
- **Sub-group Navigation**: Tabs inside `SiteSettingsManager.jsx` for group navigation (`Identity`, `Contact`, `Social`, `Footer`, `SEO`, `Business`, `All`).
- **Dirty State Tracking**: Tracks modified values in form state (`isDirty` boolean flag).
- **Canonical Save Endpoint**: `PUT /api/settings/bulk` (sending `{ settings: { [key]: value } }`).
- **Save Actions**:
  - Top action bar featuring `"Save Changes"` (disabled when not dirty, animated spinner when saving) and `"Discard Changes"` reset button.
  - Success banner / toast message upon successful update.
  - Error banner upon validation or network error.

---

### 5. Layout & Responsive Strategy
- **Grid Layout**: 2-column responsive layout (`grid-cols-1 md:grid-cols-2 gap-6`) for field inputs within card containers.
- **Mobile Widths**: Full-width inputs (`w-full`), stacked vertical fields on mobile/tablet viewports, ensuring zero horizontal overflow.

---

### 6. Security & Secret Boundaries
- All requests use `api` client from `frontend/src/config/api.js`.
- **Zero secret exposure**: UI manages exclusively non-secret global site configuration keys. Server-side environment variables (`DB_PASSWORD`, `JWT_SECRET`, `GROQ_API_KEY`, etc.) are never rendered or editable in the UI.

---

### 7. Files Changed in Step 4 Implementation
1. **[NEW]** [`frontend/src/components/admin/SiteSettingsManager.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/SiteSettingsManager.jsx)
2. **[MODIFY]** [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx) (Mounted sidebar item & `activeTab === 'settings'` renderer)

---

## Step 4 Admin Panel UI Implementation & Verification
- **Status**: 100% COMPLETED & VERIFIED
- **Component Created**: [`frontend/src/components/admin/SiteSettingsManager.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/SiteSettingsManager.jsx)
- **Integration**: Mounted inside [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx) under sidebar `activeTab === 'settings'`.

### Implementation Summary
- **Data Loading**: On mount, calls `api.get('/settings/admin')` using the centralized Axios API client. Dynamically builds local state for all 26 settings across 6 groups (`identity`, `contact`, `social`, `footer`, `seo`, `business`).
- **Control Types**:
  - `text` -> Text input
  - `email` -> Email input (`type="email"`)
  - `phone` -> Telephone input (`type="tel"`)
  - `url` -> URL input (`type="url"`)
  - `textarea` -> Multi-line textarea (for `office_address`, `footer_description`, `global_seo_description`)
- **Asset Previews**: Built-in asset preview with graceful fallback (`onError` handler) for `logo_url`, `favicon_url`, and `global_og_image`.
- **Save Strategy**: Bulk update via `api.put('/settings/bulk', { settings: payload })` sending only modified fields.
- **State Management**:
  - `savedSettings` vs `currentSettings` comparison.
  - `isDirty` calculation.
  - "Save Changes" (enabled when dirty, animated spinner while saving) & "Discard Changes" (restores server baseline).
- **Error / Feedback Handling**: Inline success toast banner, error message banner preserving user-entered input on backend 400 validation failures.
- **Security Boundaries**: Zero exposure of environment variables (`DB_PASSWORD`, `JWT_SECRET`, etc.).

### Verification Results
- **Frontend Build**: Executed `cd frontend && npm run build` -> **0 build errors**.
- **API Integration Test**: Executed `test_step4_ui_integration.js` -> 100% passed (Admin GET 26 settings, bulk PUT update, public GET verification, baseline restoration).

---

## Step 5 — Frontend Migration Discovery & Architectural Plan
- **Status**: DISCOVERY COMPLETE (Migration Plan Specification Prepared)
- **Scope**: Discovery and architectural specification for migrating hardcoded site settings in frontend components to dynamic Site Settings API consumption. Zero application source code modifications executed in this step.

### 1. Complete Hardcoded Global-Setting Inventory

| Setting Key | Group | Discovered Hardcoded Occurrences | Current Hardcoded Value | Migration Target Component |
|---|---|---|---|---|
| `company_name` | `identity` | `Navbar.jsx` (L125), `Footer.jsx` (L81), `SEO.jsx` (L12, L18), `index.html` (L12), `PrivacyPolicy.jsx` (L327), `TermsConditions.jsx` (L339) | `"SRJ Global Technologies"` / `"SRJ Global"` | `Navbar.jsx`, `Footer.jsx`, `SEO.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` via `useSiteSettings()` |
| `brand_tagline` | `identity` | `Footer.jsx` (L84), `SEO.jsx` (L21), `index.html` (L7) | `"Innovative digital solutions..."` / `"Premium Scalable IT & Software Solutions"` | `Footer.jsx`, `SEO.jsx` via `useSiteSettings()` |
| `logo_url` | `identity` | `Navbar.jsx` (L120), `Footer.jsx` (L73) | `../assets/Logo.png` | `Navbar.jsx`, `Footer.jsx` via `useSiteSettings()` |
| `favicon_url` | `identity` | `index.html` (L5) | `/favicon.png` | Dynamic DOM `<link rel="icon">` update via `SiteSettingsContext` |
| `canonical_url` | `identity` | `SEO.jsx` (L8, L19), `Contact.jsx` (L64) | `https://srjglobaltechnology.com` | `SEO.jsx` `<link rel="canonical">` & og:url meta tags |
| `contact_email` | `contact` | `Footer.jsx` (L127), `Contact.jsx` (L277, L283), `PrivacyPolicy.jsx` (L332), `TermsConditions.jsx` (L344) | `srjglobaltechnology@gmail.com` | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `contact_phone` | `contact` | `Footer.jsx` (L134), `Contact.jsx` (L287, L293), `PrivacyPolicy.jsx` (L334), `TermsConditions.jsx` (L345) | `+91 99904 30305` | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `whatsapp_phone` | `contact` | `Footer.jsx` (L137), `PrivacyPolicy.jsx` (L336), `TermsConditions.jsx` (L346) | `+91 92667 06599` / `https://wa.me/919266706599` | `Footer.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `office_address` | `contact` | `Footer.jsx` (L150), `Contact.jsx` (L309), `PrivacyPolicy.jsx` (L329), `TermsConditions.jsx` (L341) | `C-1101, Urbtech Trade Center Tower, Noida Sector-132...` | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `google_maps_url` | `contact` | `Footer.jsx` (L145), `Contact.jsx` (L298) | `https://maps.google.com/?q=Urbtech+Trade+Center+Tower+Noida+Sector+132` | `Footer.jsx`, `Contact.jsx` direction anchor links |
| `maps_iframe_url` | `contact` | `Contact.jsx` (L322) | `https://www.google.com/maps?q=Urbtech+Trade+Center+Tower+Noida+Sector+132&output=embed` | `Contact.jsx` iframe `src` |
| `social_instagram` | `social` | `Footer.jsx` (L11) | `https://www.instagram.com/` | `Footer.jsx` social icon loop |
| `social_pinterest` | `social` | `Footer.jsx` (L20) | `https://www.pinterest.com/` | `Footer.jsx` social icon loop |
| `social_youtube` | `social` | `Footer.jsx` (L29) | `https://www.youtube.com/` | `Footer.jsx` social icon loop |
| `social_facebook` | `social` | `Footer.jsx` (L38) | `https://www.facebook.com/` | `Footer.jsx` social icon loop |
| `social_twitter` | `social` | `Footer.jsx` (L47) | `https://twitter.com/` | `Footer.jsx` social icon loop |
| `social_linkedin` | `social` | `Footer.jsx` (L56) | `https://www.linkedin.com/` | `Footer.jsx` social icon loop |
| `footer_description` | `footer` | `Footer.jsx` (L90) | `"Innovative digital solutions: we build high-quality websites..."` | `Footer.jsx` company bio paragraph |
| `footer_copyright` | `footer` | `Footer.jsx` (L189) | `"© {currentYear} SRJ Global Technologies. All rights reserved."` | `Footer.jsx` copyright bar (replacing `{year}` dynamically) |
| `google_review_url` | `footer` | `Footer.jsx` (L164) | `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID` | `Footer.jsx` Google Review button href |
| `global_seo_title` | `seo` | `SEO.jsx` (L12), `index.html` (L12) | `"SRJ Global Technologies \| Premium Scalable IT & Software Solutions"` | `SEO.jsx` fallback site title |
| `global_seo_description` | `seo` | `SEO.jsx` (L21), `index.html` (L7) | `"SRJ Global Technologies builds premium, scalable digital platforms..."` | `SEO.jsx` default meta description |
| `global_seo_keywords` | `seo` | `Contact.jsx` (L67), `App.jsx` (L63) | `"contact SRJ Global Technologies, hire developers, IT consultation"` | `SEO.jsx` default meta keywords |
| `global_og_image` | `seo` | `SEO.jsx` (L7, L20) | `https://srjglobaltechnology.com/og-image.png` | `SEO.jsx` default `og:image` and `twitter:image` |
| `response_sla` | `business` | `Contact.jsx` (L82) | `"within 24 hours"` | `Contact.jsx` consultation SLA text |
| `business_hours` | `business` | Unlisted in public layout | `Mon - Sat: 9:00 AM - 7:00 PM IST` | `Footer.jsx` / `Contact.jsx` business info |

---

### 2. Centralized Frontend Architecture (`SiteSettingsContext`)

To prevent every individual component from firing duplicated `GET /api/settings` requests, we will implement a centralized **`SiteSettingsContext`**:

- **File**: `frontend/src/context/SiteSettingsContext.jsx`
- **Provider**: `<SiteSettingsProvider>` wrapped in [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx) (or [`frontend/src/main.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/main.jsx)).
- **Custom Hook**: `useSiteSettings()` returning `{ settings, loading, error, getSetting }`.
- **Loading & Fallback Strategy**:
  - The provider initializes `settings` state with an in-memory fallback dictionary containing the original baseline values.
  - On mount, `SiteSettingsProvider` executes `api.get('/settings')` (the public safe-read endpoint).
  - When the response is received, state is updated seamlessly.
  - **Zero FOUC / Zero Blank Screen**: Components render immediately using hardcoded fallback values, then re-render smoothly with dynamic API data.
  - **Error Handling**: If the API call fails or the user is offline, the provider catches the error silently and keeps the safe baseline fallbacks active.

---

### 3. Special Case Resolution

1. **`index.html` Strategy**:
   - `index.html` retains static fallback `<title>` and `<meta name="description">` tags for initial HTML parsing prior to React initialization.
   - At runtime, `SEO.jsx` (powered by `react-helmet-async`) dynamically updates document title and meta tags.

2. **Favicon Runtime Strategy**:
   - When `settings.favicon_url` is loaded in `SiteSettingsContext`, a small effect updates `<link rel="icon">` in `document.head`:
     ```javascript
     if (settings.favicon_url) {
       let link = document.querySelector("link[rel*='icon']");
       if (!link) {
         link = document.createElement('link');
         link.rel = 'icon';
         document.head.appendChild(link);
       }
       link.href = settings.favicon_url;
     }
     ```

3. **Logo URL Strategy**:
   - If `logo_url` is a relative path starting with `/src/assets/`, fall back to imported `logoImg` asset. If it is an HTTP/HTTPS URL or `/uploads/...` URL, use the dynamic URL directly.

4. **WhatsApp Link Formatting Strategy**:
   - Helper function formats raw `whatsapp_phone` setting into clean `wa.me` links:
     ```javascript
     const getWhatsAppLink = (phoneStr) => {
       const digits = (phoneStr || '').replace(/\D/g, '');
       return digits ? `https://wa.me/${digits}` : 'https://wa.me/';
     };
     ```

5. **Social Links Visibility Strategy**:
   - In `Footer.jsx`, filter social items so only platforms with non-empty setting URLs are rendered:
     ```javascript
     const activeSocials = socialList.filter(item => item.url && item.url.trim() !== '');
     ```

6. **Relative vs Absolute Image URLs**:
   - Relative URLs starting with `/` are resolved against origin (`window.location.origin + path`). Absolute URLs (`http://`, `https://`) are rendered directly.

7. **Legal Pages (`PrivacyPolicy` & `TermsConditions`) Strategy**:
   - Consume `useSiteSettings()` to populate company name, address, email, and phone numbers dynamically.

8. **Contact Page Strategy**:
   - Consume `useSiteSettings()` for email, phone, office location, Google Maps URL, location map iframe URL, and `response_sla`.
   - Public inquiry submission (`POST /api/contact`) remains completely decoupled.

---

### 4. Explicit List of Content That Must NOT Be Migrated

1. **Page-Specific Meta & Titles**: Individual blog post titles, service detail page titles, industry titles (managed via route params / feature CMS).
2. **Feature CMS Content**: Blogs, Services, Testimonials, Portfolio items, FAQs, Team members, Pricing plans, Subscriber records.
3. **Environment & Server Configuration**: API URLs (`VITE_API_URL`), JWT secrets, DB credentials.

---

### 5. Step-by-Step Implementation Plan for Step 5 Execution

- **Substep 5.1**: Create [`frontend/src/context/SiteSettingsContext.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/context/SiteSettingsContext.jsx) with baseline fallbacks, dynamic favicon DOM updater, and `useSiteSettings()` hook.
- **Substep 5.2**: Wrap `App.jsx` with `<SiteSettingsProvider>`.
- **Substep 5.3**: Update [`frontend/src/components/SEO.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/SEO.jsx) to consume site settings dynamically for global title, description, keywords, canonical domain, and OG image.
- **Substep 5.4**: Update [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) (logo & company name).
- **Substep 5.5**: Update [`frontend/src/components/Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx) (logo, brand name, bio summary, social links, email, phone, address, google review link, copyright).
- **Substep 5.6**: Update [`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx) (email, phone, address, map iframe URL, SLA promise).
- **Substep 5.7**: Update [`frontend/src/components/PrivacyPolicy.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/PrivacyPolicy.jsx) & [`frontend/src/components/TermsConditions.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/TermsConditions.jsx) (company name, address, email, phone).
- **Substep 5.8**: End-to-End Build & Verification (`cd frontend && npm run build`).

---

### 6. Expected Files Changing in Implementation
1. **[NEW]** [`frontend/src/context/SiteSettingsContext.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/context/SiteSettingsContext.jsx)
2. **[MODIFY]** [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx)
3. **[MODIFY]** [`frontend/src/components/SEO.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/SEO.jsx)
4. **[MODIFY]** [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx)
5. **[MODIFY]** [`frontend/src/components/Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx)
6. **[MODIFY]** [`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx)
7. **[MODIFY]** [`frontend/src/components/PrivacyPolicy.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/PrivacyPolicy.jsx)
8. **[MODIFY]** [`frontend/src/components/TermsConditions.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/TermsConditions.jsx)



---

## Step 5A Centralized Context + Navbar/Footer Migration
- **Status**: 100% COMPLETED & VERIFIED
- **Scope**: Implemented centralized frontend Site Settings consumption layer (`SiteSettingsContext`) and migrated `Navbar.jsx` & `Footer.jsx` to consume site settings dynamically.

### 1. SiteSettingsContext Architecture
- **Location**: [`frontend/src/context/SiteSettingsContext.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/context/SiteSettingsContext.jsx)
- **Exports**: `SiteSettingsProvider`, `useSiteSettings()`, `SiteSettingsContext`.
- **API Client**: Calls `api.get('/settings')` using centralized client [`frontend/src/config/api.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/config/api.js).
- **State Exposed**: `{ settings, loading, error, getSetting }`.
- **Helper `getSetting(key, fallback)`**: Returns setting value if defined, non-null, and non-empty; otherwise returns optional component-level fallback.
- **Fallback Policy**: Does NOT copy complete hardcoded dictionary into Context as silent fallback. Proper loading and error states are exposed to components.

### 2. App Provider Integration
- **Location**: [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx)
- **Integration**: Wrapped the top-level application with `<SiteSettingsProvider>`.
- **Preserved Behavior**: Routing, LenisProvider order, lazy loading, admin routes, chatbot, and authentication logic untouched.

### 3. Navbar Migration
- **Location**: [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx)
- **Settings Consumed**:
  - `company_name`: Dynamic brand name alt text and title label.
  - `logo_url`: Dynamic brand logo image URL.
- **Logo URL Handling**: Correctly handles absolute HTTP/HTTPS URLs, `/uploads/...` server assets, and fallback local assets without double-domain prepending.
- **Preserved**: Layout, sticky scroll behavior, mega-menus (Services & Pricing), mobile menu drawer, desktop/mobile responsive styling, secret triple-click admin trigger.

### 4. Footer Migration
- **Location**: [`frontend/src/components/Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx)
- **Settings Consumed**:
  - `company_name`: Dynamic brand logo alt text and company heading.
  - `logo_url`: Dynamic brand logo image URL.
  - `brand_tagline`: Dynamic brand identity.
  - `footer_description`: Dynamic company bio summary text.
  - `contact_email`: Dynamic support email link.
  - `contact_phone`: Dynamic phone number link.
  - `whatsapp_phone`: Dynamic WhatsApp phone number.
  - `office_address`: Dynamic physical address block.
  - `google_maps_url`: Dynamic Google Maps direction link.
  - `google_review_url`: Dynamic Google Business review button link.
  - `footer_copyright`: Dynamic copyright template supporting `{year}` replacement.
  - `social_instagram`, `social_pinterest`, `social_youtube`, `social_facebook`, `social_twitter`, `social_linkedin`: Dynamic social links.
- **Social Item Filtering**: Social links array filters out empty/null setting values. Icons and SVG markup preserved without adding external icon libraries.
- **WhatsApp Construction**: On-the-fly digit normalization (`wa.me/${digits}`) without altering stored database values.
- **Copyright Template**: Replaces `{year}` placeholder dynamically with current year (`new Date().getFullYear()`).

### 5. Verification Results
- **Frontend Build**: Executed `cd frontend && npm run build` -> **0 build errors**.
- **Public API Connection**: Verified `GET /api/settings` loads successfully on mount.
- **Admin Panel Live Change**: Tested modifying `company_name` via `PUT /api/settings/bulk` -> confirmed public website updates dynamically. Restored baseline default.
- **Logo & URL Construction**: Tested relative `/uploads/...` paths and absolute `https://...` URLs.
- **WhatsApp & Social Links**: Verified `wa.me/` link construction and empty social link filtering.
- **Mobile Navbar & Footer**: Verified mobile menus, drawers, and footer layout remain fully responsive.

---

## Step 5B Contact + Legal Pages Migration
- **Status**: 100% COMPLETED & VERIFIED
- **Scope**: Migrated `Contact.jsx`, `PrivacyPolicy.jsx`, and `TermsConditions.jsx` to consume site settings dynamically via `useSiteSettings()`.

### 1. Migrated Components & Settings
1. **[`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx)**
   - `contact_email`: Support email link and displayed address.
   - `contact_phone`: Phone call link and displayed number.
   - `whatsapp_phone`: WhatsApp contact link (normalized to `https://wa.me/${digits}`).
   - `office_address`: Physical office location block.
   - `google_maps_url`: Direction link target for Office Location card.
   - `maps_iframe_url`: Location Map embed iframe `src`.
   - `response_sla`: Turnaround SLA text (`within 24 hours`).

2. **[`frontend/src/components/PrivacyPolicy.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/PrivacyPolicy.jsx)**
   - `company_name`: Dynamic company name in intro, business transfer sections, and contact block.
   - `office_address`: Dynamic physical office address in Contact Us section.
   - `contact_email`: Dynamic contact email address.
   - `contact_phone`: Dynamic support phone number.
   - `whatsapp_phone`: Dynamic WhatsApp phone number.

3. **[`frontend/src/components/TermsConditions.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/TermsConditions.jsx)**
   - `company_name`: Dynamic company name across intro, service terms, IP rights, cancellation policy, force majeure, and contact block.
   - `office_address`: Dynamic physical office address in Contact Us section.
   - `contact_email`: Dynamic contact email address.
   - `contact_phone`: Dynamic support phone number.
   - `whatsapp_phone`: Dynamic WhatsApp phone number.

### 2. Form API & Global Settings Decoupling
- **Contact Form Submission**: Public inquiry submission (`POST /api/contact`) remains completely decoupled and feature-CMS/database driven. Form fields, input state, validation, status messages, and API endpoint were strictly preserved without modification.
- **Global Settings Consumption**: Only static global contact details (email, phone, whatsapp, map embed iframe, SLA text) consume `useSiteSettings()`.

### 3. URL, WhatsApp & Map Handling
- **WhatsApp**: Numbers normalized at runtime via `(whatsappPhone || '').replace(/\D/g, '')` to construct clean `https://wa.me/${digits}` links without mutating stored database strings.
- **Maps**: `google_maps_url` opens external direction links safely. `maps_iframe_url` binds directly to iframe `src`.
- **URL Boundaries**: Supports absolute URLs (`http://`, `https://`) and relative paths without double-domain prepending.

### 4. Loading & Error Behavior
- Consumes shared `SiteSettingsContext` (single initial API call; zero duplicate network requests).
- Displays fallback values gracefully during initial fetch to prevent blank render states or layout shifts.
- If backend network fails, safe component default parameters take over gracefully without crashing the React tree.

### 5. Verification Results
- **Frontend Production Build**: `cd frontend && npm run build` -> **0 build errors**.
- **Contact Form E2E**: `POST /api/contact` successfully submitted inquiries with HTTP 201.
- **CMS Setting Mutation**: Temporarily modified `response_sla` from `"within 24 hours"` to `"within 2 hours"` via Admin API (`PUT /api/settings/bulk`). Verified public `GET /api/settings` reflected the update immediately. Restored original `"within 24 hours"` default.
- **Legal Pages**: Verified `PrivacyPolicy.jsx` and `TermsConditions.jsx` render dynamic company name and contact info without legal text disruption.

---

## Step 5C SEO + Global Metadata Migration
- **Status**: 100% COMPLETED & VERIFIED
- **Scope**: Migrated `SEO.jsx` and dynamic favicon handling to consume site settings dynamically while preserving page-specific SEO prop precedence.

### 1. Migrated SEO Settings & Precedence Hierarchy
- **Settings Consumed**:
  - `global_seo_title`: Default global document `<title>` tag.
  - `global_seo_description`: Default global meta description.
  - `global_seo_keywords`: Default global meta keywords.
  - `global_og_image`: Default Open Graph & Twitter share image asset.
  - `canonical_url`: Canonical domain base URL.
  - `company_name`: Organization identity for titles & JSON-LD schema.
  - `favicon_url`: Path or URL to site favicon asset.
- **Precedence Hierarchy**:
  ```
  page-specific SEO prop (e.g. title, description, keywords, image, url)
          ↓
  global Site Setting (e.g. global_seo_title, global_og_image, canonical_url)
          ↓
  existing safe static fallback parameter
  ```
  - **Title Precedence**: If a page supplies a `title` prop (e.g. `"Contact Us"` or `"Our Services"`), the document title renders `${title} | ${companyName}`. If `title` is omitted, `global_seo_title` takes precedence.
  - **Description & Keywords**: Page-specific `description` or `keywords` props override global defaults.

### 2. URL, Canonical & OG Image Normalization
- **Canonical URL**: `canonical_url` from Site Settings is normalized using helper `resolveCanonicalUrl(passedUrl, baseUrl)` to strip trailing slashes, resolve relative route paths (e.g. `/contact`), and prevent malformed double-domain strings (`https://domain.comhttps://domain.com`). Includes `<link rel="canonical" href={finalUrl} />` in `<Helmet>`.
- **OG & Twitter Image**: Resolves relative paths (e.g. `/uploads/og.png` or `/og-image.png`) against `canonical_url` using `resolveUrl(targetUrl, baseUrl)` while leaving absolute URLs (`http://`, `https://`) untouched.

### 3. Runtime Favicon Handling
- **Mechanism**: On mount and settings change, a side-effect searches for existing `link[rel~='icon']` in `document.head`.
- **Deduplication**: In-place mutation of the existing link's `href` attribute prevents duplicate favicon link creation on re-renders.
- **Resilience**: Gracefully catches missing settings or failed loads without crashing React execution.

### 4. `index.html` Static Fallback Rationale
- **Preserved Static Tags**: `index.html` retains static fallback `<title>`, `<meta name="description">`, and `<link rel="icon">` tags.
- **Rationale**: `index.html` is parsed by web browsers prior to JavaScript evaluation. Static tags ensure instant browser rendering during initial page load before React initializes `SiteSettingsContext` and `SEO.jsx`.

### 5. Structured Data (JSON-LD)
- **Organization Schema**: `orgSchema` dynamically populates `"name": companyName`, `"url": globalCanonicalUrl`, `"logo": finalImage`, and `"description": globalDescription`.
- **Article Schema**: `articleSchema` populates `"headline"`, `"image"`, and `"author.name": companyName`.
- **Isolation**: Feature-specific schemas (e.g. FAQs, Blogs, Services) remain untouched.

### 6. Security Audit
- Verified zero environment secrets (`DB_PASSWORD`, `JWT_SECRET`, `GROQ_API_KEY`, etc.) are exposed in public settings responses, DOM elements, or `<head>` meta tags.

### 7. Verification Results
- **Frontend Production Build**: `cd frontend && npm run build` -> **0 build errors**.
- **Public API Connection**: Single `SiteSettingsContext` fetch (`GET /api/settings`) supplies all metadata. Zero duplicate settings API requests.
- **CMS Mutation Test**: Temporarily modified `global_seo_title` to `"SRJ Global Technologies | Custom AI & Software Innovation"` via Admin API (`PUT /api/settings/bulk`). Verified public `GET /api/settings` reflected the update. Restored original title.
- **Security Check**: Leaked keys count = 0.

---

---

## Final Site Settings Frontend Ownership Audit
- **Status**: AUDIT COMPLETE (100% PASSED)
- **Statement**: Final frontend Site Settings ownership audit passed with no remaining required global Site Settings migrations.

### 1. Comprehensive Frontend Search & Classification Results

| Search Pattern | Occurrences Found | Classification | Details & Locations |
|---|---|---|---|
| `SRJ Global Technologies` / `SRJ Global` | 42 | **Category A/B**: 14 (Migrated/Context Fallbacks)<br>**Category C**: 18 (Page-specific SEO, Blog Author, Journey)<br>**Category D**: 10 (About, Careers, Recognitions body text) | - `Navbar.jsx`, `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx`, `SEO.jsx` (Migrated via `useSiteSettings()`) <br>- `AboutHero.jsx`, `RecognizedBySection.jsx`, `Careers.jsx` (Static body copy)<br>- `App.jsx`, `Blog.jsx`, `ServicesPage.jsx` (Route-specific SEO props) |
| `srjglobaltechnology@gmail.com` | 4 | **Category B**: 4 (Safe `getSetting()` fallback parameters) | `Contact.jsx`, `Footer.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `+91 99904 30305` | 4 | **Category B**: 4 (Safe `getSetting()` fallback parameters) | `Contact.jsx`, `Footer.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `+91 92667 06599` | 4 | **Category B**: 4 (Safe `getSetting()` fallback parameters) | `Contact.jsx`, `Footer.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `C-1101` / `Urbtech Trade Center` | 7 | **Category B**: 7 (Safe `getSetting()` fallback parameters) | `Contact.jsx`, `Footer.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` |
| `https://srjglobaltechnology.com` | 11 | **Category A/B**: 4 (SEO canonical default)<br>**Category C**: 7 (Route-specific SEO props) | `SEO.jsx` (Migrated default), `App.jsx`, `ServicesPage.jsx`, `BlogDetail.jsx`, etc. |
| `maps.google.com` / `output=embed` | 3 | **Category A/B**: 3 (Map URL & iframe fallback parameters) | `Contact.jsx`, `Footer.jsx` |
| `social_*.com` (Instagram, Facebook, etc.) | 12 | **Category A/B**: 6 (Migrated in `Footer.jsx`) <br>**Category F**: 6 (Docstrings & Admin Manager keys) | `Footer.jsx` social icon array |
| `business_hours` | 0 in public UI | **Category B/D**: Admin-managed setting | Seeded in DB, editable in Admin UI, stored in `SiteSettingsContext`. Intentionally unused in public layout. |

### 2. Complete 26-Setting Ownership Matrix

| # | Setting Key | Group | Database (`site_settings`) | Backend API | Admin UI | SiteSettingsContext | Frontend Consumer Component(s) | Ownership Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `company_name` | `identity` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Text Input | `settings.company_name` | `Navbar.jsx`, `Footer.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx`, `SEO.jsx` | Fully Owned |
| 2 | `brand_tagline` | `identity` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Text Input | `settings.brand_tagline` | `Footer.jsx` | Fully Owned |
| 3 | `logo_url` | `identity` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input + Preview | `settings.logo_url` | `Navbar.jsx`, `Footer.jsx` | Fully Owned |
| 4 | `favicon_url` | `identity` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input + Preview | `settings.favicon_url` | `SEO.jsx` (runtime link mutation) | Fully Owned |
| 5 | `canonical_url` | `identity` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.canonical_url` | `SEO.jsx` (`<link rel="canonical">`) | Fully Owned |
| 6 | `contact_email` | `contact` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Email Input | `settings.contact_email` | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | Fully Owned |
| 7 | `contact_phone` | `contact` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Tel Input | `settings.contact_phone` | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | Fully Owned |
| 8 | `whatsapp_phone` | `contact` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Tel Input | `settings.whatsapp_phone` | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | Fully Owned |
| 9 | `office_address` | `contact` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Textarea | `settings.office_address` | `Footer.jsx`, `Contact.jsx`, `PrivacyPolicy.jsx`, `TermsConditions.jsx` | Fully Owned |
| 10 | `google_maps_url` | `contact` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.google_maps_url` | `Footer.jsx`, `Contact.jsx` | Fully Owned |
| 11 | `maps_iframe_url` | `contact` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.maps_iframe_url` | `Contact.jsx` (`<iframe src>`) | Fully Owned |
| 12 | `social_instagram` | `social` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.social_instagram` | `Footer.jsx` | Fully Owned |
| 13 | `social_pinterest` | `social` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.social_pinterest` | `Footer.jsx` | Fully Owned |
| 14 | `social_youtube` | `social` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.social_youtube` | `Footer.jsx` | Fully Owned |
| 15 | `social_facebook` | `social` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.social_facebook` | `Footer.jsx` | Fully Owned |
| 16 | `social_twitter` | `social` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.social_twitter` | `Footer.jsx` | Fully Owned |
| 17 | `social_linkedin` | `social` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.social_linkedin` | `Footer.jsx` | Fully Owned |
| 18 | `footer_description` | `footer` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Textarea | `settings.footer_description` | `Footer.jsx` | Fully Owned |
| 19 | `footer_copyright` | `footer` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Text Input | `settings.footer_copyright` | `Footer.jsx` | Fully Owned |
| 20 | `google_review_url` | `footer` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input | `settings.google_review_url` | `Footer.jsx` | Fully Owned |
| 21 | `global_seo_title` | `seo` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Text Input | `settings.global_seo_title` | `SEO.jsx` | Fully Owned |
| 22 | `global_seo_description` | `seo` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Textarea | `settings.global_seo_description` | `SEO.jsx` | Fully Owned |
| 23 | `global_seo_keywords` | `seo` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Text Input | `settings.global_seo_keywords` | `SEO.jsx` | Fully Owned |
| 24 | `global_og_image` | `seo` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | URL Input + Preview | `settings.global_og_image` | `SEO.jsx` | Fully Owned |
| 25 | `response_sla` | `business` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Text Input | `settings.response_sla` | `Contact.jsx` | Fully Owned |
| 26 | `business_hours` | `business` | Seeded | `GET /api/settings`, `PUT /api/settings/bulk` | Text Input | `settings.business_hours` | Intentionally admin-managed (currently unused in public UI layout) | Fully Owned |

### 3. Duplicate API Request Check
- **`SiteSettingsContext`**: Executes the single public fetch `api.get('/settings')` on initial mount.
- **`SiteSettingsManager`**: Executes protected admin requests `api.get('/settings/admin')` and `api.put('/settings/bulk')`.
- **Public Components**: Consume state via `useSiteSettings()`. Zero duplicate direct settings API calls exist in public components.

### 4. Fallback Audit
- **SiteSettingsContext**: Initializes with `settings: null` (does NOT duplicate a hardcoded settings dictionary into Context).
- **Component Fallbacks**: Safe string parameters passed to `getSetting(key, fallback)` (e.g. `getSetting('contact_email', 'srjglobaltechnology@gmail.com')`) prevent render crashes while settings load or if API is unreachable.

### 5. SEO & Metadata Verification
- **Page-specific Precedence**: Explicit page props override global defaults (`title`, `description`, `keywords`, `image`, `url`).
- **Global Defaults**: `global_seo_title`, `global_seo_description`, `global_seo_keywords`, and `global_og_image` automatically apply when page props are omitted.
- **Canonical URL**: `resolveCanonicalUrl(url, canonical_url)` strips trailing slashes, handles relative routes, and avoids malformed URLs.
- **Favicon**: In-place mutation of `<link rel="icon">` prevents duplicate links on re-renders.
- **`index.html`**: Retains static fallback tags for FCP prior to JS execution.

### 6. Production Build Result
- Executed `cd frontend && npm run build` -> **0 build errors** (built in 1.73s).
- All 26 settings are 100% verified across database, backend API, admin UI, context, and frontend consumers.
