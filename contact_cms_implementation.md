# Contact Us / Inquiry CMS Implementation Document

## 1. Overview
This document tracks the step-by-step implementation of the **Contact Us / Direct Inquiry CMS** for the SRJ Global Website project. Step 1 (Discovery & Architecture Audit) and Step 2 (Database Implementation) are complete.

---

## 2. Database Schema (Step 2 Completed)

- **Database**: `srj_db`
- **Table Name**: `contacts`
- **Engine / Charset / Collation**: InnoDB, `utf8mb4`, `utf8mb4_unicode_ci`
- **Schema File**: [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql)

### Table Structure
| Column | Type | Nullable | Default | Key | Description |
|---|---|---|---|---|---|
| `id` | `INT` | NO | `AUTO_INCREMENT` | PRIMARY KEY | Unique integer primary key |
| `first_name` | `VARCHAR(100)` | NO | NULL | - | First name of lead |
| `last_name` | `VARCHAR(100)` | NO | NULL | - | Last name of lead |
| `email` | `VARCHAR(255)` | NO | NULL | - | Contact email address |
| `phone` | `VARCHAR(20)` | NO | NULL | - | Contact phone number |
| `company` | `VARCHAR(255)` | YES | NULL | - | Company / Organization name |
| `service` | `VARCHAR(150)` | NO | NULL | - | Service requested |
| `budget` | `VARCHAR(100)` | YES | NULL | - | Estimated project budget |
| `message` | `TEXT` | NO | NULL | - | Project details / inquiry message |
| `status` | `VARCHAR(50)` | NO | `'new'` | INDEX | Inquiry lifecycle state (`'new'`, `'contacted'`, `'resolved'`) |
| `created_at` | `TIMESTAMP` | YES | `CURRENT_TIMESTAMP` | INDEX | Submission timestamp |
| `updated_at` | `TIMESTAMP` | YES | `CURRENT_TIMESTAMP ON UPDATE` | - | Record last update timestamp |

**Indexes**:
- `PRIMARY KEY` on (`id`)
- `idx_contacts_created_at` on (`created_at` DESC)
- `idx_contacts_status` on (`status`)

---

## 3. Database Migration & Verification Results

1. **Migration Execution**: Executed `ALTER TABLE contacts` to add `company`, `budget`, `status`, and `updated_at` columns and `idx_contacts_status` index without dropping the table.
2. **Existing Data Preservation**: All 3 pre-existing records preserved intact with `status = 'new'`, `company = NULL`, `budget = NULL`.
3. **Status Lifecycle Test**:
   - Inserted synthetic test record (`synthetic-test-contact-999@example.invalid`).
   - Verified default `status = 'new'`.
   - Updated `status` → `'contacted'`; verified `updated_at` mutated.
   - Updated `status` → `'resolved'`; verified `updated_at` mutated.
   - Deleted synthetic test record.
4. **Final DB State**: Confirmed **exactly 3 rows** in `contacts` table.

---

## 4. Files Modified in Step 2

1. [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql) [MODIFY]: Updated `contacts` table DDL with `company`, `budget`, `status`, `updated_at`, and `idx_contacts_status`.
2. [`contact_cms_discovery_audit.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_discovery_audit.md) [MODIFY]: Updated with Step 2 Database Implementation report.
3. [`contact_cms_implementation.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_implementation.md) [NEW]: Created ongoing implementation tracking document.

---

## 5. Scope & Safety Confirmation

- **Backend Code**: No controller or route files modified in Step 2.
- **Frontend Code**: No frontend files modified in Step 2.
- **Unrelated Upload**: `backend/public/uploads/1788851060523-246555465.jpeg` preserved untouched.
- **Git Actions**: No staging (`git add`), commit, or push executed.

---

## 6. Step 3 — Backend API Implementation

### Overview
In Step 3, the backend API layer for Contact Inquiries was updated to handle `company` and `budget` persistence, enforce strong input validation, default `status` to `'new'`, and introduce an Admin status update endpoint (`PUT /api/contact/:id/status`).

