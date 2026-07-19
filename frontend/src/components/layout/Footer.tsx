import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';

export function Footer() {
  const { data: content } = useFetch(fetchSiteContent, []);

  return (
    <footer className="mt-16 border-t border-[var(--color-sage-200)] bg-[var(--color-sage-100)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="font-display mb-2 text-lg text-[var(--color-forest-800)]">
            משתלת אליאסמין
          </h3>
          <p className="text-sm text-[var(--color-ink-600)]">مشتل الياسمين — ג׳ת</p>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-[var(--color-forest-800)]">יצירת קשר</h4>
          <ul className="space-y-1 text-sm text-[var(--color-ink-600)]">
            <li>{content?.phone ?? '054-664-3896'}</li>
            <li>{content?.address ?? "ג'ת, ישראל"}</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-[var(--color-forest-800)]">שעות פתיחה</h4>
          {content?.openingHours && content.openingHours.length > 0 ? (
            <ul className="space-y-1 text-sm text-[var(--color-ink-600)]">
              {content.openingHours.map((h) => (
                <li key={h.day}>
                  {h.day}: {h.open}–{h.close}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-ink-600)]">[שעות פתיחה יעודכנו בקרוב]</p>
          )}

          {content?.socialLinks && (
            <div className="mt-3 flex gap-3">
              {content.socialLinks.instagram && (
                <a
                  href={content.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-forest-700)] hover:underline"
                >
                  Instagram
                </a>
              )}
              {content.socialLinks.facebook && (
                <a
                  href={content.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-forest-700)] hover:underline"
                >
                  Facebook
                </a>
              )}
              {content.socialLinks.tiktok && (
                <a
                  href={content.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--color-forest-700)] hover:underline"
                >
                  TikTok
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--color-sage-200)] py-4 text-center text-xs text-[var(--color-ink-600)]">
        © {new Date().getFullYear()} משתלת אליאסמין | مشتل الياسمين
      </div>
    </footer>
  );
}
