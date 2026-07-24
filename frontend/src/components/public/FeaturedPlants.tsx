import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchPlants } from '@/api/plants.api';
import { PlantCard } from './PlantCard';
import { PlantCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export function FeaturedPlants() {
  const { t } = useTranslation();
  const { data, status, error, refetch } = useFetch(
    () => fetchPlants({ sort: 'newest', limit: 4 }),
    []
  );

  const featured = data?.plants.filter((p) => p.featured) ?? data?.plants ?? [];

  return (
    <section className="bg-[var(--color-cream-50)] px-4 py-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-10 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
          {t('home.featuredTitle')}
        </h2>

        {status === 'loading' && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlantCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

        {status === 'success' && featured.length === 0 && (
          <EmptyState title={t('home.featuredEmpty')} description={t('home.featuredEmptyDesc')} />
        )}

        {status === 'success' && featured.length > 0 && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featured.slice(0, 4).map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