### Files Created & Modified
1. [`backend/controllers/contactController.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/controllers/contactController.js) [MODIFY]: Upgraded `createContact` (supports `company`/`budget`), `getContacts` (returns all fields ordered by `created_at DESC`), `updateContactStatus` [NEW], and `deleteContact`.
2. [`backend/routes/contactRoutes.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/routes/contactRoutes.js) [MODIFY]: Added `PUT /:id/status` endpoint with `validateIdParam`, `verifyToken`, `isAdmin`, and `validateUpdateContactStatus`.
3. [`backend/middleware/validators.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/middleware/validators.js) [MODIFY]: Updated `validateCreateContact` (added optional `company` & `budget`) and added `validateUpdateContactStatus`.
4. [`backend/config/rateLimits.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/config/rateLimits.js) [MODIFY]: Added test environment skip rule to `contactLimiter`.
5. [`contact_cms_discovery_audit.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_discovery_audit.md) [MODIFY]: Updated with Step 3 specs.
6. [`contact_cms_implementation.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_implementation.md) [MODIFY]: Updated with Step 3 implementation and test matrix.

---

## 7. Verification & Test Matrix (Step 3)

Automated verification script (`scratch/test_contact_api.js`) executed 27 test cases against backend API (`http://localhost:5001`):

| Test Case | Scenario | Expected | Result | Status |
|---|---|---|---|---|
| 1 | `POST /api/contact` missing `firstName` | HTTP 400 Validation Error | HTTP 400 | PASS |
| 2 | `POST /api/contact` missing `email` | HTTP 400 Validation Error | HTTP 400 | PASS |
| 3 | `POST /api/contact` invalid email format | HTTP 400 Validation Error | HTTP 400 | PASS |
| 4 | `POST /api/contact` missing `service` | HTTP 400 Validation Error | HTTP 400 | PASS |
| 5 | `POST /api/contact` missing `message` | HTTP 400 Validation Error | HTTP 400 | PASS |
| 6 | `POST /api/contact` valid payload with `company` + `budget` | HTTP 201 Created (ID returned) | HTTP 201 | PASS |
| 7 | `GET /api/contact` without JWT | HTTP 401 Unauthorized | HTTP 401 | PASS |
| 8 | `GET /api/contact` with Admin JWT | HTTP 200 OK | HTTP 200 | PASS |
| 9 | Verify DB stores `company` | `company === 'Acme Synthetic Corp'` | Verified | PASS |
| 10 | Verify DB stores `budget` | `budget === '₹50k - ₹100k'` | Verified | PASS |
| 11 | Verify status defaults to `'new'` & public status injection ignored | `status === 'new'` | Verified | PASS |
| 12 | `PUT /api/contact/:id/status` → `'contacted'` | HTTP 200 OK | HTTP 200 | PASS |
| 13 | Verify Admin GET reflects status `'contacted'` | Status = `'contacted'` | Verified | PASS |
| 14 | `PUT /api/contact/:id/status` → `'resolved'` | HTTP 200 OK | HTTP 200 | PASS |
| 15 | Verify Admin GET reflects status `'resolved'` | Status = `'resolved'` | Verified | PASS |
| 16 | `PUT /api/contact/:id/status` with invalid status | HTTP 400 Bad Request | HTTP 400 | PASS |
| 17 | `PUT /api/contact/invalid_id/status` | HTTP 400 Bad Request | HTTP 400 | PASS |
| 18 | `PUT /api/contact/999999/status` (non-existent ID) | HTTP 404 Not Found | HTTP 404 | PASS |
| 19 | `DELETE /api/contact/:id` for synthetic contact | HTTP 200 OK | HTTP 200 | PASS |
| 20 | Verify database cleanup | Row count = 3 (matches initial) | Row count = 3 | PASS |

### Regression API Verification (8/8 Passed)
- `GET /api/blogs` -> HTTP 200 (PASS)
- `GET /api/services` -> HTTP 200 (PASS)
- `GET /api/testimonials/admin` -> HTTP 200 (PASS)
- `GET /api/portfolio/admin` -> HTTP 200 (PASS)
- `GET /api/faqs/admin` -> HTTP 200 (PASS)
- `GET /api/industries/admin` -> HTTP 200 (PASS)
- `GET /api/team/admin` -> HTTP 200 (PASS)
- `GET /api/subscribers/admin` -> HTTP 200 (PASS)

---

## 8. Build & Safety Verification (Step 3)
- Executed `cd frontend && npm run build`.
- **Result**: Built successfully in `784ms` with 0 errors.
- **Frontend Code**: `Contact.jsx`, `AdminDashboard.jsx`, `Navbar.jsx` remained **100% UNTOUCHED** in Step 3.
- **Unrelated Upload**: `backend/public/uploads/1788851060523-246555465.jpeg` preserved untouched.
- **Git Actions**: No staging (`git add`), commit, or push executed.

---

## 9. Step 4 — Admin Panel Implementation

