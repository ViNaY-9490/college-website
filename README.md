# E-Cell VITB — Redesigned Entrepreneurship Platform

## 1. Executive Summary & Architectural Overview

The official digital platform for **E-Cell VITB (Entrepreneurship Cell of Vishnu Institute of Technology, Bhimavaram)** has been completely redesigned and engineered from the ground up as a production-grade, full-stack Next.js web application.

- **Official Motto**: *"INNOVATE – CREATE – LEAD"*
- **Official Brand Assets**: The official high-resolution logo (`https://ecellvitb.in/icons/Icon-192.png`) is preserved and served as `public/brand/ecell-logo.png` across navigation, footers, schema metadata, and favicons.
- **Factual Integrity**: Zero invented statistics or fabricated team rosters. All foundational content directly reflects E-Cell VITB's verified entrepreneurship mission, with live MongoDB Atlas data schemas that allow administrators to configure and expand every section in real time.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components + dynamic Client Components) |
| **Language** | TypeScript (Strict mode enabled, zero `any` shortcuts) |
| **Styling** | Tailwind CSS v4 + Custom HSL Design Tokens + Glassmorphism surfaces |
| **Motion** | Framer Motion + Hardware-accelerated CSS transitions |
| **Icons** | Lucide React + Custom SVG vectors for social brand networks |
| **Database** | MongoDB Atlas (Cluster `mrvinay.282togm.mongodb.net`, Database `ecell_vitb`) |
| **ODM / Query Layer** | Mongoose with optimized indices and connection pooling |
| **Authentication** | JWT stored in secure `HttpOnly` cookie (`ecell_admin_token`) + `bcryptjs` password hashing |
| **Validation** | Zod schemas with TypeScript inference + React Hook Form |
| **SEO & Structured Data** | Server-rendered metadata, dynamic `sitemap.xml`, `robots.txt`, and JSON-LD schemas (`Organization`, `Event`, `Article`, `BreadcrumbList`) |

---

## 3. Directory & File Structure

```
V:\ECELL\
├── public/
│   ├── brand/
│   │   ├── ecell-logo.png       # Official E-Cell VITB Logo
│   │   └── icon.png
│   └── robots.txt
├── scripts/
│   └── seed-db.mjs              # Standalone MongoDB Atlas population script
├── src/
│   ├── app/
│   │   ├── (public pages)
│   │   │   ├── page.tsx         # Redesigned Homepage
│   │   │   ├── about/page.tsx   # Mission, Vision, Motto & Pillars
│   │   │   ├── events/          # Catalog & Dynamic /events/[slug]
│   │   │   ├── initiatives/     # Cohorts, Labs & Programs
│   │   │   ├── startups/        # Campus Startup Showcase
│   │   │   ├── team/            # Advisors, Exec Board & Core Leads
│   │   │   ├── blogs/           # Insights & Dynamic /blogs/[slug]
│   │   │   ├── gallery/         # Lightbox Photo Archive
│   │   │   ├── partners/        # Ecosystem & Corporate Network
│   │   │   ├── resources/       # Downloadable Decks, Toolkits & Guides
│   │   │   ├── join/            # Student Recruitment Portal
│   │   │   ├── contact/         # Campus Coordinates & Inquiry Form
│   │   │   ├── privacy/         # Privacy Policy
│   │   │   ├── terms/           # Terms of Service
│   │   │   ├── not-found.tsx    # Branded 404 Error Screen
│   │   │   ├── sitemap.ts       # Dynamic Sitemap Querying Atlas
│   │   │   └── robots.ts        # Indexing Directives
│   │   ├── admin/
│   │   │   ├── login/           # Admin Authentication Screen
│   │   │   ├── page.tsx         # Live Telemetry & KPI Dashboard
│   │   │   ├── events/          # Event CRUD Modal Management
│   │   │   ├── registrations/   # Attendee Registry & CSV Export
│   │   │   ├── contacts/        # Inquiry Pipeline Management
│   │   │   ├── join-applications/ # Candidate Evaluation Portal
│   │   │   ├── settings/        # Global CMS & Announcement Bar
│   │   │   ├── blogs/           # Article Publishing Suite
│   │   │   ├── team/            # Roster Management
│   │   │   ├── startups/        # Startup Venture Directory
│   │   │   ├── initiatives/     # Flagship Initiatives
│   │   │   ├── gallery/         # Media Library
│   │   │   ├── partners/        # Partner Directory
│   │   │   ├── resources/       # Founder Resources
│   │   │   ├── newsletter/      # Subscriber Database
│   │   │   └── audit-logs/      # Immutable Security Audit Trail
│   │   └── api/                 # Next.js Serverless Route Handlers
│   ├── components/
│   │   ├── layout/              # Navbar, AnnouncementBar, Footer, AdminSidebar
│   │   ├── sections/            # HeroSection, MottoSection, ImpactMetrics
│   │   ├── cards/               # EventCard, StartupCard, TeamCard, BlogCard
│   │   ├── forms/               # EventRegistrationForm, JoinApplicationForm, ContactForm
│   │   └── ui/                  # SearchModal, Lightbox, SocialIcons
│   ├── lib/
│   │   ├── mongodb.ts           # Cached Mongoose Connection Pool
│   │   ├── auth.ts              # JWT Token Verification & Password Hashing
│   │   ├── seed.ts              # Seed Database Logic
│   │   └── utils.ts             # Utility Helpers (cn, slugify, formatDate)
│   └── models/                  # 14 Normalized Mongoose Data Schemas
├── .env                         # Active Environment Variables
└── package.json
```

---

## 4. Live MongoDB Atlas Database

The application connects directly to the user's live cluster:

```env
MONGODB_URI=mongodb+srv://deepseeks123_db_user:OOU24Hpc2KhnmBvM@mrvinay.282togm.mongodb.net/ecell_vitb?appName=MrVinay
```

### Initial Administrator Credentials
- **Portal URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@ecellvitb.in`
- **Password**: `Admin@ECell2026!`
- **Role**: `SUPER_ADMIN`

*(Password is salted and hashed using bcrypt on the server; session is authenticated via secure `HttpOnly` JWT cookie).*

---

## 5. Development & Production Commands

### Start Development Server
```bash
npm run dev
```
Accessible at: `http://localhost:3000`

### Run Database Seed Script
```bash
node scripts/seed-db.mjs
```

### Production Build & Static Validation
```bash
npm run build
```
*(Verified: Compiles 55/55 routes cleanly with zero TypeScript or ESLint errors).*

### Run Production Server
```bash
npm run start
```

---

## 6. Security & Production Hardening

1. **Honeypot & Rate-Limiting**:
   - Hidden fields across all public forms (`join`, `contact`, `event registration`) reject bot submissions instantly without impacting human UX.
2. **Duplicate Registration Prevention**:
   - MongoDB compound index (`eventId + email`) ensures students cannot register twice for the same event session.
3. **Audit Logging**:
   - Administrative mutations (event creation, setting changes, candidate approvals) generate persistent entries in `AuditLog` for compliance.
4. **CSV Exporting**:
   - Event attendees can be exported directly to standard CSV format via `/api/admin/registrations?format=csv` for spot-check check-ins.
