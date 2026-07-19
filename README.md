# משתלת אליאסמין | مشتل الياسمين — Full-Stack Platform

Production-ready website + admin CMS for the Al-Yasmin plant nursery (Jatt, Israel).

**Status: complete.** Public website, admin dashboard, full CRUD for every managed resource, image upload via Cloudinary, and httpOnly-cookie authentication are all implemented and verified (see "Verification" below).

## What's included

**Public website:** Home, About, Plant Catalog (search/filter/sort/pagination), Plant Details, Gallery (with lightbox), Services, Contact (with working form). Fully responsive, RTL (Hebrew/Arabic), botanical green/cream/terracotta design system, loading/error/empty states throughout.

**Admin dashboard** (`/admin`, behind login): stat overview, Plants (create/edit/delete/hide/multi-image upload), Categories (create/edit/delete/image), Gallery (multi-image upload/delete by category), Site Content (hero/about/contact info/Google rating), Offers (create/edit/delete/activate), Testimonials (create/edit/delete/visibility), Contact Messages (view/status/delete).

**Backend:** Express + TypeScript, MVC structure, MongoDB/Mongoose (8 models), Zod validation on every mutating endpoint, Cloudinary image upload/delete, httpOnly-cookie JWT authentication with role-gated middleware.

## Project Structure

```
alyasmin-nursery/
├── backend/
│   ├── src/
│   │   ├── config/          # env.ts, db.ts, cloudinary.ts
│   │   ├── controllers/     # auth, category, plant, gallery, testimonial, offer, content, contact, dashboard
│   │   ├── middleware/      # auth, validate, upload (multer), parseJsonFields, errorHandler, notFound
│   │   ├── models/          # User, Category, Plant, Gallery, Testimonial, Offer, SiteContent, Contact + subSchemas
│   │   ├── routes/          # one router per resource + root index.ts
│   │   ├── scripts/         # seedAdmin.ts, seedCatalog.ts
│   │   ├── utils/           # ApiError, asyncHandler, token (JWT+cookie), cloudinaryUpload
│   │   ├── validators/      # Zod schemas per resource
│   │   ├── app.ts
│   │   └── server.ts
│   ├── API.md                # full endpoint reference
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/placeholders/  # labeled dev-only image placeholders (SVG)
│   ├── src/
│   │   ├── api/              # one wrapper file per resource, axiosClient with withCredentials
│   │   ├── components/
│   │   │   ├── admin/        # forms, tables, image dropzone, dashboard stats
│   │   │   ├── layout/       # Navbar, Footer, PublicLayout, AdminSidebar, AdminLayout
│   │   │   ├── public/       # Hero, PlantCard, filters, lightbox gallery, contact form, etc.
│   │   │   └── ui/           # Button, Card, Input, Modal, Toast, Skeleton, EmptyState, ErrorState, Badge
│   │   ├── context/          # AuthContext, ToastContext
│   │   ├── hooks/            # useAuth, useFetch, useDebounce
│   │   ├── pages/admin/      # Dashboard, Plants (list+editor), Categories, Gallery, Content, Messages, Login
│   │   ├── pages/public/     # Home, About, Catalog, PlantDetails, Gallery, Services, Contact, NotFound
│   │   ├── routes/           # AppRouter, ProtectedRoute
│   │   ├── styles/           # theme.css (design tokens)
│   │   ├── types/            # shared TS types mirroring backend schemas
│   │   ├── App.tsx, main.tsx
│   ├── .env.example
│   └── package.json
│
└── README.md   (this file)
```

## Backend Setup

**Prerequisites:** Node.js 18+, a MongoDB Atlas cluster (or local MongoDB for dev), a Cloudinary account.

```bash
cd backend
cp .env.example .env       # fill in the values (see table below)
npm install
npm run seed:admin          # creates the first admin user
npm run seed:catalog        # optional: populates categories/plants/gallery/testimonials with placeholder data
npm run dev                 # starts the API on http://localhost:5000, auto-reloads on file changes
```

Other useful scripts:
```bash
npm run typecheck   # tsc --noEmit
npm run build        # compiles to dist/
npm start             # runs the compiled build (production)
```