### Overview
Step 4 connected the existing Admin Panel Contact section (`frontend/src/components/admin/AdminDashboard.jsx`) to the Contact APIs (`/api/contact`) so that administrators can view, search, filter, update lifecycle status, read full inquiry messages, and delete contact records.

### Files Modified in Step 4
1. [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx) [MODIFY]:
   - Added Lucide icons (`Eye`, `Clock`, `Building`, `Filter`).
   - Added state hooks: `contactSearch`, `contactStatusFilter`, `selectedContactModal`.
   - Added handler functions: `handleUpdateContactStatus(id, newStatus)`, `handleDeleteContact(id, name)`, `formatContactDate(dateStr)`.
   - Upgraded `contacts` active tab rendering with stats counter header, search & status filter controls, responsive inquiries table, and inline status dropdown selector.
   - Added Contact Inquiry Detail Modal (`selectedContactModal`) for viewing full message body and metadata.
2. [`contact_cms_discovery_audit.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_discovery_audit.md) [MODIFY]: Updated with Step 4 summary.
3. [`contact_cms_implementation.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_implementation.md) [MODIFY]: Documented complete Step 4 implementation.

### Features Implemented
- **APIs Consumed**:
  - `GET /api/contact` via centralized Axios client (`api.js`)
  - `PUT /api/contact/:id/status` with `{ status: 'new' | 'contacted' | 'resolved' }`
  - `DELETE /api/contact/:id`
- **Fields Displayed**:
  - Name (`first_name` + `last_name`)
  - Email (with mailto action)
  - Phone (with tel action)
  - Company (displays company name or `—`)
  - Service Required
  - Budget (displays budget range or `—`)
  - Message (line-clamp snippet in table, full pre-wrap text in modal)
  - Status (`new`, `contacted`, `resolved` with color-coded badges)
  - Timestamps (`created_at`, `updated_at`)
  - Actions (View details modal button, Delete button)
- **Status Management**: Real-time status update dropdown in table rows and detail modal using `PUT /api/contact/:id/status`, updating local state `contacts` without page reloads.
- **Delete Flow**: `window.confirm` confirmation prompt before executing `DELETE /api/contact/:id`.
- **Client-Side Search**: Multi-field search across `first_name`, `last_name`, `email`, `phone`, `company`, `service` (case-insensitive and trimmed).
- **Status Filter**: Dropdown filter (`all`, `new`, `contacted`, `resolved`) combining seamlessly with search.
- **Statistics Header**: Real-time metrics for Total Inquiries, New, Contacted, and Resolved counts.
- **Empty / Loading States**: Display clear empty state when zero inquiries exist or when search/filter returns zero matches.

### Verification Results
1. **Frontend Production Build**: `cd frontend && npm run build` completed with **0 errors** in `1.21s`.
2. **Automated End-to-End Test** (`scratch/test_contact_admin_step4.js`):
   - Admin Authentication & GET `/api/contact`: initial count = 3 (PASS)
   - Synthetic Submission (`POST /api/contact`): created ID #7 with `status: 'new'` (PASS)
   - Status Transition (`PUT /:id/status` -> `'contacted'`): updated status & `updated_at` (PASS)
   - Status Transition (`PUT /:id/status` -> `'resolved'`): updated status & `updated_at` (PASS)
   - Invalid Status Rejection (`PUT /:id/status` -> `'invalid'`): rejected with HTTP 400 (PASS)
   - Deletion (`DELETE /:id`): deleted synthetic record #7 (PASS)
   - Final GET & Direct MySQL Count: **exactly 3 rows** in `contacts` table (PASS)

## 10. Step 5 — Public Contact Form Integration

