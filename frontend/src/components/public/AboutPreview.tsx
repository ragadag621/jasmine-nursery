import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { SiteContent } from '@/types/content.types';

interface AboutPreviewProps {
  content: SiteContent | null;
}

export function AboutPreview({ content }: AboutPreviewProps) {
  const { t, i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
      <h2 className="font-display mb-5 text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('home.aboutTitle')}
      </h2>
      <p className="text-lg leading-relaxed text-[var(--color-ink-600)]">
        {content?.aboutText?.[key] ?? t('about.fallback')}
      </p>
      <Link
        to="/about"
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-forest-700)] transition-all hover:gap-2 hover:text-[var(--color-forest-900)]"
      >
        {t('home.aboutReadMore')} ←
      </Link>
    </section>
  );
}
