# SRJ Global Website & CMS — Technical Documentation

## 1. System Overview

The SRJ Global Website is a content-driven corporate web application featuring a integrated Content Management System (CMS). The platform serves public marketing pages, technology service catalogs, portfolio case studies, industry solution guides, and articles, while providing an administrative control panel for content operations and system management.

The system is designed with a decoupled architecture: a Single Page Application (SPA) frontend developed in React and a RESTful API backend powered by Node.js, Express.js, and MySQL.

---

## 2. Architecture

```
                                  ┌─────────────────────────────┐
                                  │      Client Web Browser     │
                                  └──────────────┬──────────────┘
                                                 │
                                                 │ HTTPS / JSON API
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Express API Gateway                                       │
├───────────────────┬──────────────────┬──────────────────────┬───────────────────────────────┤
│ Auth & Security   │ Input Validators │  Route Controllers   │ Static Media Middleware       │
│ (JWT & RBAC)      │ (express-val)    │  (CMS & Public)      │ (/uploads)                    │
└─────────┬─────────┴────────┬─────────┴──────────┬───────────┴──────────────┬────────────────┘
          │                  │                    │                          │
          └──────────────────┼────────────────────┘                          │
                             ▼                                               ▼
              ┌─────────────────────────────┐                 ┌─────────────────────────────┐
              │    MySQL Database Engine    │                 │   Local Media Directory     │
              │   (srj_db Relational DB)    │                 │   (backend/public/uploads)  │
              └─────────────────────────────┘                 └─────────────────────────────┘
```

The system follows a standard Model-View-Controller (MVC) separation pattern:

- **Frontend (View)**: Renders public marketing interfaces and administrative dashboards. Communicates asynchronously with the backend via JSON HTTP APIs.
- **Backend (Controller & Logic)**: Executes authentication, role authorization, request validation, business rules, and error handling.
- **Database (Model / Persistence)**: Stores content entities, administrative configurations, inquiry records, and user authentication tables.

---

## 3. Technology Stack

| Layer | Technology | Primary Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 / Vite | Single Page Application framework and build tool |
| **Styling** | Tailwind CSS / Vanilla CSS | Design tokens, responsive layouts, glassmorphism UI |
| **Icons & Media** | Lucide React | Visual icons for UI components and admin controls |
| **Animations** | GSAP / Framer Motion | Smooth page transitions and dynamic visual effects |
| **HTTP Client** | Axios | Configured API instance with token authorization headers |
| **Backend Runtime** | Node.js | Asynchronous JavaScript backend execution engine |
| **Web Framework** | Express.js | HTTP server, middleware routing, and RESTful API endpoints |
| **Database** | MySQL 8.0+ | Relational data store (`mysql2/promise` pool connection) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | Stateless token authentication |
| **Password Hashing** | `bcryptjs` | Salted password hashing (cost factor 10) |
| **Validation** | `express-validator` | Request payload sanitization and type enforcement |
| **Rate Limiting** | `express-rate-limit` | Auth route brute-force protection |
| **File Uploads** | `multer` | File multipart handling for media uploads |

---

## 4. CMS Architecture

The Content Management System operates via a unidirectional flow:

```
[ Admin User ]
     │
     ▼
[ React Admin Panel (AdminDashboard.jsx) ]
     │
     ▼  Protected HTTP Request (Bearer Token)
[ Express Security Middleware (verifyToken + isAdmin / isSuperAdmin) ]
     │
     ▼  Validation Layer (express-validator)
[ Route Handler / Controller Logic ]
     │
     ▼  Parametrized SQL Statement
[ MySQL Database / Media Storage ]
     │
     ▼  JSON Response
[ Public API Endpoint ]
     │
     ▼
[ Public React Component (with dynamic fallbacks) ]
```