### Overview
Step 5 completed the public website integration by connecting the form in [`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx) to the backend `POST /api/contact` endpoint via the centralized Axios client (`api.js`).

### Files Modified in Step 5
1. [`frontend/src/components/Contact.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Contact.jsx) [MODIFY]:
   - Replaced raw `axios` import with centralized API client [`frontend/src/config/api.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/config/api.js).
   - Added `loading`, `statusMessage`, and `statusType` component states.
   - Upgraded `handleSubmit` to split full name safely into `firstName` and `lastName`, trim inputs, include optional `company` and `budget` selections, and dispatch `POST /api/contact`.
   - Added inline status banner (green for success, red for error) and disabled loading button state ("Sending Inquiry...").
   - Preserved 100% of existing visual styling, layout, typography, animations, input fields, contact details, and location map.
2. [`contact_cms_discovery_audit.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_discovery_audit.md) [MODIFY]: Updated with Step 5 completion details.
3. [`contact_cms_implementation.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_implementation.md) [MODIFY]: Updated with Step 5 report.

### Data Payload Submitted
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@company.com",
  phone: "+91 98765 43210",
  company: "Acme Corp",
  service: "Mobile Apps",
  budget: "₹25k - ₹50k",
  message: "Detailed project requirements..."
}
```

### Verification & E2E Test Results
1. **Frontend Production Build**: `cd frontend && npm run build` completed with **0 errors** in `713ms`.
2. **Automated E2E Integration Test** (`scratch/test_contact_step5_e2e.js`):
   - Initial count check: 3 rows (**PASS**)
   - Public form payload submission: Returned `HTTP 201 Created` with `success: true` (**PASS**)
   - Admin API GET Verification: Retrieved record #8 with `company: 'SRJ Public Test Corp'`, `budget: '₹25k - ₹50k'`, `status: 'new'` (**PASS**)
   - Cleanup: Deleted synthetic record #8 (**PASS**)
   - Final Database Row Count: **exactly 3 rows** (**PASS**)

## 11. Step 6 — Contact CTA / Calendly Separation

### Overview
Step 6 audited all frontend call-to-action (CTA) elements across `frontend/src` and separated Direct Contact Inquiries from external meeting scheduling.

### Frontend CTA Audit & Classification
| Component File | CTA Button / Link Text | Current Destination | Intended Destination | Classification & Rationale |
|---|---|---|---|---|
| [`Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) (Desktop) | `Contact Us` | `https://calendly.com/srjglobaltechnology` | `/contact` | **Direct Contact Inquiry**: Main website navigation menu item. Must route internally to `/contact`. |
| [`Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) (Mobile Drawer) | `Contact Us` | `https://calendly.com/srjglobaltechnology` | `/contact` | **Direct Contact Inquiry**: Mobile navigation drawer item. Must route internally to `/contact`. |
| [`CollabHero.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/CollabHero.jsx) | `Discuss Your Project` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to inquiry form. |
| [`ServicesHero.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/services/ServicesHero.jsx) | `Talk to Our Experts` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to expert consultation form. |
| [`ServicesCTA.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/services/ServicesCTA.jsx) | `Start a Conversation` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to solution inquiry form. |
| [`PricingHero.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/pricing/PricingHero.jsx) | `Schedule Consultation` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to inquiry form. |
| [`PricingPage.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/pricing/PricingPage.jsx) | `Request Proposal` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to proposal form. |
| [`IndustriesHero.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/IndustriesHero.jsx) | `Schedule Consultation` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to industry consultation form. |
| [`AboutHero.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/about/AboutHero.jsx) | `Schedule Consultation` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to consultation form. |
| [`Collaboration.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Collaboration.jsx) | `Discuss Your Project` | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to project collaboration form. |
| [`GameDevelopment.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/services/GameDevelopment.jsx) | Service Card Click | `/#contact` via `openCalendly` | `/contact` | **Direct Contact Inquiry**: Directs user to game dev inquiry form. |
| [`Footer.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Footer.jsx) | `Contact Us` | `/contact` | `/contact` | **Direct Contact Inquiry**: Already correctly pointing to `/contact`. |

### Files Modified in Step 6
1. [`frontend/src/components/Navbar.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Navbar.jsx) [MODIFY]:
   - Updated `navLinks` array item: `{ name: 'Contact Us', href: '/contact' }`.
   - Removed interceptor logic that forced `Contact Us` to `href="https://calendly.com/srjglobaltechnology"`.
   - Enabled standard `<Link to="/contact">` for desktop navigation and mobile drawer.
2. [`contact_cms_discovery_audit.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_discovery_audit.md) [MODIFY]: Updated with Step 6 discovery audit summary.
3. [`contact_cms_implementation.md`](file:///Users/macbook/Downloads/SRJ_Global_Website/contact_cms_implementation.md) [MODIFY]: Updated with Step 6 documentation.

### Verification Results
1. **Frontend Production Build**: `cd frontend && npm run build` completed with **0 errors** in `1.44s`.
2. **Git Status Verification**:
   - `Navbar.jsx` modified cleanly.
   - Unrelated deleted upload `backend/public/uploads/1788851060523-246555465.jpeg` preserved **UNSTAGED**.
   - No `git add`, `git commit`, or `git push` executed.
3. **Database Row Count**: Preserved at **exactly 3 rows**.

---

## 12. Scope & Constraints Compliance
- **Unrelated Deleted Upload**: `backend/public/uploads/1788851060523-246555465.jpeg` preserved **UNSTAGED**
- **Git Rules**: No `git add`, `git commit`, or `git push` executed.




