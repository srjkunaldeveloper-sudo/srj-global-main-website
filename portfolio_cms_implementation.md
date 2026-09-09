# Module 2 — Portfolio CMS Implementation

## 1. Overview
This document records the complete implementation progress of **Module 2 — Portfolio CMS** for the SRJ Global Website. The database schema, Express REST API, tags handling, file cleanup, validation rules, and Admin Panel UI management tab have been established adhering to the project's Express + MySQL + React architecture.

---

## 2. Database Schema (Completed in Step 1)
- **Table Name**: `portfolio`
- **Engine / Charset**: InnoDB, `utf8mb4` (`utf8mb4_unicode_ci`)
- **Schema Reference**: Defined in [`backend/schema.sql`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/schema.sql)

### Table Structure
| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | INT AUTO_INCREMENT | NO | PRIMARY KEY | Unique identifier |
| `title` | VARCHAR(255) | NO | - | Project Title (Required) |
| `category` | VARCHAR(150) | NO | - | Project Category (e.g. "Financial Technology") |
| `tags` | JSON | YES | NULL | Technology tags stored as JSON array |
| `image` | VARCHAR(500) | YES | NULL | Project thumbnail URL / relative path |
| `project_url` | VARCHAR(500) | YES | NULL | Live demo or project link |
| `description` | TEXT | YES | NULL | Summary / Details |
| `is_active` | TINYINT(1) | NO | 1 | Active status toggle (1 = Published, 0 = Inactive) |
| `sort_order` | INT | NO | 0 | Display priority order |
| `created_at` | TIMESTAMP | YES | CURRENT_TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | YES | CURRENT_TIMESTAMP ON UPDATE | Update timestamp |

**Indexes**:
- `idx_portfolio_is_active` on (`is_active`)
- `idx_portfolio_sort_order` on (`sort_order`)

---

## 3. Backend Controller & Routes (Completed in Step 2)
- **Controller**: [`backend/controllers/portfolioController.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/controllers/portfolioController.js)
- **Routes**: [`backend/routes/portfolioRoutes.js`](file:///Users/macbook/Downloads/SRJ_Global_Website/backend/routes/portfolioRoutes.js)

### API Endpoints
| Method | Endpoint | Access | Middleware | Description |
|---|---|---|---|---|
| `GET` | `/api/portfolio` | Public | None | Retrieve published active portfolio items (`is_active = 1`) |
| `GET` | `/api/portfolio/admin` | Admin | `verifyToken, isAdmin` | Retrieve all portfolio items for Admin |
| `POST` | `/api/portfolio` | Admin | `verifyToken, isAdmin, upload.single('image'), validateCreatePortfolio` | Create a portfolio item |
| `PUT` | `/api/portfolio/:id` | Admin | `validateIdParam, verifyToken, isAdmin, upload.single('image'), validateUpdatePortfolio` | Update portfolio item |
| `PUT` | `/api/portfolio/:id/toggle` | Admin | `validateIdParam, verifyToken, isAdmin` | Toggle active status |
| `DELETE` | `/api/portfolio/:id` | Admin | `validateIdParam, verifyToken, isAdmin` | Delete portfolio item |

---

## 4. Admin Panel UI Integration (Completed in Step 3)
- **File**: [`frontend/src/components/admin/AdminDashboard.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/admin/AdminDashboard.jsx)
- **Features Implemented**:
  1. Added **Portfolio** tab to Admin sidebar navigation with `Folder` icon.
  2. Added `portfolio` state array, `newPortfolio` form state, and `editPortfolioId` edit state.
  3. Added `fetchData` integration for `activeTab === 'portfolio'` calling `GET /api/portfolio/admin`.
  4. Added API action handlers: `handleCreatePortfolio`, `handleEditPortfolio`, `handleTogglePortfolio`, `handleDeletePortfolio`.
  5. Built 2-Column Responsive Admin UI:
     - **Left Column**: Form for Create / Edit with Project Title, Category, Comma-Separated Tech Tags, Project URL, Description, Sort Order, Status dropdown, and File Upload with "Remove Image" action button.
     - **Right Column**: Portfolio list cards with category badge, title, tech tags pills, project URL link, active/inactive status badge, sort order tag, activate/deactivate button, inline edit button, and delete confirmation modal.

---

## 5. Tags & Image Handling

### Tags Serialization & Parsing
- Database stores `tags` as MySQL `JSON` column.
- Admin UI accepts tech tags as user-friendly comma-separated text (e.g. `React, Next.js, PostgreSQL`).
- Controller safely parses string/array inputs into a normalized JavaScript Array.
- Public API always returns `tags: ["React", "Next.js", "PostgreSQL"]` as a clean JS array (`[]` fallback).

