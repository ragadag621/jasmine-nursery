import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchPlants } from '@/api/plants.api';
import type { PlantListParams } from '@/api/plants.api';
import { fetchCategories } from '@/api/categories.api';
import { PlantCard } from '@/components/public/PlantCard';
import { PlantFilterBar } from '@/components/public/PlantFilterBar';
import { PlantCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { setPageMeta } from '@/utils/seo';

export default function CatalogPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<PlantListParams>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as PlantListParams['sort']) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  });

  const debouncedSearch = useDebounce(filters.search, 350);

  useEffect(() => {
    setPageMeta(t('catalog.title'), undefined);
  }, [t]);

  const { data: categories } = useFetch(fetchCategories, []);

  const { data, status, error, refetch } = useFetch(
    () => fetchPlants({ ...filters, search: debouncedSearch }),
    [filters.category, debouncedSearch, filters.sort, filters.page]
  );

  const updateFilters = (next: Partial<PlantListParams>) => {
    const merged = { ...filters, ...next, page: next.page ?? 1 };
    setFilters(merged);

    const params = new URLSearchParams();
    if (merged.category) params.set('category', merged.category);
    if (merged.search) params.set('search', merged.search);
    if (merged.sort) params.set('sort', merged.sort);
    if (merged.page && merged.page > 1) params.set('page', String(merged.page));
    setSearchParams(params, { replace: true });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <h1 className="font-display mb-8 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('catalog.title')}
      </h1>

      <PlantFilterBar categories={categories ?? []} filters={filters} onChange={updateFilters} />

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PlantCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (data?.plants.length ?? 0) === 0 && (
        <EmptyState title={t('catalog.empty')} description={t('catalog.emptyDesc')} />
      )}

      {status === 'success' && data && data.plants.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {data.plants.map((plant) => (
              <PlantCard key={plant._id} plant={plant} />
            ))}
          </div>

          {data.meta.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.page <= 1}
                onClick={() => updateFilters({ page: data.meta.page - 1 })}
              >
                {t('catalog.prev')}
              </Button>
              <span className="text-sm text-[var(--color-ink-600)]">
                {t('catalog.pageOf', { page: data.meta.page, pages: data.meta.pages })}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={data.meta.page >= data.meta.pages}
                onClick={() => updateFilters({ page: data.meta.page + 1 })}
              >
                {t('catalog.next')}
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
