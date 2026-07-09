# משתלת אליאסמין | مشتل الياسمين — Full-Stack Platform

Production-ready website + admin CMS for the Al-Yasmin plant nursery (Jatt, Israel).

See `architecture.md` (in the outputs shared alongside this project) for the full system design, schema, and API contract. This README covers local setup for what's built so far.

## Status: Phase 2 complete — Data Layer & Authentication

- [x] Backend: Express + TypeScript, MVC folder structure, env config, MongoDB connection wiring, Cloudinary config, error-handling middleware, httpOnly-cookie JWT auth middleware (`verifyToken`, `requireAdmin`), health check endpoint.
- [x] Frontend: Vite + React + TypeScript + Tailwind v4, full folder structure (api/components/pages/context/hooks/routes/types), botanical design token theme, React Router with public + protected admin route trees, `AuthContext` + `ProtectedRoute` wired to cookie-based session check, functional login page UI.
- [x] **Phase 2** — All 8 Mongoose models (User, Category, Plant, Gallery, Testimonial, Offer, SiteContent singleton, Contact), Zod request validation, real `/api/auth/login|logout|me` endpoints wired to httpOnly cookies, admin seed script.
- [ ] Phase 3 — Public API + public pages
- [ ] Phase 4 — Admin API (CRUD + Cloudinary upload wiring)
- [ ] Phase 5 — Admin dashboard UI
- [ ] Phase 6 — SEO, accessibility, animation polish
- [ ] Phase 7 — Deployment

## Project Structure

```
alyasmin-nursery/
├── backend/     # Express API — see backend/README section below
└── frontend/    # React app (public site + admin dashboard)
```

## Backend Setup

```bash
cd backend
cp .env.example .env     # fill in MongoDB Atlas URI, JWT secret, Cloudinary keys
npm install
npm run dev               # http://localhost:5000
```

Verify it's running: `GET http://localhost:5000/api/health`

## Frontend Setup

```bash
cd frontend
cp .env.example .env      # points at the backend API
npm install
npm run dev                # http://localhost:5173
```

## Authentication Approach

JWT is issued by the backend on login and stored in an **httpOnly, secure cookie** — never in localStorage or a JS-readable header token. This means:

- The frontend never sees or handles the raw token.
- `axiosClient` uses `withCredentials: true` so the cookie is sent/received automatically.
- `AuthContext` determines login state purely by asking the backend "who am I?" (`GET /api/auth/me`), which succeeds or 401s based on the cookie the browser already holds.
- `ProtectedRoute` blocks any `/admin/*` page from rendering until that check resolves.

**Phase 2 delivered the real endpoints**: `POST /api/auth/login` (bcrypt-verified, generic error on bad credentials so usernames can't be enumerated), `POST /api/auth/logout` (clears the cookie), `GET /api/auth/me` (returns the current admin profile, protected by `verifyToken`). To create the first admin locally:

```bash
cd backend
npm run seed:admin   # reads SEED_ADMIN_USERNAME / _EMAIL / _PASSWORD from .env, or uses dev defaults
```

CRUD endpoints for plants/categories/gallery/content are implemented in Phase 4, reusing this same auth middleware.

## Notes on Images

No real nursery photos are fabricated anywhere in this codebase. `frontend/public/placeholders/` documents exactly which placeholder images are expected during development; all real photos will be uploaded through the admin panel directly to Cloudinary once that flow is built (Phase 4).