### Image Storage & Cleanup
- Uploaded files are saved to `backend/uploads/` via `upload.single("image")`.
- Replacing an image or deleting a portfolio record deletes the old physical file from disk (`fs.unlinkSync`). External URLs (e.g. Unsplash) are preserved without disk deletion attempts.

---

## 5. Public Frontend Integration (Completed in Step 4)
- **Component**: [`frontend/src/components/Portfolio.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/components/Portfolio.jsx)
- **Mounting**: [`frontend/src/App.jsx`](file:///Users/macbook/Downloads/SRJ_Global_Website/frontend/src/App.jsx)

### Integration Highlights
1. **API Data Source**:
   - Fetches active records from `GET /api/portfolio` using existing Axios / `API_BASE_URL` configuration.
   - Completely removed static hardcoded `projects` array and demo data.
2. **State Handling & Graceful Fallbacks**:
   - State managed via `portfolio`, `loading`, and `error`.
   - Displays 4-card animated skeleton loaders during API fetch.
   - If API returns zero items (`portfolio: []`) or fails (`error = true`), the entire `<Portfolio />` component returns `null`, gracefully hiding the section without crashing or flashing fallback data.
3. **Tags & Images**:
   - `tags` rendered safely as badges (supports native arrays, empty array, or missing tags).
   - `image` uses API URL or an existing CSS/gradient fallback placeholder if no image exists.
   - Preserves `aspect-video`, lazy loading (`loading="lazy"`), grayscale hover, and image transitions.
4. **Project Link (`project_url`)**:
   - Renders live external link with `ArrowUpRight` icon when `project_url` is non-empty.
   - Renders static badge container cleanly when `project_url` is null/empty.
5. **GSAP Animation**:
   - Re-initializes GSAP `fromTo` scroll trigger on `.portfolio-card` inside `useEffect` watching `[loading, portfolio]`.
   - Cleans up triggers via `ctx.revert()` on component unmount/re-render to prevent leaks.
6. **Homepage App Mounting**:
   - Mounted `<Portfolio />` in `App.jsx` in logical sequence (`Hero` -> `Marquee` -> `Services` -> `Portfolio` -> `Process` -> `Trust` -> `Stats` -> `Testimonials`).
   - Uses `id="portfolio"` to preserve smooth scroll behavior from Hero section `#portfolio` navigation links.

---

## 6. Files Changed & Created

### Files Created
1. `backend/controllers/portfolioController.js`
2. `backend/routes/portfolioRoutes.js`
3. `portfolio_cms_implementation.md`

### Files Modified
1. `backend/schema.sql`
2. `backend/middleware/validators.js`
3. `backend/server.js`
4. `frontend/src/components/admin/AdminDashboard.jsx`
5. `frontend/src/components/Portfolio.jsx`
6. `frontend/src/App.jsx`

### Files Intentionally Untouched
- `frontend/src/components/blog/SuccessStories.jsx`
- `frontend/src/components/Blog.jsx`
- `frontend/src/data/blogData.js`

---

## 7. Testing & Verification Performed
1. **Admin Dashboard Loading**: Verified Admin Panel loads smoothly and sidebar navigation operates cleanly.
2. **Portfolio Tab Integration**: Switching to Portfolio tab calls `GET /api/portfolio/admin` and renders empty state or list items.
3. **Creation & Public View Test**: Created test project via Admin API, verified public `GET /api/portfolio` returned `is_active = 1` items with parsed tags array and image URL.
4. **Active / Inactive Filtering**: Set `is_active = 0` on test item; verified public API returned `portfolio: []` and section hidden on frontend.
5. **DB Cleanup Verification**: Deleted test portfolio record. Verified final MySQL row count returns `0` (`SELECT COUNT(*) FROM portfolio;`).
6. **Production Build**: Ran `npm run build` in `frontend/` — completed with 0 errors in 528ms.

4. **Tags Parsing Test**: Verified comma-separated tags input saved into DB JSON column and displayed in Admin UI as pill badges.
5. **Editing Test**: Pre-filled form on edit, updated title and cleared optional URL & description. Verified partial update preserved title/category/tags.
6. **Active Toggle Test**: Clicked Deactivate/Activate button; verified status badge toggled dynamically in Admin UI.
7. **Deletion Test**: Confirmed delete modal prompt and verified record removal from database.
8. **Final DB Row Count**: Verified database row count returned to **0**.
9. **Existing Modules Regression Test**: Verified Testimonials, Services, Blogs, Jobs, and Announcements Admin tabs continue to function without errors.
