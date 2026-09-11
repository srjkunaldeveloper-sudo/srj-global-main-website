# Navigation CMS — Step 0: Discovery & Ownership Audit

> **Read-Only Audit**: This document establishes the technical discovery, data ownership mapping, database schema design, and migration architecture for **Navigation CMS**. Zero application source code, database tables, or routes were created or modified in this step.

---

## A. Executive Summary

The **Navigation CMS** module will centralize the management of header navigation links, mega-menu submenus (Services & Pricing dropdowns), footer quick links, and footer legal links into a dynamic MySQL-backed database structure.

Currently, navigation links, mega-menu structures, and footer link lists are hardcoded inside React components (`Navbar.jsx`, `Footer.jsx`, `servicesData.js`). This discovery audit analyzes all existing navigation code locations, defines data ownership boundaries (separating Navigation from Site Settings and Feature CMS), designs the `navigation_items` database table model, and details the frontend/admin migration plan.

---

## B. Current Navbar Inventory

### 1. Header Primary Links (`navLinks`)
Located in [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) (L23–L31):

| Order | Label | Route / URL | Behavior / Type | Trigger Dropdown |
|---|---|---|---|---|
| 1 | `Home` | `/` | Internal Route | None |
| 2 | `Services` | `/services` | Internal Route | Mega-Menu Dropdown (`Services`) |
| 3 | `Pricing` | `/pricing` | Internal Route | Mega-Menu Dropdown (`Pricing`) |
| 4 | `Collaboration` | `/collaboration` | Internal Route | None |
| 5 | `Industries` | `/industries` | Internal Route | None |
| 6 | `About Us` | `/about` | Internal Route | None |
| 7 | `Contact Us` | `/contact` | Internal Route | None |

### 2. Services Mega-Menu Dropdown Items
Triggered when hovering over `Services` (or toggled on mobile).
Located in [`Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) (L185–L211) & [`servicesData.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/data/servicesData.js):

| Item Label | Route / Target Anchor | Icon | Description / Source |
|---|---|---|---|
| `Game Development` | `/services#game-development` | `Rocket` | Featured category link |
| `Software Development` | `/services#software-development` | `Code` | `serviceCategories` array |
| `Mobile App Development` | `/services#mobile-app-development` | `Smartphone` | `serviceCategories` array |
| `UI/UX & Product Design` | `/services#ui-ux-designing` | `PenTool` | `serviceCategories` array |
| `AI, ML & Automation` | `/services#ai-automation` | `Cpu` | `serviceCategories` array |
| `Cloud & DevOps Solutions` | `/services#cloud-computing` | `Cloud` | `serviceCategories` array |
| `Data Engineering & Analytics` | `/services#data-analytics` | `Database` | `serviceCategories` array |
| `Cyber Security & Compliance` | `/services#cyber-security` | `Shield` | `serviceCategories` array |
| `Startup Launch & Advisory` | `/services#startup-tips` | `Rocket` | `serviceCategories` array |

### 3. Pricing Mega-Menu Dropdown Items
Triggered when hovering over `Pricing` (or toggled on mobile).
Located in [`Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) (L90–L94, L214–L234):

| Plan Name | Target Route | Icon | Description Subtitle |
|---|---|---|---|
| `Base Architecture` | `/pricing` | `Code` | "Perfect for startups and small business websites." |
| `Premium Experience` | `/pricing` | `PenTool` | "Advanced features, integrations, and performance." |
| `Enterprise Suite` | `/pricing` | `Database` | "Custom tailored platforms for massive scale." |

### 4. Non-Navigation Header Controls & Actions
- **Brand Logo & Name**: Links to `/` (also includes secret triple-click handler navigating to `/admin/login`). Managed by **Site Settings** (`company_name`, `logo_url`).
- **Mobile Menu Toggle**: UI state button (`isMobileMenuOpen`) toggling lucide icons `Menu` / `X`.
- **Mobile Search Input**: Static search input box (present in mobile drawer UI).

---

## C. Current Footer Navigation Inventory

Located in [`frontend/src/components/Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx):

### 1. Quick Links (Navigation Column 2)
Hardcoded in `Footer.jsx` (L144–L153):

| Link Label | Target Route | Item Category |
|---|---|---|
| `Contact Us` | `/contact` | Internal Route |
| `Pricing Plans` | `/pricing` | Internal Route |
| `Blog` | `/blog` | Internal Route |
| `Careers` | `/careers` | Internal Route |
| `Collaboration` | `/collaboration` | Internal Route |

