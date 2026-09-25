
# Al-Yasmin Nursery — Project Documentation

## משתלת אליאסמין | مشتل الياسمين

Full-stack bilingual nursery website and admin CMS for **Al-Yasmin Nursery (Jatt, Israel)**.

The project provides a responsive public website for browsing the nursery's catalog, offers, gallery and services, together with a protected administration dashboard for managing the site's content and data.

---

## Project Status

**Status: Complete and deployed**

The project includes:

- Responsive public website
- Protected admin dashboard
- Full CRUD management for all major resources
- Arabic + Hebrew localization
- RTL/LTR support
- MongoDB Atlas persistence
- Cloudinary image management
- JWT authentication with httpOnly cookies
- Product/catalog management
- Plant-level and general offers
- Automatic plant slug generation
- Gallery management
- Testimonials management
- Contact form and message management
- Site content management
- WhatsApp integration for customer messages
- Validation and error handling
- Production builds
- Automated backend integration tests
- Vercel frontend deployment
- Render backend deployment

---

## Live Project

- **Public Website:** https://jasmine-nursery.vercel.app/
- **Backend API:** https://jasmine-nursery.onrender.com/api

> The current backend deployment uses Render's free tier. Because free services may sleep after periods of inactivity, the first request after inactivity can take longer while the backend wakes up. For a commercial production deployment, a non-sleeping backend hosting plan is recommended.

---

# 1. Project Overview

Al-Yasmin Nursery is a full-stack web platform designed for a real nursery business.

The system separates the public customer experience from the internal administration system.

### Public side

Customers can:

- Browse the nursery catalog
- Search and filter products
- View plant/product details
- View current offers
- Browse the image gallery
- Read about available services
- Contact the nursery
- View business information and opening hours
- Use WhatsApp contact functionality where available
- Switch between Arabic and Hebrew
- Use the site on desktop, tablet and mobile

### Admin side

Authorized administrators can:

- View dashboard statistics
- Manage plants and catalog items
- Manage categories
- Upload and manage images
- Manage gallery content
- Manage testimonials
- Manage offers
- Manage website content
- View and manage contact messages
- Control product visibility
- Manage plant pricing and discounts

---

# 2. Main Features

## Public Website

### Home

The homepage contains:

- Hero section
- Nursery introduction
- Featured catalog content
- Offers
- Services
- Gallery previews
- Testimonials
- Contact information
- Responsive navigation and footer

The hero supports dynamic content and images managed through the admin dashboard.

A subtle visual overlay/glass effect is used behind hero text when necessary to preserve readability over background images.

---

## Catalog

The catalog provides a unified browsing experience for nursery products.

Supported categories include:

- Plants
- Pots
- Soil
- Accessories

Users can:

- Search products
- Filter by category
- Sort products
- Browse product cards
- Open individual product pages
- View availability
- View pricing
- View offers where applicable

---

## Plant / Product Details

Each product can contain:

- Localized name
- Description
- Images
- Category
- Price
- Previous price when discounted
- Availability
- Water requirements
- Sunlight requirements
- Scientific name where applicable
- Additional product information

Plant detail pages use automatically generated slugs for cleaner URLs.

---

## Automatic Slugs

Plant/product slugs are generated automatically from available names such as:

- Scientific name
- Localized plant name
- Product name

Existing valid slugs are preserved.

New slugs are checked for uniqueness before being stored.

For names that are not suitable for direct Latin-character slugs, the system generates a deterministic fallback slug so that every product can still receive a stable URL.

Example:

