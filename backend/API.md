# API Documentation — Full Reference

Base URL:
- Local: `http://localhost:5000/api`
- Production: `https://<your-render-service>.onrender.com/api`

## Conventions

**Success response shape:**
```json
{ "success": true, "data": { ... }, "message": "optional", "meta": "optional (paginated lists only)" }
```

**Error response shape:**
```json
{ "success": false, "message": "Human-readable summary", "errors": ["field: detail", "..."] }
```

**Authentication:** this API uses an **httpOnly, secure cookie** to carry the admin session's JWT — never a bearer token in headers, never `localStorage`. Any client calling protected endpoints must send requests with credentials included (`credentials: 'include'` / Axios `withCredentials: true`) after a successful `POST /auth/login`.

**File uploads:** endpoints marked *(multipart)* accept `multipart/form-data`. Bilingual/nested fields (e.g. `name`, `description`, `care`) must be sent as JSON-stringified strings — the backend parses them back into objects before validation. Image fields accept JPG/PNG/WebP, max 5MB each.

---

## Health

### `GET /health`
Public. Confirms the API is running.

---

## Auth

### `POST /auth/login`
Public. Body: `{ username, password }`. Sets the httpOnly session cookie on success. Returns the admin profile (never the token). `401` on any wrong credential (generic message, no user enumeration).

### `POST /auth/logout`
Public. Clears the session cookie.

### `GET /auth/me`
**Protected.** Returns the current admin's profile. `401` if no/invalid/expired cookie.

---

## Categories

### `GET /categories`
Public. Returns all categories, sorted alphabetically (Hebrew name).

### `POST /categories` *(multipart)* — **Protected**
Fields: `name` (JSON `{he,ar}`), `slug`, `description` (JSON, optional), `image` (file, optional). `409` on duplicate slug.

### `PUT /categories/:id` *(multipart)* — **Protected**
Same fields, all optional (partial update). New `image` replaces the old one (old Cloudinary asset deleted first).

### `DELETE /categories/:id` — **Protected**
Deletes the category and its Cloudinary image.

---

## Plants

### `GET /plants`
Public. Query: `category`, `search`, `sort` (`newest|name_asc|name_desc|price_asc|price_desc`), `page`, `limit` (max 50). Never returns hidden plants.

### `GET /plants/:slug`
Public. `404` if not found or hidden.

### `GET /plants/admin/all` — **Protected**
Same query params as above, but includes hidden plants. Used by the admin plant table.

### `GET /plants/admin/:id` — **Protected**
Fetch a single plant by id (including hidden), for the admin edit form.

### `POST /plants` *(multipart)* — **Protected**
Fields: `name`, `description`, `care` (JSON), `slug`, `category` (id), `price` (optional), `availability`, `featured`, `images` (0–10 files). `409` on duplicate slug.

### `PUT /plants/:id` *(multipart)* — **Protected**
Partial update. New `images` files are appended after existing ones.

### `DELETE /plants/:id` — **Protected**
Deletes the plant and all its Cloudinary images.

### `PATCH /plants/:id/hide` — **Protected**
Toggles `isHidden` without deleting.

### `DELETE /plants/:id/images/:imageId` — **Protected**
Removes a single image from a plant's gallery.

---

## Gallery

### `GET /gallery`
Public. Query: `category` (optional).

### `POST /gallery` *(multipart)* — **Protected**
Fields: `title` (JSON), `category`, `images` (1+ files, required).

### `PUT /gallery/:id` *(multipart)* — **Protected**
Partial update; new images appended.

### `DELETE /gallery/:id` — **Protected**

### `DELETE /gallery/:id/images/:imageId` — **Protected**

---

## Testimonials

### `GET /testimonials`
Public. Only returns `isVisible: true` entries.

### `GET /testimonials/all` — **Protected**
All testimonials, including hidden ones.

### `POST /testimonials` — **Protected**
Body: `{ customerName, rating (1-5), text: {he,ar}, isVisible }`.

### `PUT /testimonials/:id` — **Protected**
### `DELETE /testimonials/:id` — **Protected**

---

## Offers

### `GET /offers`
Public. Query: `active` (`true`/`false`, optional).

### `POST /offers` *(multipart)* — **Protected**
Fields: `title`, `description` (JSON), `isActive`, `image` (optional).

### `PUT /offers/:id` *(multipart)* — **Protected**
### `DELETE /offers/:id` — **Protected**

---

## Site Content (singleton)

### `GET /content`
Public. Returns the single SiteContent document (bootstraps placeholder content on first call).

### `PUT /content` *(multipart)* — **Protected**
Fields: `heroTitle`, `heroSubtitle`, `aboutText` (all JSON `{he,ar}`), `phone`, `whatsapp`, `address`, `openingHours` (JSON array, optional), `socialLinks` (JSON, optional), `googleRating`, `googleReviewCount`, `heroImage` (file, optional — replaces existing).

---

## Contact

### `POST /contact`
Public. Body: `{ name, phone, email? , message }`. Anyone can submit.

### `GET /contact` — **Protected**
Query: `status` (`new|read|resolved`, optional), `page`, `limit`.

### `PATCH /contact/:id/status` — **Protected**
Body: `{ status }`.

### `DELETE /contact/:id` — **Protected**

---

## Dashboard

### `GET /dashboard/stats` — **Protected**
Returns `{ plants, categories, galleryImages, newMessages, totalMessages }`.

---

## Quick manual test (curl)

```bash
# Login and save the cookie to a jar
curl -c cookies.txt -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"ChangeMe123!"}'

# Use the saved cookie to call a protected endpoint
curl -b cookies.txt http://localhost:5000/api/dashboard/stats

# Create a category (multipart, no image)
curl -b cookies.txt -X POST http://localhost:5000/api/categories \
  -F 'name={"he":"עציצים","ar":"أصص"}' \
  -F 'slug=pots'

# Logout
curl -b cookies.txt -X POST http://localhost:5000/api/auth/logout
```