1. **Admin Panel**: Authenticated interface containing dynamic manager views (`SiteSettingsManager`, `NavigationManager`, `PartnerLogoManager`, `ProcessManager`, `CompanyStatsManager`, `TrustPointsManager`, `AdminUserManager`, etc.).
2. **Protected API Layer**: Endpoint routes secured by `verifyToken` and `isAdmin`/`isSuperAdmin` middleware checking JWT signatures.
3. **Validation & Authorization**: Inputs are sanitized by `express-validator` before passing to controller logic.
4. **Data Persistence**: Content changes are stored in MySQL tables or uploaded to the server file directory (`backend/public/uploads/`).
5. **Public API**: Exposes cached or database-fetched endpoints (`/api/settings`, `/api/navigation`, `/api/services`, `/api/blogs`, etc.).
6. **Public Frontend Render**: Public components request content dynamically and render fallback defaults if database entries are missing.

---

## 5. CMS Modules

The platform implements content management for the following entities:

| Module | Administrative View | Backend Endpoints | Managed Attributes |
| :--- | :--- | :--- | :--- |
| **Site Settings** | `SiteSettingsManager.jsx` | `GET/POST /api/settings` | Branding, contact details, social links, meta defaults |
| **Navigation** | `NavigationManager.jsx` | `/api/navigation` (CRUD) | Header and footer link labels, URLs, locations, sort order |
| **Partner Logos** | `PartnerLogoManager.jsx` | `/api/partner-logos` (CRUD) | Company name, logo image URL, website link, active status |
| **Process Steps** | `ProcessManager.jsx` | `/api/process-steps` (CRUD) | Step number, title, description, active status |
| **Company Stats** | `CompanyStatsManager.jsx` | `/api/company-stats` (CRUD) | Stat label, numeric value, suffix, sort order, active status |
| **Trust Points** | `TrustPointsManager.jsx` | `/api/trust-points` (CRUD) | Metric title, subtitle, icon, sort order |
| **Services** | Admin Dashboard Services | `/api/services` (CRUD) | Title, short/full description, category, icon, image, pricing |
| **Blogs** | Admin Dashboard Blogs | `/api/blogs` (CRUD) | Title, description, content, author, category, image, active status |
| **FAQs** | Admin Dashboard FAQs | `/api/faqs` (CRUD) | Question, answer, category, sort order, active status |
| **Testimonials** | Admin Dashboard Testimonials | `/api/testimonials` (CRUD) | Client quote, author name, role, company, rating, active status |
| **Portfolio** | Admin Dashboard Portfolio | `/api/portfolio` (CRUD) | Project title, category, description, tags, project URL, image |
| **Team Members** | Admin Dashboard Team | `/api/team` (CRUD) | Name, role, bio, profile image, social links, active status |
| **Inquiries** | Admin Inquiries View | `GET /api/contact`, `/api/plans` | Lead submissions, pricing inquiry details, status tracking |
| **User Management** | `AdminUserManager.jsx` | `/api/auth/admins` (CRUD) | Admin users list, role assignment, account activation, reset password |

---

## 6. Data Ownership & Database Schema

All system data is held in the `srj_db` relational MySQL database.

### Primary Tables

- `users`: Contains system user credentials, roles (`user`, `admin`, `super_admin`), activation state (`is_active`), and password reset token hashes (`reset_password_token`, `reset_password_expires`).
- `site_settings`: Key-value configuration pairs categorized by setting groups (`general`, `hero`, `services`, `seo`, etc.).
- `navigation_items`: Public site navigation link configurations.
- `partner_logos`: Client and partner brand logo entries.
- `process_steps`: Workflow and delivery methodology steps.
- `company_stats`: Quantifiable metric entries displayed across public pages.
- `trust_points`: Metric and value proposition cards.
- `services`: Detailed service offerings and categorization.
- `blogs`: Published articles and news content.
- `faqs`: Question and answer entries organized by categories.
- `testimonials`: Client feedback and review entries.
- `portfolio`: Case study and project portfolio entries.
- `team_members`: Team member profiles and bio information.
- `contact_inquiries`: Contact form submission records.
- `pricing_inquiries`: Plan and custom service quote inquiry submissions.
- `subscribers`: Newsletter email subscription registrations.

---

## 7. API Architecture

The backend exposes JSON RESTful endpoints mounted under the `/api` route prefix.

