import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { fetchPlants } from '@/api/plants.api';

import { PlantCard } from './PlantCard';

import {
  PlantCardSkeleton,
} from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';

export function FeaturedPlants() {
  const { t } = useTranslation();

  const {
    data,
    status,
    error,
    refetch,
  } = useFetch(
    () => fetchPlants({ sort: 'newest', limit: 4 }),
    []
  );

  const plants = data?.plants ?? [];

  const featuredPlants = plants.filter((plant) => plant.featured);

  const displayedPlants =
    featuredPlants.length > 0 ? featuredPlants : plants;

  return (
    <Section tone="cream-alt">
      <PageHeader
        as="h2"
        title={t('home.featuredTitle')}
      />

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <PlantCardSkeleton key={index} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          message={error ?? undefined}
          onRetry={refetch}
        />
      )}

      {status === 'success' && displayedPlants.length === 0 && (
        <EmptyState
          title={t('home.featuredEmpty')}
          description={t('home.featuredEmptyDesc')}
        />
      )}

      {status === 'success' && displayedPlants.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {displayedPlants
              .slice(0, 4)
              .map((plant) => (
                <PlantCard
                  key={plant._id}
                  plant={plant}
                />
              ))}
          </div>

          <div className="mt-6 text-center sm:mt-8">
            <Link
              to="/plants"
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
              <span>{t('home.viewPlants')}</span>
              <span aria-hidden="true">←</span>
            </Link>
          </div>
        </>
      )}
    </Section>
  );
}