### 2. Legal Bar Links (Footer Column 4 & Bottom Bar)
Hardcoded in `Footer.jsx` (L217–L224):

| Link Label | Target Route / Href | Type |
|---|---|---|
| `Privacy Policy` | `/privacy` | Internal Route |
| `Cookies` | `#contact` | Anchor Hash Link |
| `Terms & Conditions` | `/terms` | Internal Route |

### 3. Non-Navigation Footer Items (Owned by Other Modules)
- **Brand Summary & Bio**: Owned by Site Settings (`footer_description`).
- **Social Media Links**: Owned by Site Settings (`social_*`).
- **Contact Details (Email, Phone, WhatsApp, Address, Google Maps)**: Owned by Site Settings.
- **Review Us Button**: Owned by Site Settings (`google_review_url`).
- **Copyright Statement**: Owned by Site Settings (`footer_copyright`).

---

## D. React Route Inventory

Inspected [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx):

| Route Path | Component | Access Type | Represented in Navbar | Represented in Footer |
|---|---|---|---|---|
| `/` | `Hero` (Homepage) | Public | Yes (`Home`) | No |
| `/services` | `ServicesPage` | Public | Yes (`Services`) | No |
| `/services/:id` | `ServiceDetail` | Public | No (Sub-route) | No |
| `/pricing` | `Pricing` | Public | Yes (`Pricing`) | Yes (`Pricing Plans`) |
| `/about` | `About` | Public | Yes (`About Us`) | No |
| `/collaboration` | `Collaboration` | Public | Yes (`Collaboration`) | Yes (`Collaboration`) |
| `/industries` | `Industries` | Public | Yes (`Industries`) | No |
| `/contact` | `Contact` | Public | Yes (`Contact Us`) | Yes (`Contact Us`) |
| `/blog` | `Blog` | Public | No | Yes (`Blog`) |
| `/blog/:id` | `BlogDetail` | Public | No (Sub-route) | No |
| `/careers` | `Careers` | Public | No | Yes (`Careers`) |
| `/privacy` | `PrivacyPolicy` | Public | No | Yes (`Privacy Policy`) |
| `/terms` | `TermsConditions` | Public | No | Yes (`Terms & Conditions`) |
| `/admin/login` | `AdminLogin` | Public | No (Secret logo trigger) | No |
| `/admin` | `AdminDashboard` | Protected | No | No |

---

## E. Navigation-Related Hardcoded Code Locations

1. [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx)
   - L23–L31: Hardcoded `navLinks` array.
   - L90–L94: Hardcoded `pricingPlans` array.
   - L185–L211: Mega-menu JSX rendering for `Services` dropdown items.
   - L214–L234: Mega-menu JSX rendering for `Pricing` dropdown items.
   - L259–L278: Mobile drawer nested dropdown navigation loops.

2. [`frontend/src/components/Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx)
   - L144–L153: Hardcoded "Quick Links" column `<Link>` elements.
   - L217–L224: Hardcoded Legal links bar (`Privacy Policy`, `Cookies`, `Terms & Conditions`).

3. [`frontend/src/data/servicesData.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/data/servicesData.js)
   - L81–L270: `serviceCategories` array used by Navbar to build service category sub-links.

---

## F. Navigation vs CTA vs Content Ownership Classification

To avoid scope creep or misclassifying normal page elements, all link-like elements across the frontend are classified into 7 distinct ownership categories:

| Category | Description | Ownership Domain | Managed By |
|---|---|---|---|
| **Class A** | Primary Header Navigation & Mega-Menu Submenus | **Navigation CMS** | `navigation_items` DB table |
| **Class B** | Footer Quick Links & Footer Legal Links | **Navigation CMS** | `navigation_items` DB table |
| **Class C** | CTA Action Buttons (e.g., Hero "Get Started", Section "Book Consultation") | **Hardcoded Component Logic / Feature CMS** | Page/Section components |
| **Class D** | Content / Editorial Links (e.g., Blog post links, Portfolio detail buttons) | **Feature CMS** | Blog / Portfolio CMS |
| **Class E** | External Integrations & Map Links (e.g., Google Maps URL, Review link) | **Site Settings** | `site_settings` DB table |
| **Class F** | Social Media Profile Links | **Site Settings** | `site_settings` DB table |
| **Class G** | System Routes (e.g. `/admin/login`, `/admin`) | **Application Routing** | React Router (`App.jsx`) |

---

## G. Site Settings Boundary

The boundary between **Site Settings CMS** and **Navigation CMS** is strictly defined:

- **Owned by Site Settings**:
  - Global branding (`company_name`, `logo_url`, `brand_tagline`).
  - Contact details (`contact_email`, `contact_phone`, `whatsapp_phone`, `office_address`, `google_maps_url`, `maps_iframe_url`).
  - Social media URLs (`social_instagram`, `social_facebook`, `social_linkedin`, etc.).
  - Global SEO & copyright strings (`global_seo_title`, `footer_copyright`, `google_review_url`).

- **Owned by Navigation CMS**:
  - The list, order, hierarchy, and visibility of menu items displayed in Header and Footer.
  - Link labels (e.g., "Services", "Pricing Plans", "Privacy Policy").
  - Target URLs / routes (`/`, `/services`, `/contact`, `/services#game-development`).
  - Menu grouping (`header`, `footer_quick`, `footer_legal`).
  - Parent-child menu relationships (submenus / mega-menu children).
  - Open target behavior (`_self` vs `_blank`).

---

## H. Proposed Navigation CMS Data Model

### 1. Database Table: `navigation_items`
```sql
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
  CONSTRAINT `fk_navigation_parent` FOREIGN KEY (`parent_id`) REFERENCES `navigation_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 2. Field Justification Matrix

| Field | Type | Required | Rationale |
|---|---|---|---|
| `id` | `INT AUTO_INCREMENT` | Yes | Primary Key for item identity and parent-child referencing. |
| `group_location` | `ENUM` | Yes | Distinguishes whether an item belongs to Header, Footer Quick Links, or Footer Legal Bar. |
| `parent_id` | `INT NULL` | Yes | Enables 2-level dropdown / mega-menu submenus (e.g., `Services` parent -> `Game Development` child). |
| `label` | `VARCHAR(100)` | Yes | Display text of the link. |
| `url` | `VARCHAR(255)` | Yes | Destination route (`/services`), anchor hash (`/services#game-development`), or URL. |
| `item_type` | `ENUM` | Yes | Safely instructs frontend whether to render React Router `<Link>` (`route`), anchor smooth scroll (`hash`), or native `<a>` (`external`). |
| `target` | `ENUM` | Yes | Specifies `_self` (same window) or `_blank` (new tab). |
| `icon_name` | `VARCHAR(50)` | Optional | Icon key for mega-menus (e.g., `'Code'`, `'Rocket'`, `'Smartphone'`). |
| `description` | `VARCHAR(255)` | Optional | Subtitle description for rich mega-menu items (e.g. Pricing plan subtitles). |
| `sort_order` | `INT` | Yes | Explicit display order sorting in Header/Footer. |
| `is_active` | `TINYINT(1)` | Yes | Allows admins to draft or hide links without deleting them. |

---

## I. Admin Navigation Manager Requirements

The upcoming **`NavigationManager.jsx`** component will fit into `AdminDashboard.jsx` (`activeTab === 'navigation'`):

1. **Tabbed / Grouped View**:
   - Tab 1: **Header Navigation** (displays tree-view of primary links and their nested submenus).
   - Tab 2: **Footer Quick Links**.
   - Tab 3: **Footer Legal Links**.
2. **Item Management Operations**:
   - **Create / Edit Item**: Modal form supporting Label, Location, Parent Item (filtered to same location & top-level only), URL, Link Type (`route`/`hash`/`external`), Icon Key, Subtitle Description, Target (`_self`/`_blank`), Sort Order, and Active Toggle.
   - **Reordering**: Sort Order input or Up/Down position adjusters.
   - **Delete Item**: Deletes link (and cascades children if parent is removed).
   - **Active Toggle**: Instant visibility toggle switch.
3. **Admin Validation Rules**:
   - Label is required (1–100 chars).
   - URL is required.
   - Prevent selecting an item as its own parent (circular dependency check).

---

## J. Frontend Migration Map

