# FAQ CMS Implementation Document

## 1. Database Table Structure
Defined in [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql) and created in `srj_db`:

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | NO | PRIMARY KEY | Unique identifier |
| `question` | TEXT | NO | - | FAQ Question (Required, 5-2000 chars) |
| `answer` | TEXT | NO | - | FAQ Answer (Required, 5-5000 chars) |
| `category` | VARCHAR(100) | YES | `'General'` | Optional category grouping (e.g., 'General', 'Pricing', 'Blog') |
| `is_active` | TINYINT(1) | NO | 1 | Publication status toggle (1 = Published, 0 = Inactive) |
| `sort_order` | INT | NO | 0 | Display priority order |
| `created_at` | TIMESTAMP | YES | CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | YES | CURRENT_TIMESTAMP ON UPDATE | Update timestamp |

**Indexes**:
- `idx_faqs_is_active` on (`is_active`)
- `idx_faqs_sort_order` on (`sort_order`)

---

## 2. API Endpoints Specification

- **Controller**: [`backend/controllers/faqController.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/controllers/faqController.js)
- **Routes**: [`backend/routes/faqRoutes.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/routes/faqRoutes.js)

| Method | Endpoint | Access | Middleware | Description |
|---|---|---|---|---|
| `GET` | `/api/faqs` | Public | None | Returns published active FAQs (`is_active = 1`). Supports optional `?category=General` query filter. |
| `GET` | `/api/faqs/admin` | Admin | `verifyToken, isAdmin` | Returns all active & inactive FAQs for Admin Panel. |
| `POST` | `/api/faqs` | Admin | `verifyToken, isAdmin, validateCreateFaq` | Creates a new FAQ item. |
| `PUT` | `/api/faqs/:id` | Admin | `validateIdParam, verifyToken, isAdmin, validateUpdateFaq` | Updates an existing FAQ item using partial update semantics. |
| `PUT` | `/api/faqs/:id/toggle` | Admin | `validateIdParam, verifyToken, isAdmin` | Toggles active status (1 -> 0 or 0 -> 1). |
| `DELETE` | `/api/faqs/:id` | Admin | `validateIdParam, verifyToken, isAdmin` | Permanently deletes an FAQ record. |

---

## 3. Validation Rules & Middleware
Defined in [`backend/middleware/validators.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/middleware/validators.js):

- `question`: Required on create. Must be 5-2000 characters. Trimmed.
- `answer`: Required on create. Must be 5-5000 characters. Trimmed.
- `category`: Optional. Max 100 characters. Defaults to `'General'`.
- `is_active`: Optional. Must be 0 or 1 (or boolean/string equivalent). Defaults to `1`.
- `sort_order`: Optional. Must be an integer. Defaults to `0`.

---

## 4. Ordering & Query Behavior
All endpoints order FAQ records strictly by:
```sql
ORDER BY sort_order ASC, created_at DESC, id DESC
```

---

## 5. Admin Panel UI Integration (Completed in Step 3)
- **File**: [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx)
- **Features Implemented**:
  1. Added **FAQs** tab to Admin sidebar navigation with `HelpCircle` icon.
  2. Added `faqs` state array, `newFaq` form state, and `editFaqId` edit state.
  3. Integrated `fetchData` for `activeTab === 'faqs'` fetching `GET /api/faqs/admin`.
  4. Added API action handlers: `handleCreateFaq`, `handleEditFaq`, `handleToggleFaq`, `handleDeleteFaq`.
  5. Built 2-Column Responsive Admin UI:
     - **Left Column**: Form for Create / Edit with Question (textarea), Answer (textarea with line break handling), Category (text input, default 'General'), Sort Order (numeric input with helper label), Status (Active/Inactive dropdown), Cancel Edit button, and Submit button.
     - **Right Column**: FAQ list cards displaying Category badge, Active/Inactive status badge, Sort Order tag, Question title, Answer body with `whitespace-pre-line` formatting, Activate/Deactivate toggle button, Edit button, and Delete confirmation modal.
     - **Empty State**: Clear empty state message when zero FAQs exist in the database.

---

## 6. Public Frontend Integration (Completed in Step 4)
- **Files Modified**:
  - [`frontend/src/components/Faq.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Faq.jsx)
  - [`frontend/src/components/pricing/PricingPage.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/pricing/PricingPage.jsx)
  - [`frontend/src/components/blog/BlogFAQ.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/blog/BlogFAQ.jsx)
  - [`frontend/src/components/Blog.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Blog.jsx)
  - [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx)
  - [`frontend/src/data/blogData.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/data/blogData.js)

### Integration Details
1. **Data Migration**:
   - Migrated 14 hardcoded FAQ records into `srj_db.faqs`:
     - 4 **General** category records from `Faq.jsx`.
     - 4 **Pricing** category records from `PricingPage.jsx`.
     - 6 **Blog** category records from `blogData.js`.
   - Verified exact database record count is `14`.

2. **Category Isolation & API Consumption**:
   - **General FAQ**: `Faq.jsx` fetches `GET /api/faqs?category=General` via `api`. Mounted on Homepage in `App.jsx` after `<Testimonials />` with `id="faq"`.
   - **Pricing FAQ**: `PricingPage.jsx` fetches `GET /api/faqs?category=Pricing` via `api`.
   - **Blog FAQ**: `BlogFAQ.jsx` fetches `GET /api/faqs?category=Blog` via `api`.
   - Removed static hardcoded FAQ arrays from `Faq.jsx`, `PricingPage.jsx`, and `blogData.js`.

3. **State Handling & Line Breaks**:
   - Loading skeletons displayed during initial fetch.
   - If API fails or returns zero items, public components return `null`, hiding the section cleanly.
   - Multi-line answers formatted using `whitespace-pre-line` (or inline `whiteSpace: "pre-line"`).

4. **SEO JSON-LD Decision**:
   - FAQPage JSON-LD schema integration deferred to the dedicated repository-wide SEO phase to keep CMS module scope clean and focused.

---

## 7. Testing & Verification Summary
1. **Database Migration Verification**: Exactly `14` active records present in `faqs` table (`4` General, `4` Pricing, `6` Blog).
2. **API Category Isolation**:
   - `GET /api/faqs?category=General` -> Returns 4 items.
   - `GET /api/faqs?category=Pricing` -> Returns 4 items.
   - `GET /api/faqs?category=Blog` -> Returns 6 items.
3. **Public Component Verification**:
   - Homepage: General FAQ section renders 4 items cleanly with working expand/collapse accordion.
   - Pricing Page: Pricing FAQ section renders 4 items cleanly.
   - Blog Page: Blog FAQ section renders 6 items cleanly.
4. **Admin UI Verification**: Verified Admin Panel loads, FAQs tab lists all 14 records, CRUD actions operate properly.
5. **Production Build**: Executed `npm run build` in `frontend/` — completed with **0 build errors** in 1.08s.
6. **Regression Verification**: Verified Services, Portfolio, Testimonials, Careers, Blog detail, Contact, and Admin Dashboard work seamlessly.