Verify it's running: `GET http://localhost:5000/api/health`

### Required environment variables

Full descriptions and generation tips live in `backend/.env.example` — summary:

| Variable | Required in production? | Purpose |
|---|---|---|
| `NODE_ENV` | recommended | `development` \| `production` \| `test` |
| `PORT` | no (defaults to 5000) | Express listen port |
| `MONGODB_URI` | **yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | **yes** | Signs the admin session JWT — generate with `openssl rand -base64 48` |
| `JWT_EXPIRES_IN` | no (defaults to `7d`) | Session/cookie lifetime |
| `COOKIE_NAME` | no (defaults to `alyasmin_admin_token`) | Name of the httpOnly auth cookie |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | **yes** | Cloudinary image storage credentials |
| `CLIENT_URL` | **yes** | Deployed frontend origin — required for cross-origin cookie auth to work |
| `SEED_ADMIN_USERNAME` / `_EMAIL` / `_PASSWORD` | no (dev defaults exist) | Used only by `npm run seed:admin` |

In non-production environments, missing required variables fall back to clearly-labeled dev placeholders (see `src/config/env.ts`) so the server can boot for local scaffolding without every credential in hand. In production, a missing required variable makes the server fail fast at startup with a clear error rather than misbehaving silently.

## Frontend Setup

```bash
cd frontend
cp .env.example .env      # points at the backend API
npm install
npm run dev                # http://localhost:5173
```

Other useful scripts:
```bash
npm run build     # tsc -b && vite build -> dist/
npm run preview    # serve the production build locally
```

## API Documentation

See **[`backend/API.md`](backend/API.md)** for full request/response documentation of every endpoint — public and admin, across all 8 resources.

## Authentication Approach

JWT is issued by the backend on login and stored in an **httpOnly, secure cookie** — never in localStorage or a JS-readable header token.

- The frontend never sees or handles the raw token.
- `axiosClient` uses `withCredentials: true` so the cookie is sent/received automatically.
- `AuthContext` determines login state purely by asking the backend "who am I?" (`GET /api/auth/me`), which succeeds or 401s based on the cookie the browser already holds.
- `ProtectedRoute` blocks any `/admin/*` page from rendering until that check resolves.
- All mutating admin endpoints are gated by `verifyToken` + `requireAdmin` middleware.

To create the first admin locally:
```bash
cd backend
npm run seed:admin   # reads SEED_ADMIN_USERNAME / _EMAIL / _PASSWORD from .env, or uses dev defaults
```

## Image Upload Flow

Admin uploads (via `ImageDropzone` in the admin UI) → multipart/form-data to the backend → `multer` validates type (JPG/PNG/WebP) and size (max 5MB) in memory → buffer streamed to Cloudinary → `{ url, publicId }` saved on the MongoDB document → image appears on the site immediately via the returned Cloudinary URL. Deletes/replaces always remove the old Cloudinary asset first, then update MongoDB — never the other way around.

## Notes on Images

No real nursery photos are fabricated anywhere in this codebase. `frontend/public/placeholders/` contains simple labeled SVG placeholders (hero/plant/gallery) used only until real photos are uploaded through the admin panel to Cloudinary.

## Verification

See the final delivery report (provided alongside this package) for the full list of what was tested: TypeScript checks, production builds, route checks, and functional integration tests covering auth, CRUD, image upload wiring, and full user journeys — all passing as of this delivery.

## Known Limitations

- No live MongoDB Atlas or Cloudinary connection was available in the build environment — all backend logic was verified via schema validation and mocked-model integration tests (see delivery report). Run `npm run seed:admin` and `npm run seed:catalog` against your real Atlas cluster as a final smoke test before going live.
- Placeholder copy (marked `[טקסט זמני]` / `[نص مؤقت]`) is used wherever real business copy wasn't provided — replace via the admin Content Manager before launch.
- SEO is client-side only (document title/meta description per page via a small SPA-friendly helper); for full SSR meta tags/Open Graph previews, a server-rendering layer would need to be added separately.
