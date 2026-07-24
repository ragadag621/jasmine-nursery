import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchGallery } from '@/api/gallery.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export function GalleryPreview() {
  const { t, i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';
  const { data: items, status, error, refetch } = useFetch(() => fetchGallery(), []);
  const preview = items?.slice(0, 4) ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <h2 className="font-display mb-10 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('home.galleryTitle')}
      </h2>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && preview.length === 0 && <EmptyState title={t('home.galleryEmpty')} />}

      {status === 'success' && preview.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {preview.map((item) => (
              <div
                key={item._id}
                className="aspect-square overflow-hidden rounded-2xl bg-[var(--color-sage-100)] shadow-[var(--shadow-soft)]"
              >
                <img
                  src={item.images[0]?.url || '/placeholders/gallery-placeholder.svg'}
                  alt={item.title[key]}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-botanical)] hover:scale-110"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-forest-700)] transition-all hover:gap-2 hover:text-[var(--color-forest-900)]"
            >
              {t('home.galleryViewAll')} ←
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
