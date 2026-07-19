import { useFetch } from '@/hooks/useFetch';
import { fetchPlants } from '@/api/plants.api';
import { PlantCard } from './PlantCard';
import { PlantCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export function FeaturedPlants() {
  const { data, status, error, refetch } = useFetch(
    () => fetchPlants({ sort: 'newest', limit: 4 }),
    []
  );

  const featured = data?.plants.filter((p) => p.featured) ?? data?.plants ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-display mb-8 text-center text-2xl text-[var(--color-forest-800)] md:text-3xl">
        צמחים נבחרים
      </h2>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlantCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && featured.length === 0 && (
        <EmptyState title="אין עדיין צמחים להצגה" description="בקרוב יתווספו צמחים לקטלוג" />
      )}

      {status === 'success' && featured.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.slice(0, 4).map((plant) => (
            <PlantCard key={plant._id} plant={plant} />
          ))}
        </div>
      )}
    </section>
  );
}