```text
/plants/monstera-deliciosa
````

This avoids requiring administrators to manually enter URLs.

---

# 3. Offers System

The project supports multiple types of offers.

### General / Group Offers

Offers can apply to groups of products or categories.

### Fixed-Price Offers

A product or offer can be presented with a special fixed price.

### Plant-Level Discounts

Individual plants can have:

* New price
* Original price
* Discount period
* Start date
* End date

The original price can be displayed with a strikethrough while the discounted price is highlighted.

The system keeps existing offer functionality while allowing more specific product-level promotions.

---

# 4. Gallery

The gallery supports:

* Multiple image uploads
* Gallery categories
* Image deletion
* Cloudinary storage
* Responsive image grids
* Full-size lightbox viewing

Images are stored externally in Cloudinary rather than inside the application repository.

---

# 5. Testimonials

Administrators can:

* Create testimonials
* Edit testimonials
* Delete testimonials
* Control testimonial visibility

Testimonials support localized content where applicable.

---

# 6. Contact System

The public contact form allows customers to send messages directly to the nursery.

Administrators can:

* View messages
* Track message status
* Delete messages
* Open WhatsApp directly for supported Israeli phone numbers

Israeli phone numbers are normalized before generating WhatsApp links so that local formats can be converted to the appropriate international `+972` format.

---

# 7. Site Content Management

The admin dashboard provides centralized management of important website content.

Managed content includes:

* Website name
* Logo
* Hero content
* About/introduction content
* Contact information
* Social links
* Map information
* Opening hours
* Other configurable website information

Localized fields support both:

* Arabic
* Hebrew

The current public website uses:

```text
Arabic: مشتل الياسمين
Hebrew: משתלת אליאסמין
```

---

# 8. Internationalization

The frontend supports:

* Arabic
* Hebrew

The application dynamically switches between:

* RTL for Arabic/Hebrew content
* LTR where appropriate

Translations cover UI content including:

* Navigation
* Buttons
* Forms
* Validation messages
* Loading states
* Empty states
* Error messages
* Admin interface
* Catalog filters
* Offers
* Product information

Any future frontend changes should preserve both language versions.

---

# 9. Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router
* Custom i18n/localization system

## Backend

* Node.js 20
* Express
* TypeScript
* MongoDB
* Mongoose 8
* Zod
* JWT
* bcryptjs
* Multer
* Cloudinary
* Helmet
* CORS
* express-rate-limit
* cookie-parser
* Morgan

## Infrastructure

* Vercel — frontend hosting
* Render — backend hosting
* MongoDB Atlas — database
* Cloudinary — image storage/CDN
* GitHub — source control

---

# 10. Architecture

The application follows a separated frontend/backend architecture.

```text
                         ┌─────────────────────┐
                         │       Browser       │
                         │ Desktop / Mobile    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Vercel        │
                         │      React/Vite     │
                         └──────────┬──────────┘
                                    │
                                    │ HTTPS / API
                                    ▼
                         ┌─────────────────────┐
                         │       Render        │
                         │ Express / Node.js   │
                         └───────┬─────┬───────┘
                                 │     │
                    ┌────────────┘     └──────────────┐
                    ▼                                 ▼
          ┌──────────────────┐              ┌──────────────────┐
          │   MongoDB Atlas  │              │    Cloudinary    │
          │   Application DB │              │ Image Storage    │
          └──────────────────┘              └──────────────────┘
```

---

# 11. Project Structure

```text
alyasmin-nursery/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── db.ts
│   │   │   └── cloudinary.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth
│   │   │   ├── category
│   │   │   ├── plant
│   │   │   ├── gallery
│   │   │   ├── testimonial
│   │   │   ├── offer
│   │   │   ├── content
│   │   │   ├── contact
│   │   │   └── dashboard
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth
│   │   │   ├── validate
│   │   │   ├── upload
│   │   │   ├── parseJsonFields
│   │   │   ├── errorHandler
│   │   │   └── notFound
│   │   │
│   │   ├── models/
│   │   │   ├── User
│   │   │   ├── Category
│   │   │   ├── Plant
│   │   │   ├── Gallery
│   │   │   ├── Testimonial
│   │   │   ├── Offer
│   │   │   ├── SiteContent
│   │   │   └── Contact
│   │   │
│   │   ├── routes/
│   │   │   └── resource routers
│   │   │
│   │   ├── scripts/
│   │   │   └── seedAdmin.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError
│   │   │   ├── asyncHandler
│   │   │   ├── token
│   │   │   └── cloudinaryUpload
│   │   │
│   │   ├── validators/
│   │   │   └── Zod schemas
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── API.md
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   └── placeholders/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── layout/
│   │   │   ├── public/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── public/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── PROJECT_DOCUMENTATION.md
```

---

# 12. Backend Architecture

The backend follows a modular MVC-style architecture.

```text
Request
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ├── Authentication
   ├── Authorization
   ├── Validation
   └── File Upload
   │
   ▼