| Component | Target File | Migration Action |
|---|---|---|
| **Navigation Context** | `[NEW]` [`frontend/src/context/NavigationContext.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/context/NavigationContext.jsx) | Centralized state provider calling `GET /api/navigation` on mount. Exposes `{ headerNav, footerQuickNav, footerLegalNav, loading }`. |
| **App Wrapper** | [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx) | Wrap application with `<NavigationProvider>`. |
| **Navbar Component** | [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) | Consume `useNavigation()` to dynamically render top-level links and submenus for both Desktop and Mobile drawer. |
| **Footer Component** | [`frontend/src/components/Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx) | Consume `useNavigation()` to dynamically render Quick Links and Legal Bar links. |
| **Admin Dashboard** | [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx) | Add "Navigation" sidebar item (`activeTab === 'navigation'`). |
| **Admin Manager** | `[NEW]` [`frontend/src/components/admin/NavigationManager.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/NavigationManager.jsx) | Admin UI for managing navigation items. |

---

## K. Fallback & Data Ownership Policy

### Fallback Decision: **Minimal Emergency In-Memory Fallback**

- **Policy**: `NavigationContext.jsx` will maintain an in-memory emergency fallback array containing the current hardcoded header and footer links.
- **Reasoning**: If the database server is temporarily offline or network connection fails, rendering a completely empty Navbar or Footer would render the public website unnavigable for visitors.
- **Strict Boundary**: The emergency fallback will ONLY be used as a last resort if `GET /api/navigation` fails or returns empty data. When API data loads successfully, DB data strictly owns all navigation rendering.

---

## L. Security & Validation Requirements

1. **URL Sanitization**:
   - Reject URLs starting with `javascript:`, `data:`, or malicious schemes.
   - Require internal routes to begin with `/` or `#`.
2. **Target Security**:
   - For `target="_blank"`, automatically append `rel="noopener noreferrer"` on `<a>` elements.
3. **Admin Authorization**:
   - All `POST`, `PUT`, `DELETE` operations on `/api/navigation` require JWT Admin authentication header.
4. **Parent Circular Dependency Guard**:
   - Backend validation ensures `parent_id != id` and prevents multi-level cyclic nesting.

---

## M. Data Preservation Requirements

During implementation, the initial database seed script must preserve 100% of the existing navigation structure:

1. **Header Items**:
   - `Home` (`/`), `Services` (`/services`), `Pricing` (`/pricing`), `Collaboration` (`/collaboration`), `Industries` (`/industries`), `About Us` (`/about`), `Contact Us` (`/contact`).
2. **Services Submenu Items**:
   - `Game Development`, `Software Development`, `Mobile App Development`, `UI/UX & Product Design`, `AI, ML & Automation`, `Cloud & DevOps Solutions`, `Data Engineering & Analytics`, `Cyber Security & Compliance`, `Startup Launch & Advisory`.
3. **Pricing Submenu Items**:
   - `Base Architecture`, `Premium Experience`, `Enterprise Suite`.
4. **Footer Quick Links**:
   - `Contact Us`, `Pricing Plans`, `Blog`, `Careers`, `Collaboration`.
5. **Footer Legal Links**:
   - `Privacy Policy`, `Cookies`, `Terms & Conditions`.

---

## N. Risks & Edge Cases

1. **Hash Anchors vs React Router Links**:
   - Links like `/services#game-development` require smooth scrolling when already on `/services`. Frontend must safely inspect `item_type` (`route`, `hash`, `external`).
2. **Icon Resolution**:
   - Icons stored as string names (`'Rocket'`, `'Code'`, `'Smartphone'`) must map safely to dynamic icon renders or Lucide icon lookup tables without crashing if an unknown icon name is provided.

---

## O. Recommended Implementation Sequence

1. **Step 1: Database Implementation**: Create `navigation_items` table and seed script.
2. **Step 2: Backend API**: Implement `GET /api/navigation`, `GET /api/navigation/admin`, `POST /api/navigation`, `PUT /api/navigation/:id`, `DELETE /api/navigation/:id`.
3. **Step 3: Admin Manager UI**: Create `NavigationManager.jsx` and mount in `AdminDashboard.jsx`.
4. **Step 4: Frontend Migration**: Create `NavigationContext.jsx`, wrap `App.jsx`, migrate `Navbar.jsx` & `Footer.jsx`.
5. **Step 5: E2E Verification & Audit**: Verify build, live admin updates, mobile responsive drawer, and link targets.

---

## P. Out of Scope

- Dynamic role-based user navigation menus.
- Breadcrumb trails on inner pages.
- Multi-language menu translations (handled separately if requested).

---

## Discovery Status & Verification

```
Discovery Status:
- Code changes: 0
- DB changes: 0
- API changes: 0
- UI changes: 0
- Files created: navigation_cms_discovery_audit.md only
- Git staging: none
- Git commit: none
```

### Verification Checklist:
- `git status` confirmed: Zero application files modified or staged.
- Pre-existing deleted upload `backend/public/uploads/1788851060523-246555465.jpeg` remains untouched.
- Only the discovery audit document `navigation_cms_discovery_audit.md` was created.
