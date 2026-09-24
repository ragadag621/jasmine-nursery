import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Section } from '@/components/ui/Section';

import type { SiteContent } from '@/types/content.types';

interface AboutPreviewProps {
  content: SiteContent | null;
}

export function AboutPreview({ content }: AboutPreviewProps) {
  const { t, i18n } = useTranslation();

  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <Section
      containerSize="narrow"
      className="text-center"
    >
      <h2
        className="
          font-display
          text-[clamp(1.6rem,6vw,2.25rem)]
          leading-tight
          text-[var(--color-forest-800)]
        "
      >
        {t('home.aboutTitle')}
      </h2>

      <p
        className="
          mx-auto
          mt-4
          max-w-2xl
          text-[0.95rem]
          leading-7
          text-[var(--color-ink-600)]
          sm:text-base
          sm:leading-8
        "
      >
        {content?.aboutText?.[key] ?? t('about.fallback')}
      </p>

      <Link
        to="/contact"
        className="
          mt-5
          inline-flex
          min-h-11
          items-center
          gap-1.5
          px-2
          text-sm
          font-medium
          text-[var(--color-forest-700)]
          transition-all
          duration-200
          ease-[var(--ease-botanical)]
          hover:gap-2.5
          hover:text-[var(--color-forest-900)]
        "
      >
        <span>{t('nav.contact')}</span>
        <span aria-hidden="true">←</span>
      </Link>
    </Section>
  );
}