Controller
   │
   ▼
Mongoose Model
   │
   ▼
MongoDB
```

Errors are passed through centralized error-handling middleware.

Async controller operations use a shared async handler pattern.

---

# 13. Database Models

The application currently manages the following main MongoDB collections/models:

* User
* Category
* Plant
* Gallery
* Testimonial
* Offer
* SiteContent
* Contact

Additional sub-schemas are used for localized and nested data.

Mongoose is responsible for:

* Schema definitions
* Type-safe document structures
* Database validation
* Relationships/references where applicable
* Querying
* Persistence

---

# 14. Validation

All important mutating API endpoints use Zod validation.

Validation is performed before business logic reaches the database.

This protects the API against:

* Missing required fields
* Invalid data types
* Invalid URLs
* Invalid localized structures
* Invalid dates
* Invalid enum values
* Malformed request payloads

The environment configuration is also validated with Zod during application startup.

In production, invalid required environment configuration causes the backend to fail fast rather than start with incomplete settings.

---

# 15. Authentication & Authorization

The admin authentication system uses JWT stored in an httpOnly cookie.

The token is **not stored in localStorage** and is never exposed to frontend JavaScript.

### Authentication flow

```text
Admin Login
     │
     ▼
POST /api/auth/login
     │
     ▼
Validate credentials
     │
     ▼
Generate JWT
     │
     ▼
Set httpOnly cookie
     │
     ▼
Browser stores cookie
     │
     ▼
GET /api/auth/me
     │
     ▼
Authenticated Admin
```

The frontend uses:

```ts
withCredentials: true
```

so the browser automatically sends the authentication cookie with API requests.

Protected admin routes use:

* `verifyToken`
* `requireAdmin`

The frontend additionally uses:

* `AuthContext`
* `ProtectedRoute`

to prevent unauthorized access to the admin interface.

---

# 16. Cookie Security

In production, authentication cookies use:

* `httpOnly`
* `secure`
* `sameSite: "none"`
* Explicit cookie path
* Limited lifetime

The backend also validates the configured frontend origin through `CLIENT_URL`.

This configuration supports the deployed frontend/backend architecture while preventing frontend JavaScript from reading the authentication token.

---

# 17. Image Management

Images are stored using Cloudinary.

The application does not store uploaded image binaries inside MongoDB.

### Upload flow

```text
Admin selects image
        │
        ▼
Frontend ImageDropzone
        │
        ▼
multipart/form-data
        │
        ▼
Multer
        │
        ├── File type validation
        └── File size validation
        │
        ▼
Cloudinary
        │
        ▼
Receive URL + publicId
        │
        ▼