### Public Endpoints (Read-Only & Submissions)
- `GET /api/settings`: Retrieves site settings grouped by category.
- `GET /api/navigation`: Retrieves header and footer navigation links.
- `GET /api/partner-logos`: Retrieves active partner logos.
- `GET /api/process-steps`: Retrieves active methodology steps.
- `GET /api/company-stats`: Retrieves company statistics.
- `GET /api/trust-points`: Retrieves trust indicators.
- `GET /api/services`: Retrieves service offerings catalog.
- `GET /api/services/:id`: Retrieves detailed service payload.
- `GET /api/blogs`: Retrieves published blog articles with pagination/filtering.
- `GET /api/blogs/:id`: Retrieves article details.
- `GET /api/faqs`: Retrieves active FAQ list.
- `GET /api/sitemap.xml`: Dynamically generated sitemap XML.
- `POST /api/contact`: Form submission for contact inquiries.
- `POST /api/plans`: Submission for plan inquiries.
- `POST /api/subscribe`: Newsletter subscription.

### Administrative & Security Endpoints (Protected)
- `POST /api/auth/login`: Public login for administrative users.
- `POST /api/auth/forgot-password`: Password reset token request (anti-enumeration response).
- `POST /api/auth/reset-password`: Validates hashed token and updates password.
- `GET /api/auth/admins`: Super Admin endpoint listing administrative accounts.
- `POST /api/auth/create-admin`: Super Admin endpoint to create new `admin` or `super_admin`.
- `PUT /api/auth/admins/:id/role`: Super Admin endpoint to change account roles.
- `PUT /api/auth/admins/:id/toggle`: Super Admin endpoint to activate/deactivate accounts.
- `DELETE /api/auth/admins/:id`: Super Admin endpoint to remove accounts.
- `POST /api/settings/bulk`: Bulk settings key-value updater.

---

## 8. Authentication & Authorization

Authentication is stateless and uses JSON Web Tokens (JWT) transmitted via `Authorization: Bearer <token>` HTTP headers.

### Three-Tier Role-Based Access Control (RBAC)

1. **`USER`**:
   - Granted upon public registration (`POST /api/auth/register`).
   - Standard access rights to public features. Cannot access administrative endpoints.
2. **`ADMIN`**:
   - Access to standard administrative CMS management features (blogs, services, site settings, FAQs, inquiries, team, portfolio).
   - Denied access to administrative account management endpoints (`/api/auth/admins`).
3. **`SUPER_ADMIN`**:
   - Full administrative management rights.
   - Exclusive access to User Management APIs and UI panel.
   - Protected by system guards: Cannot delete or deactivate the sole remaining active `super_admin` account.

### Simultaneous Independent Admin Sessions

Because authentication is stateless via signed JWT tokens, multiple administrative users (e.g., Admin A and Admin B) can log in simultaneously from different browsers or locations without session collisions or overwriting each other's authentication state.

### Password Recovery & Security Mechanics

1. **Anti-User Enumeration**: Requesting a password reset (`POST /api/auth/forgot-password`) returns the identical generic response message regardless of whether the submitted email address exists in the system:
   `"If an account exists, reset instructions have been sent."`
2. **SHA-256 Token Hashing**: Password reset tokens generated during recovery requests are transformed via SHA-256 before database storage (`reset_password_token`). Plaintext tokens are never stored in the database.
3. **Token Invalidation**: Reset tokens carry an expiration timestamp (`reset_password_expires`). Upon password reset completion, tokens are invalidated.
4. **Super Admin Manual Override**: Super Admins can manually set a new password for any administrative account via `POST /api/auth/reset-admin-password`.

---

## 9. Public Website & Admin Panel

### Public Website
The public application is rendered dynamically via React routes:
- `/` (Home): Features dynamic hero branding, partner logos, service previews, process steps, statistics, testimonials, and FAQs.
- `/services` & `/services/:id`: Service catalog and service detail pages.
- `/pricing`: Flexible SaaS-style investment tiers and inquiry submission form.
- `/blog` & `/blog/:id`: Published article listing and detail reader.
- `/about`, `/careers`, `/contact`: Corporate information, job openings, and contact capture.

### Admin Panel
Accessible at `/admin/login` and `/admin/dashboard`:
- Secured via client-side token verification and API middleware guards.
- Features real-time state synchronization, notification alerts, modal forms, and tabbed management panels.

