# Contact Us / Direct Inquiry CMS — Discovery & Architecture Audit Document

## 1. Overview
This document presents the full technical audit and architectural design for **Contact Us / Direct Inquiry CMS** for the SRJ Global Website project. Step 1 (Discovery & Architecture Audit) evaluates the current public Contact form, Calendly usage, backend routes and controllers, MySQL database schema (`srj_db`.`contacts`), Admin Panel inquiry management, and notification services.

---

## 2. Public Contact Us Page Audit

### Component Location & Route
- **Component File**: [`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx)
- **Rendered On**: `/contact` route and embedded `#contact` section on home/landing pages.

### Form Fields Audit
| Field Label | Field ID | State Property | Input Type | Required | Options / Default |
|---|---|---|---|---|---|
| Full Name | `name` | `formData.name` | `text` | Yes | Placeholder: `"John Doe"` |
| Email Address | `email` | `formData.email` | `email` | Yes | Placeholder: `"john@company.com"` |
| Company | `company` | `formData.company` | `text` | No | Placeholder: `"Acme Corp"` |
| Phone Number | `phone` | `formData.phone` | `tel` | Yes | Placeholder: `"+91 98765 43210"` |
| Service Required | `projectType` | `formData.projectType` | `select` | Yes | `['Web Development', 'Mobile Apps', 'AI Solutions', 'Cloud Services', 'UI/UX Design', 'DevOps']` |
| Estimated Budget | - | `formData.budget` | `button` array | No | Default: `'₹10k - ₹25k'`, Options: `['₹10k - ₹25k', '₹25k - ₹50k', '₹50k - ₹100k', '₹100k+']` |
| Project Details | `message` | `formData.message` | `textarea` | Yes | Placeholder: `"Describe your goals..."` |

### Current Submission Behavior & Critical Gap
```javascript
// Current handleSubmit in Contact.jsx
const nameParts = formData.name.trim().split(/\s+/);
const firstName = nameParts[0] || '';
const lastName = nameParts.slice(1).join(' ') || ' ';

const response = await axios.post(`${API_BASE_URL}/contact`, {
  firstName,
  lastName,
  email: formData.email,
  phone: formData.phone,
  service: formData.projectType,
  message: formData.message
});
```

#### Discovered Issues & Gaps:
1. **Omitted Fields**: `company` and `budget` are collected from the user in the form UI, but are **completely omitted from the POST request payload** sent to the API!
2. **Uncentralized Axios**: Uses raw `axios.post(`${API_BASE_URL}/contact`, ...)` instead of the centralized Axios instance (`api.js`).
3. **User Experience**: Uses browser native `alert()` popups for success/error feedback.
4. **No Loading State**: Does not disable the submit button or show a loading indicator during HTTP request execution.

---

## 3. Calendly Usage Audit

### Occurrences in Codebase
1. **Header Navigation ([`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx))**:
   - The main header navigation item `"Contact Us"` uses `<a href="https://calendly.com/srjglobaltechnology" target="_blank">`.
   - **Impact**: Clicking "Contact Us" in the header opens an external browser tab to Calendly, completely bypassing the website's own `/contact` form and database!
2. **Hero / CTA Components ([`CollabHero.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/CollabHero.jsx), [`ServicesCTA.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/services/ServicesCTA.jsx), `ServicesHero.jsx`, `PricingHero.jsx`, `PricingPage.jsx`, `AboutHero.jsx`, `IndustriesHero.jsx`, `Collaboration.jsx`)**:
   - Include an `openCalendly` helper function that redirects internally to `/#contact`.

### Assessment
Calendly is not embedded as an inline widget or iframe. Its primary usage is an external link in `Navbar.jsx`. This creates confusion by mixing meeting scheduling with direct contact inquiries.

---

## 4. Backend Architecture Audit

### Controller: [`backend/controllers/contactController.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/controllers/contactController.js)
- **`createContact`**:
  - Accepts JSON body: `{ firstName, lastName, email, phone, service, message }`.
  - Requires all 6 fields.
  - Executes SQL: `INSERT INTO contacts (first_name, last_name, email, phone, service, message) VALUES (?, ?, ?, ?, ?, ?)`.
- **`getContacts`**:
  - Requires JWT `verifyToken` + `isAdmin`.
  - Executes SQL: `SELECT * FROM contacts ORDER BY id DESC`.
- **`deleteContact`**:
  - Requires JWT `verifyToken` + `isAdmin`.
  - Executes SQL: `DELETE FROM contacts WHERE id = ?`.

### Routes: [`backend/routes/contactRoutes.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/routes/contactRoutes.js)
- `POST /api/contact` -> `contactLimiter` rate limiter + `validateCreateContact` express-validator.
- `GET /api/contact` -> `verifyToken` + `isAdmin`.
- `DELETE /api/contact/:id` -> `validateIdParam` + `verifyToken` + `isAdmin`.

### Validator: [`backend/middleware/validators.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/middleware/validators.js)
- `validateCreateContact`: checks `firstName` (2-100), `lastName` (2-100), `email` (valid email), `phone` (phone regex), `service` (max 200), `message` (10-5000).
- Does not validate or accept `company` or `budget`.

---

## 5. Database Schema Audit (`srj_db`.`contacts`)

### Table Structure
```sql
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `service` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contacts_created_at` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Table Audit Findings
- **Current Row Count**: 3 rows.
- **Missing Columns**:
  - `company` (`VARCHAR(255)` / NULLABLE) - **Missing**
  - `budget` (`VARCHAR(100)` / NULLABLE) - **Missing**
  - `status` (`VARCHAR(50)` DEFAULT `'new'`) - **Missing**
  - `updated_at` (`TIMESTAMP` ON UPDATE CURRENT_TIMESTAMP) - **Missing**

---

## 6. Admin Panel Audit ([`AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx))

### Current Contacts Tab
- **Displayed Fields**: `first_name`, `last_name`, `email`, `phone`, `service`, `message`, `created_at`.
- **Missing Features**:
  - Does NOT display `company` or `budget`.
  - Does NOT have status management (`new`, `contacted`, `in_progress`, `resolved`).
  - Does NOT have a Delete button in the UI (even though backend API `DELETE /api/contact/:id` exists).
  - Does NOT have inquiry search or filtering.

---

## 7. Notification Audit
- **WhatsApp Integration**: [`backend/routes/sendMeeting.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/routes/sendMeeting.js) contains a Twilio WhatsApp endpoint (`POST /api/send-meeting`). However, it is not invoked anywhere in `frontend/src`.
- **Email Notifications**: Zero email notification services (`nodemailer`, `sendgrid`, etc.) currently exist in `contactController.js`.

---

## 8. Current vs Proposed Architecture

### Current Architecture
```
Visitor on /contact Form -> Omits company & budget -> POST /api/contact -> Saved in contacts table -> Native alert()
Visitor clicks Navbar "Contact Us" -> Redirects to external https://calendly.com/srjglobaltechnology
```

### Proposed Direct Inquiry Architecture
```
Visitor fills Contact Form (Name, Email, Phone, Company, Service, Budget, Message)
  ↓
POST /api/contact (via centralized api.js client)
  ↓
express-validator (Validates Name, Email, Phone, Service, Message, Company, Budget)
  ↓
MySQL srj_db.contacts (Stores all fields + status = 'new')
  ↓
Inline Success / Toast Feedback on Website
  ↓
Admin Dashboard -> Contact Inquiries Tab (View, Filter, Update Status, Delete)
```

### Contact Inquiry vs Meeting Booking Distinction
1. **Contact Inquiry**: Primary website flow. Visitor sends project details/request directly to SRJ Global desk. Saved in database and managed in Admin Panel.
2. **Meeting Booking**: Secondary flow. Visitor wants an instant scheduled calendar meeting. Handled via dedicated "Book a Meeting" CTA.

#### Recommendation on Calendly:
- **Keep Calendly as an optional "Book a Meeting" CTA button** (e.g. secondary button or header action), but **update the main "Contact Us" navbar link to navigate directly to the website's `/contact` page**.
- **Rationale**: Directing header "Contact Us" to Calendly bypasses the website's own database and Admin Panel, frustrating visitors who simply want to submit an inquiry without scheduling a call immediately.

---

## 9. Comprehensive Gap Analysis

| Component | Currently Working | Gaps / Required Improvements |
|---|---|---|
| **Public Form** | UI renders Name, Email, Phone, Company, Service, Budget, Message | 1. Send `company` and `budget` in API body.<br>2. Use centralized `api` client.<br>3. Replace `alert()` with inline UI feedback.<br>4. Add submit button loading state. |
| **Backend API** | `POST /api/contact` and `GET /api/contact` endpoints exist | 1. Handle `name` / `company` / `budget`.<br>2. Support optional fields.<br>3. Add status update endpoint (`PUT /api/contact/:id/status`). |
| **Database Table** | `contacts` table exists with 8 columns | 1. Add `company VARCHAR(255)` column.<br>2. Add `budget VARCHAR(100)` column.<br>3. Add `status VARCHAR(50) DEFAULT 'new'` column.<br>4. Add `updated_at` column. |
| **Admin Panel** | Renders inquiry card list | 1. Display `company` and `budget`.<br>2. Add Delete inquiry button.<br>3. Add status badge & status toggle dropdown.<br>4. Add inquiry search filter. |
| **Navigation** | Navbar renders "Contact Us" item | Change href from external Calendly URL to internal `/contact` page route. |

---

## 10. Next Recommended Implementation Steps

1. **Step 2 — Database Schema Update**: Add `company`, `budget`, `status`, and `updated_at` columns to `contacts` table.
2. **Step 3 — Backend API Implementation**: Update `contactController.js`, `validators.js`, and add status update/delete routes.
3. **Step 4 — Admin Panel Implementation**: Enhance Admin Dashboard Contacts tab with company/budget display, status management, search, and delete button.
4. **Step 5 — Public Contact Form Integration**: Migrate `Contact.jsx` to send all fields using `api.js` with loading state and inline status alerts.
5. **Step 6 — Navigation & CTA Alignment**: Update Navbar "Contact Us" link to point to `/contact`.

---

## 11. Step 2 — Database Implementation

### Schema Migration Execution
- **Database**: `srj_db`
- **Table**: `contacts`
- **Method**: Executed safe `ALTER TABLE` query preserving existing table and all 3 historical records.

### Added Columns & Indexes
```sql
ALTER TABLE contacts
ADD COLUMN company VARCHAR(255) NULL AFTER phone,
ADD COLUMN budget VARCHAR(100) NULL AFTER service,
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'new' AFTER message,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
ADD INDEX idx_contacts_status (status);
```

### Status Lifecycle Definitions
- **`'new'`**: Default status for newly submitted contact inquiries that have not yet been processed by an administrator.
- **`'contacted'`**: Status set when an administrator has responded or reached out to the lead.
- **`'resolved'`**: Status set when the inquiry lifecycle is complete/closed.

### Migration & Verification Summary
1. **Preserved Data**: All 3 pre-existing records intact. `company` and `budget` initialized to `NULL`; `status` defaulted to `'new'`.
2. **DDL Update**: Updated [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql) with the full upgraded DDL definition.
3. **Lifecycle Test**: Created a synthetic test record, verified default status `new`, updated status `new` → `contacted` → `resolved`, verified automatic mutation of `updated_at`, deleted synthetic test record.
4. **Final DB State**: Exactly **3 records** in `contacts` table.

---

## 12. Step 3 — Backend API Implementation

### API Architecture & Endpoint Matrix
| Method | Endpoint | Access | Functionality |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submits direct contact inquiry. Accepts `firstName`, `lastName`, `email`, `phone`, `company`, `service`, `budget`, `message`. Stores `company` & `budget` into DB. Defaults `status` to `'new'`. Ignores public client status injections. |
| `GET` | `/api/contact` | Admin (`verifyToken` + `isAdmin`) | Retrieves all inquiries ordered by `created_at DESC, id DESC`. Returns `company`, `budget`, `status`, timestamps. |
| `PUT` | `/api/contact/:id/status` | Admin (`verifyToken` + `isAdmin`) | Updates inquiry lifecycle status (`'new'`, `'contacted'`, `'resolved'`). Rejects unauthorized statuses with 400. Returns updated contact. |
| `DELETE` | `/api/contact/:id` | Admin (`verifyToken` + `isAdmin`) | Deletes contact inquiry matching numeric ID. |

### Validation & Normalization
- **`firstName` & `lastName`**: Required, trimmed, 2-100 characters.
- **`email`**: Required, trimmed, valid email format, case-normalized (`normalizeEmail`).
- **`phone`**: Required, trimmed, phone pattern regex check.
- **`company`**: Optional, trimmed, max 255 characters (stored as `NULL` if omitted or empty).
- **`service`**: Required, trimmed, max 150 characters.
- **`budget`**: Optional, trimmed, max 100 characters (stored as `NULL` if omitted or empty).
- **`message`**: Required, trimmed, 10-5000 characters.
- **`status`**: Required for `PUT /:id/status`, must be one of `['new', 'contacted', 'resolved']`.

### Security, Rate Limiting & Notifications
- **Public Rate Limiter**: `contactLimiter` configured with 5 submissions per 15-minute window for production abuse prevention.
- **Error Handling**: Uses `AppError` and `asyncHandler` wrappers to prevent database exception leakage or raw stack trace exposure.
- **Notifications**: Email/WhatsApp triggers deliberately deferred; system relies on persistent database storage and Admin Panel visibility.

---

## 13. Step 4 — Admin Panel Implementation

### Admin UI Integration Overview
- **Component File**: [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx)
- **Active Tab**: `contacts`
- **APIs Consumed**:
  - `GET /api/contact` (Admin list retrieval)
  - `PUT /api/contact/:id/status` (Lifecycle status updates)
  - `DELETE /api/contact/:id` (Inquiry deletion)

### Key Features Delivered
1. **Statistics Header**: Real-time cards for Total Inquiries, New (`'new'`), Contacted (`'contacted'`), and Resolved (`'resolved'`).
2. **Filter & Search Bar**: Case-insensitive client-side search (Name, Email, Phone, Company, Service) combined with Status filtering (`All`, `New`, `Contacted`, `Resolved`).
3. **Data Table & Detail View**: Displays Name, Email, Phone, Company, Service, Budget, Message snippet, Status badge/selector, Timestamps, and Actions.
4. **Status Management**: Dropdown updates status dynamically via `PUT /api/contact/:id/status` without requiring page reloads.
5. **Delete Flow**: Confirmation prompt before invoking `DELETE /api/contact/:id`.
6. **Inquiry Detail Modal**: Full modal for viewing complete inquiry text with preserved formatting.
7. **Build & Data Integrity**: Passed `npm run build` with 0 errors. Database verified at **exactly 3 rows**.

---

## 14. Step 5 — Public Contact Form Integration

### Public Form Integration Overview
- **Component File**: [`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx)
- **API Consumed**: `POST /api/contact` via centralized Axios client (`api.js`)
- **Payload Transmitted**: `{ firstName, lastName, email, phone, company, service, budget, message }`
- **Key Enhancements**:
  1. Replaced uncentralized `axios` with `api.js`.
  2. Implemented `loading` state to disable submit button and display `"Sending Inquiry..."`.
  3. Implemented inline status alert banner for success/error feedback.
  4. Preserved `company` and `budget` fields and saved them into database.
  5. Preserved 100% of existing UI design, styling, and layout.
  6. E2E verified with automated tests; database maintained at **exactly 3 rows**.

---

## 15. Step 6 — Contact CTA / Calendly Separation Audit

### Discovery Summary
- **Main Navigation (`Navbar.jsx`)**: The `Contact Us` link in desktop navigation and mobile drawer previously redirected externally to `https://calendly.com/srjglobaltechnology`. It has been updated to route internally to `/contact` using `<Link to="/contact">`.
- **Hero & Section CTAs**: Components using `openCalendly` (`CollabHero`, `ServicesHero`, `ServicesCTA`, `PricingHero`, `PricingPage`, `IndustriesHero`, `AboutHero`, `Collaboration`, `GameDevelopment`) route to `/#contact` or `/contact` for direct inquiry submission.
- **Footer Navigation (`Footer.jsx`)**: The `Contact Us` link already correctly targets `/contact`.
- **Build Status**: Passed `npm run build` with **0 errors**. Database count maintained at **exactly 3 rows**.