MongoDB stores image metadata
```

Supported image formats:

* JPG
* PNG
* WebP

Maximum upload size:

```text
5 MB
```

When an image is replaced or deleted, the corresponding Cloudinary asset is also removed where applicable.

This prevents unused uploaded assets from accumulating unnecessarily.

---

# 18. Placeholder Images

The repository does not fabricate real nursery photography.

Development placeholders are stored under:

```text
frontend/public/placeholders/
```

These are simple labeled SVG assets intended for development/demo fallback use.

Real nursery photography can be uploaded through the admin dashboard and stored in Cloudinary.

---

# 19. Admin Dashboard

The admin area is available under:

```text
/admin
```

Access is protected by authentication.

### Dashboard

Displays high-level statistics and administrative information.

### Plants / Catalog

Administrators can:

* Create products
* Edit products
* Delete products
* Hide/show products
* Manage pricing
* Manage availability
* Upload multiple images
* Manage localized information

### Categories

Administrators can:

* Create categories
* Edit categories
* Delete categories
* Upload category images

### Gallery

Administrators can:

* Upload multiple images
* Organize images by category
* Delete images

### Offers

Administrators can:

* Create offers
* Edit offers
* Delete offers
* Activate/deactivate offers
* Configure product-level discounts
* Configure general/fixed-price promotions

### Testimonials

Administrators can:

* Add testimonials
* Edit testimonials
* Delete testimonials
* Control visibility

### Site Content

Administrators can manage configurable public website content.

### Messages

Administrators can:

* View contact messages
* Update message status
* Delete messages
* Contact customers through WhatsApp where supported

---

# 20. Frontend Architecture

The frontend is organized around reusable React components and page-level modules.

### API Layer

Each major backend resource has its own frontend API wrapper.

A shared Axios client handles:

* Base URL
* Credentials
* Authentication cookies
* Centralized unauthorized-response handling

### Context

Current contexts include:

* `AuthContext`
* `ToastContext`

### Hooks

Reusable hooks include:

* `useAuth`
* `useFetch`
* `useDebounce`

### UI Components

Reusable components include:

* Button
* Card
* Input
* Modal
* Toast
* Skeleton
* EmptyState
* ErrorState
* Badge

This reduces duplicated UI logic across public and admin pages.

---

# 21. Responsive Design

The website is designed mobile-first and supports:

* Desktop
* Laptop
* Tablet
* Mobile

Important areas were tested on both desktop and mobile browsers, including the admin interface.

The navigation, catalog, cards, forms, gallery, dashboard and content management screens adapt to smaller viewports.

---

# 22. Design System

The frontend uses a botanical-inspired visual design system built around:

* Natural green tones
* Cream backgrounds
* Terracotta accents
* Soft cards
* Rounded UI elements
* Subtle shadows
* Glass/blur effects where appropriate
* Clear typography
* Responsive spacing

Design tokens are centralized in:

```text
frontend/src/styles/theme.css
```

---

# 23. API Documentation

A complete endpoint reference is maintained in:

```text
backend/API.md
```

The API is exposed under:

```text
/api
```

Health check:

```http
GET /api/health
```

Authentication endpoints include:

```http
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

The remaining API resources cover:

* Plants
* Categories
* Gallery
* Testimonials
* Offers
* Site Content
* Contact
* Dashboard

Refer to `backend/API.md` for the complete request/response reference.

---

# 24. Local Development

## Requirements

Install:

* Node.js 20+
* npm
* MongoDB Atlas account or local MongoDB
* Cloudinary account

---

## Backend

```bash
cd backend

npm install

npm run dev
```

The development API runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## Frontend

Open a second terminal:

