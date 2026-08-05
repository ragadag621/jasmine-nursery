import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Single Axios instance shared by every api/*.api.ts file.
 *
 * Auth note: this app uses httpOnly, secure cookies for the admin JWT
 * (set by the backend on /auth/login). The token is NEVER stored in
 * localStorage or attached manually via an Authorization header — that's
 * the whole point of httpOnly cookies (client-side JS can't read them,
 * which limits XSS token theft). `withCredentials: true` is what makes
 * the browser actually send/receive that cookie on cross-origin requests
 * (frontend on Vercel, backend on Render).
 *
 * IMPORTANT: no default Content-Type header is set here on purpose.
 * Axios infers it per-request from the payload: plain JS objects get
 * `application/json` automatically, while a `FormData` payload (used by
 * every image-upload endpoint) is left alone so the browser attaches the
 * correct `multipart/form-data; boundary=...` header itself. Setting a
 * fixed `application/json` default here previously made axios convert
 * every FormData upload into a plain JSON object before sending it —
 * multer never saw multipart data, so uploaded files were silently
 * dropped on every create/update call that included an image.
 */
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * A 401 here means "the httpOnly session cookie is missing/expired" —
 * there is no client-side token to inspect ahead of time, so every
 * protected request just gets made and this interceptor reacts to the
 * result. AuthContext listens for this event to clear local admin state
 * and redirect to /admin/login.
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);
