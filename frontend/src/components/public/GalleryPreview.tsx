import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { fetchGallery } from '@/api/gallery.api';

import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';

export function GalleryPreview() {
  const { t, i18n } = useTranslation();

  const key = i18n.language === 'ar' ? 'ar' : 'he';

  const {
    data: items,
    status,
    error,
    refetch,
  } = useFetch(() => fetchGallery(), []);

  const preview = items?.slice(0, 4) ?? [];

  return (
    <Section tone="sage">
      <PageHeader
        as="h2"
        title={t('home.galleryTitle')}
      />

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square w-full"
              radius="var(--radius-media)"
            />
          ))}
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          message={error ?? undefined}
          onRetry={refetch}
        />
      )}

      {status === 'success' && preview.length === 0 && (
        <EmptyState title={t('home.galleryEmpty')} />
      )}

      {status === 'success' && preview.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {preview.map((item) => (
              <div
                key={item._id}
                className="
                  group
                  aspect-square
                  overflow-hidden
                  bg-[var(--color-cream-50)]
                  shadow-[var(--shadow-soft)]
                "
                style={{
                  borderRadius: 'var(--radius-media)',
                }}
              >
                <img
                  src={
                    item.images[0]?.url ||
                    '/placeholders/gallery-placeholder.svg'
                  }
                  alt={item.title[key]}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    ease-[var(--ease-botanical)]
                    md:group-hover:scale-110
                  "
                />
              </div>
            ))}
          </div>

          <div className="mt-6 text-center sm:mt-8">
            <Link
              to="/gallery"
              className="
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
              <span>{t('home.galleryViewAll')}</span>
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </>
      )}
    </Section>
  );
}