```bash
cd frontend

npm install

npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

---

# 25. Environment Variables

## Backend

Create:

```text
backend/.env
```

based on:

```text
backend/.env.example
```

Required production configuration:

| Variable                | Description                            |
| ----------------------- | -------------------------------------- |
| `NODE_ENV`              | `development`, `test`, or `production` |
| `PORT`                  | Express server port                    |
| `MONGODB_URI`           | MongoDB connection string              |
| `JWT_SECRET`            | Secret used to sign JWTs               |
| `JWT_EXPIRES_IN`        | JWT lifetime                           |
| `COOKIE_NAME`           | Authentication cookie name             |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                  |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                     |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                  |
| `CLIENT_URL`            | Public frontend URL                    |

Seed configuration may additionally include:

```text
SEED_ADMIN_USERNAME
SEED_ADMIN_EMAIL
SEED_ADMIN_PASSWORD
```

### Important

Never commit:

```text
.env
```

or any production credentials to Git.

---

# 26. Admin Seed

To create the first administrator locally:

```bash
cd backend
npm run seed:admin
```

The script uses the configured seed environment variables.

For production, use a strong unique admin password and do not expose credentials in source control.

---

# 27. Useful Backend Commands

```bash
npm run dev
```

Start development server with automatic reload.

```bash
npm run test
```

Run backend test suite.

```bash
npm run typecheck
```

Run TypeScript checks without generating files.

```bash
npm run build
```

Create the production TypeScript build.

```bash
npm start
```

Run the compiled production server.

```bash
npm run seed:admin
```

Create the initial admin user.

---

# 28. Useful Frontend Commands

```bash
npm run dev
```

Start Vite development server.

```bash
npm run build
```

Run TypeScript/Vite production build.

```bash
npm run preview
```

Preview the production build locally.

---

# 29. Production Build

The backend is compiled with TypeScript.

Current backend TypeScript configuration uses:

```text
rootDir: .
outDir: dist
```

Therefore the compiled server entry is:

```text
dist/src/server.js
```

Production start command:

```bash
node dist/src/server.js
```

The frontend production build is generated into:

```text
frontend/dist/
```

---

# 30. Deployment

## Frontend

The frontend is deployed through Vercel.

The project root for the Vercel deployment is:

```text
frontend
```

The Vercel configuration also handles SPA routing and API proxying.

---

## Backend

The backend is deployed through Render.

Render configuration:

```text
Service Type: Web Service
Runtime: Node
Root Directory: backend
Branch: main
```

Build command:

```bash
npm install --include=dev && npm run build
```

Start command:

```bash
node dist/src/server.js
```

The backend runs using Node.js 20.

---

# 31. Deployment Architecture

```text
GitHub
   │
   ├──────────────► Vercel
   │                 │
   │                 │ React frontend
   │                 ▼
   │              Browser
   │                 │
   │                 │ API requests
   │                 ▼
   └──────────────► Render
                     │
                     ├── Express API
                     │
                     ├── MongoDB Atlas
                     │
                     └── Cloudinary
```

---

# 32. Render Free-Tier Consideration

The current demonstration backend uses Render's free tier.

Free hosting can sleep after inactivity, which means:

```text
First visitor
     │
     ▼
Frontend loads
     │
     ▼
API request
     │
     ▼
Backend is sleeping
     │
     ▼
Backend wakes up
     │
     ▼
