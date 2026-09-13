import { useTranslation } from 'react-i18next';

import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';

interface MapEmbedProps {
  mapEmbedUrl?: string;
  address?: string;
  tone?: 'default' | 'sage' | 'cream-alt';
}

export function MapEmbed({
  mapEmbedUrl,
  address,
  tone = 'default',
}: MapEmbedProps) {
  const { t } = useTranslation();

  return (
    <Section tone={tone}>
      <PageHeader
        as="h2"
        title={t('home.mapTitle')}
      />

      <div
        className="
          overflow-hidden
          border
          border-[var(--color-border)]
          shadow-[var(--shadow-soft)]
        "
        style={{
          borderRadius: 'var(--radius-media)',
        }}
      >
        {mapEmbedUrl ? (
          <iframe
            src={mapEmbedUrl}
            title={t('home.mapIframeTitle')}
            width="100%"
            height="320"
            className="block w-full sm:h-[360px] md:h-[400px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div
            className="
              flex
              min-h-52
              items-center
              justify-center
              bg-[var(--color-sage-100)]
              px-5
              py-10
              text-center
              text-sm
              leading-6
              text-[var(--color-ink-600)]
              sm:min-h-64
              sm:text-base
            "
          >
            <p>
              {address ?? t('home.mapFallbackAddress')}
              <span className="mx-1" aria-hidden="true">
                —
              </span>
              {t('home.mapFallback')}
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}