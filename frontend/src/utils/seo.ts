const SITE_NAME = 'משתלת אליאסמין | مشتل الياسمين';

/**
 * Lightweight SEO helper for a client-rendered SPA: sets document.title and
 * upserts the meta description tag. Full SSR meta/OG tag generation is out
 * of scope for a Vite SPA — this covers what's achievable client-side per
 * the SEO requirements (meta titles/descriptions), with the static tags in
 * index.html covering the crawlable defaults.
 */
export function setPageMeta(pageTitle: string, description?: string): void {
  document.title = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME;

  if (description) {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }
}