---

## 10. SEO / AEO / GEO Implementation

### Search Engine Optimization (SEO)
- **Dynamic Title & Meta Management**: Handled per page via the `SEO.jsx` component using React Helmet to inject page titles, meta descriptions, and canonical link tags.
- **Dynamic XML Sitemap**: Generated on demand at `/sitemap.xml` by querying active database records for services and articles.
- **Semantic Markup**: HTML5 structural elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) are used throughout public pages.

### Answer Engine Optimization (AEO)
- **Structured JSON-LD Schema Markup**:
  - `Organization` Schema: Identifies corporate entity name, logo, URL, and contact points.
  - `FAQPage` Schema: Injects Q&A pairs on public FAQ sections for direct ingestion by search and answer engines.
  - `Article` / `BlogPosting` Schema: Formats article metadata, publication timestamps, and author information.
  - `Service` Schema: Structure service definitions and descriptions.

### Generative & Geo-Location Optimization (GEO)
- **Geo Metadata Tags**: Regional metadata tags (`geo.region`, `geo.placename`, `geo.position`, `ICBM`) configure location context for local search engine relevance.
- **LocalBusiness Schema**: Injects geographical coordinates and address data into structured schemas.

---

## 11. Media Handling

- **File Upload Processing**: Multipart form uploads are processed on the backend using `multer`.
- **Static Asset Serving**: Uploaded media files are stored in the server directory `backend/public/uploads/` and served publicly via Express static middleware at `/uploads/<filename>`.
- **Database References**: Image and icon references are stored in database records as relative path strings or asset URLs.

---

## 12. External Integrations

- **Twilio SMS / Communication**: Integration configuration supported via environment variables for SMS alerts and communications.
- **Groq AI Integration**: Backend support for Groq AI model API interactions configured via environment variables.

---

## 13. Security Controls

### Implemented & Verified Controls

1. **SQL Injection Prevention**: 100% of database queries use parametrized SQL statements via `mysql2/promise`.
2. **Stateless JWT Verification**: Protected endpoints verify JWT signature and expiration on every request.
3. **Input Sanitization**: Payload fields are sanitized and validated using `express-validator`.
4. **Anti-User Enumeration**: Password reset requests emit constant-time generic responses.
5. **SHA-256 Token Storage**: Password reset tokens are stored as cryptographic hashes.
6. **Last Active Super Admin Guard**: Application logic prevents deletion or deactivation of the final active Super Admin account.
7. **Rate Limiting**: Brute-force protection applied to sensitive authentication routes (`loginLimiter`, `registerLimiter`).
8. **Configurable CORS**: CORS middleware configured to restrict API access to explicitly allowed origin domains.

### Staging & Production Hardening Items

- Enforce HTTPS SSL termination via Nginx reverse proxy.
- Set up automated database backup schedules.
- Configure Web Application Firewall (WAF) rules at DNS/CDN layer.

---

## 14. Testing & Validation

System validation includes:

1. **Automated Integration & Security Tests**: Automated script verification covering public registration role restrictions, anti-user enumeration responses, SHA-256 token hashing, password reset verification, RBAC endpoint authorization matrices, and Super Admin protection guards.
2. **Frontend Production Build Compilation**: Compilation verification via `vite build` ensuring zero syntax, import, or bundle build errors.

---

## 15. Production Readiness

The codebase is prepared for staging and production deployment:

- **Build Pipeline**: Executing `npm run build` in `frontend` produces a minified, chunk-split static bundle in `frontend/dist`.
- **Environment Isolation**: Database credentials, secrets, and API domain configurations are decoupled into `.env` environment files.
- **Database Bootstrapping**: Running `node init-db.js` automates database schema setup and initial Super Admin creation.

---

## 16. Maintenance & Development Conventions

- **Code Style**: Standard JavaScript ES6+ conventions across frontend and backend codebase.
- **Database Migrations**: Additions to table schemas should be recorded in `backend/schema.sql`.
- **API Error Handling**: All asynchronous controller logic uses `asyncHandler` wrappers with central `AppError` exception management.
- **Environment Isolation**: Never commit `.env` files or private credentials to version control.