API responds
```

This can make the first page load feel slower than subsequent requests.

This is a hosting characteristic rather than an application bug.

For a commercial client deployment, the backend should use a non-sleeping production hosting configuration.

---

# 33. Testing & Verification

The project was tested through automated backend integration tests, TypeScript checks and production builds.

### API verification

| Resource        | Tests |
| --------------- | ----: |
| Content API     | 13/13 |
| Plant API       | 23/23 |
| Gallery API     | 17/17 |
| Testimonial API | 20/20 |
| Dashboard API   |   6/6 |

### Backend test suite

```text
169 / 170 tests passed
```

The remaining test is a known pre-existing assertion issue involving comparison of a Mongoose localized subdocument against a plain JavaScript object.

The API behavior and persisted values are correct; the failing assertion is related to the test's object comparison rather than the application behavior.

### Frontend

Verified:

* Production build
* TypeScript compilation
* Routing
* Responsive layouts
* Public pages
* Admin pages
* Authentication flow
* API integration

Frontend linting passed with two existing Fast Refresh warnings.

---

# 34. Security Measures

The application includes several baseline security measures:

* JWT authentication
* httpOnly authentication cookies
* Secure cookies in production
* Role-based admin authorization
* Zod request validation
* Environment validation
* Helmet security headers
* CORS configuration
* Rate limiting
* Password hashing with bcrypt
* File type validation
* File size validation
* Centralized error handling
* No authentication tokens stored in localStorage

Secrets and credentials are provided through environment variables.

---

# 35. Error Handling

The backend includes centralized error handling for:

* Validation failures
* Authentication failures
* Authorization failures
* Missing resources
* Invalid routes
* Database errors
* Upload errors
* Unexpected server errors

The frontend provides reusable states for:

* Loading
* Empty results
* Failed requests
* Form validation
* Unauthorized sessions

---

# 36. SEO

The current frontend uses SPA-friendly metadata management.

Pages can update:

* Document title
* Meta description

The project currently does not use server-side rendering.

For a future SEO-focused version, the project could be extended with:

* Server-side rendering
* Static generation
* Open Graph metadata
* Twitter/X card metadata
* Structured data
* XML sitemap generation
* Advanced search-engine optimization

SEO is not currently the primary focus of the application.

---

# 37. Current Limitations

The current project intentionally focuses on the nursery website and content management rather than full e-commerce functionality.

It does not currently include:

* Online checkout
* Shopping cart
* Online payments
* Customer accounts
* Order management
* Delivery management
* Inventory synchronization with an external ERP/POS

The current catalog is primarily intended for product discovery, offers and direct customer contact.

---

# 38. Future Enhancements

Possible future improvements include:

### E-commerce

* Shopping cart
* Online checkout
* Payment integration
* Customer accounts
* Orders
* Delivery management

### Inventory

* Real-time stock tracking
* Inventory history
* Low-stock notifications
* Supplier management

### Marketing

* Newsletter integration
* Promotional campaigns
* Customer analytics
* Advanced offers
* Coupon codes

### SEO

* SSR/SSG
* Open Graph
* Structured data
* Sitemap
* Search optimization

### Analytics

* Google Analytics
* Product views
* Popular products
* Contact conversion tracking
* Offer performance

### Infrastructure

* Non-sleeping production backend
* Automated CI/CD
* Monitoring
* Error tracking
* Automated backups

---

# 39. Development Principles

The project follows several development principles:

### Reusability

Common UI and backend logic is extracted into reusable components, hooks, middleware and utilities.

### Validation

Input is validated before reaching application/database logic.

### Separation of concerns

Frontend, API, business logic, persistence and infrastructure responsibilities remain separated.

### Security by default

Authentication tokens are not exposed to client-side JavaScript.

### Localization

User-facing functionality must remain available in both supported languages.

### Responsive design

Public and administrative interfaces are designed for multiple screen sizes.

### Maintainability

The project is structured so that new resources and features can be added without rewriting the entire application.

---

# 40. Repository Documentation

The repository documentation is intentionally separated into two levels.

### Main README

`README.md`

The main README is intended to provide a concise, portfolio/company-facing overview of the project.

### Technical Documentation

`PROJECT_DOCUMENTATION.md`

This document contains:

* Architecture
* Features
* Setup
* Environment configuration
* Authentication
* Image handling
* API information
* Testing
* Deployment
* Security
* Limitations
* Future improvements

### API Reference

`backend/API.md`

Contains the detailed API endpoint documentation.

---

# 41. Project Goals

The project was built to demonstrate a complete real-world full-stack workflow rather than a collection of isolated frontend components.

The implementation covers the complete path from:

```text
Business requirements
        ↓
UI / UX
        ↓
React frontend
        ↓
REST API
        ↓
Authentication
        ↓
Validation
        ↓
MongoDB
        ↓
Cloudinary
        ↓
Deployment
        ↓
Testing
```

The result is a maintainable bilingual CMS-driven website that can be adapted to similar small-business websites and future commercial projects.

---

# 42. Author

**Raghad Aghbaria**

B.Sc. Computer Science & Mathematics

Full-stack development project focused on:

* React
* TypeScript
* Node.js
* Express
* MongoDB
* REST APIs
* Authentication
* Cloudinary
* Responsive web development

---

