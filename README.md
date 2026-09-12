# SRJ Global Website & Content Management System

SRJ Global Website is a modern corporate web application and custom Content Management System (CMS) built to showcase technology services, portfolio projects, industry solutions, and published articles, while providing an administrative management interface for site content.

## Key Features

- **Dynamic Content Management System (CMS)**: Integrated admin dashboard to manage site settings, navigation links, hero branding, services, blogs, FAQs, trust indicators, team members, portfolio items, and partner logos.
- **Three-Tier Role-Based Access Control (RBAC)**: Fine-grained access management supporting `USER`, `ADMIN`, and `SUPER_ADMIN` roles with stateless JWT authentication.
- **Super Admin Management Panel**: User management interface for managing administrative accounts, assigning roles, toggling account activation, and overriding credentials.
- **Search & Generative Engine Optimization (SEO / AEO / GEO)**: Automated dynamic meta tag management, structured JSON-LD schema markup (`Organization`, `FAQPage`, `Article`, `Service`, `LocalBusiness`), dynamic XML sitemap generation, and geo-targeting.
- **Interactive Lead & Contact Capture**: Service pricing inquiry flows, contact forms, meeting schedulers, and newsletter subscription handlers.
- **Media Storage & Handling**: File upload management for images, partner logos, team member profiles, and service assets.

## Technology Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Custom CSS Utilities
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Animations**: GSAP, Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0+ (using `mysql2/promise`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Validation & Security**: `express-validator`, `express-rate-limit`, `cors`
- **File Uploads**: `multer`

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React SPA Frontend                       │
│  (Public Pages, Service Catalog, Blog, Admin Dashboard)     │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Backend API                    │
│ (Auth Routes, CMS Management, Public Content, Rate Limiter) │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────┐              ┌──────────────────────┐
│    MySQL Database    │              │ Local File Storage   │
│ (Content & User Data)│              │  (Uploaded Media)    │
└──────────────────────┘              └──────────────────────┘
```

## Project Structure

```
SRJ_Global_Website/
├── backend/
│   ├── config/          # Database connection, rate limits, CORS
│   ├── controllers/     # API request handlers and business logic
│   ├── middleware/      # Authentication, RBAC, validators
│   ├── routes/          # Express route definitions
│   ├── public/uploads/  # Static media uploads directory
│   ├── init-db.js       # Database initialization & bootstrapping script
│   ├── schema.sql       # Database table definitions
│   └── server.js        # Express application entry point
├── frontend/
│   ├── public/          # Static assets, robots.txt
│   ├── src/
│   │   ├── components/  # Public layout components & Admin UI modules
│   │   ├── config/      # API client instance & pricing defaults
│   │   ├── data/        # Static fallbacks and options data
│   │   ├── App.jsx      # Main application routing
│   │   └── main.jsx     # Vite entry point
├── docs/
│   └── TECHNICAL_DOCUMENTATION.md # Comprehensive technical documentation
└── README.md
```

## Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MySQL Server (v8.0 or higher)

### Installation Steps

1. Clone the repository to your local directory:
   ```bash
   git clone <repository_url>
   cd SRJ_Global_Website
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Environment Configuration

### Backend Configuration (`backend/.env`)

Create a `.env` file inside the `backend` directory using the following variables:

```env
PORT=5001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=srj_db

# Security & Authentication
JWT_SECRET=your_jwt_secret_key

# Super Admin Bootstrap Credentials (Optional)
SUPERADMIN_EMAIL=superadmin@srjglobal.com
SUPERADMIN_PASSWORD=your_superadmin_password

# External Services (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
GROQ_API_KEY=
```

### Frontend Configuration (`frontend/.env`)

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

### Database Initialization

To set up table schemas and bootstrap the initial Super Admin account:

```bash
cd backend
node init-db.js
```

## Run Commands

### Development Mode

1. Start the Express backend server:
   ```bash
   cd backend
   npm run dev
   ```
   The backend will listen on `http://localhost:5001`.

2. Start the Vite frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

### Production Build

To build the React frontend for deployment:

```bash
cd frontend
npm run build
```

The compiled static assets will be output to `frontend/dist`.

## Production Notes

- Ensure `NODE_ENV` is set to `production` in your server environment.
- Use a reverse proxy such as Nginx to handle SSL termination, static file serving, and backend proxying.
- Use a process manager like PM2 to keep the Express application running continuously.
- Configure strict `ALLOWED_ORIGINS` in `backend/.env` matching your domain.
- For complete system specifications, database tables, and API documentation, refer to [`docs/TECHNICAL_DOCUMENTATION.md`](docs/TECHNICAL_DOCUMENTATION.md).
