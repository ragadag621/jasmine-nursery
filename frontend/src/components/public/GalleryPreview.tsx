import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { fetchGallery } from '@/api/gallery.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export function GalleryPreview() {
  const { data: items, status, error, refetch } = useFetch(() => fetchGallery(), []);
  const preview = items?.slice(0, 4) ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-display mb-8 text-center text-2xl text-[var(--color-forest-800)] md:text-3xl">
        גלריה
      </h2>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && preview.length === 0 && <EmptyState title="הגלריה תתעדכן בקרוב" />}

      {status === 'success' && preview.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {preview.map((item) => (
              <div key={item._id} className="aspect-square overflow-hidden rounded-xl bg-[var(--color-sage-100)]">
                <img
                  src={item.images[0]?.url || '/placeholders/gallery-placeholder.svg'}
                  alt={item.title.he}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/gallery" className="text-sm font-medium text-[var(--color-forest-700)] hover:underline">
              לצפייה בגלריה המלאה ←
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
