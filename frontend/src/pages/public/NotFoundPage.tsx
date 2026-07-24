import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="text-5xl" aria-hidden="true">🌿</span>
      <h1 className="font-display text-2xl text-[var(--color-forest-800)]">{t('notFound.title')}</h1>
      <p className="font-body text-sm text-[var(--color-ink-600)]">{t('notFound.desc')}</p>
      <Link to="/" className="mt-2 text-sm font-medium text-[var(--color-forest-700)] hover:underline">
        {t('nav.home')} ←
      </Link>
    </main>
  );
}
