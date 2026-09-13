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
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';

import { setPageMeta } from '@/utils/seo';

const PAGE_SIZE = 12;

function getInitialPage(value: string | null) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default function CatalogPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<PlantListParams>(() => ({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    sort:
      (searchParams.get('sort') as PlantListParams['sort']) ||
      'newest',
    page: getInitialPage(searchParams.get('page')),
    limit: PAGE_SIZE,
  }));

  const debouncedSearch = useDebounce(filters.search, 350);

  useEffect(() => {
    setPageMeta(t('catalog.title'), undefined);
  }, [t]);

  const { data: categories } = useFetch(
    fetchCategories,
    []
  );

  const {
    data,
    status,
    error,
    refetch,
  } = useFetch(
    () =>
      fetchPlants({
        ...filters,
        search: debouncedSearch,
      }),
    [
      filters.category,
      debouncedSearch,
      filters.sort,
      filters.page,
    ]
  );

  const updateFilters = (
    next: Partial<PlantListParams>
  ) => {
    const merged: PlantListParams = {
      ...filters,
      ...next,
      page: next.page ?? 1,
    };

    setFilters(merged);

    const params = new URLSearchParams();

    if (merged.category) {
      params.set('category', merged.category);
    }

    if (merged.search) {
      params.set('search', merged.search);
    }

    if (merged.sort) {
      params.set('sort', merged.sort);
    }

    if (merged.page && merged.page > 1) {
      params.set('page', String(merged.page));
    }

    setSearchParams(params, {
      replace: true,
    });
  };

  const plants = data?.plants ?? [];
  const currentPage = data?.meta.page ?? filters.page;
  const totalPages = data?.meta.pages ?? 1;

  return (
    <Container
      as="main"
      className="
        py-[var(--space-section)]
      "
    >
      <PageHeader title={t('catalog.title')} />

      <div className="mb-6 sm:mb-8">
        <PlantFilterBar
          categories={categories ?? []}
          filters={filters}
          onChange={updateFilters}
        />
      </div>

      {status === 'loading' && (
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-5
            md:grid-cols-3
            lg:grid-cols-4
          "
          aria-busy="true"
          aria-label={t('common.loading')}
        >
          {Array.from({ length: 8 }).map((_, index) => (
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

      {status === 'success' && plants.length === 0 && (
        <EmptyState
          title={t('catalog.empty')}
          description={t('catalog.emptyDesc')}
        />
      )}

      {status === 'success' && plants.length > 0 && (
        <>
          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-5
              md:grid-cols-3
              lg:grid-cols-4
            "
          >
            {plants.map((plant) => (
              <PlantCard
                key={plant._id}
                plant={plant}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="
                mt-8
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
                sm:mt-10
              "
              aria-label={t('catalog.pagination')}
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() =>
                  updateFilters({
                    page: currentPage - 1,
                  })
                }
              >
                {t('catalog.prev')}
              </Button>

              <span
                className="
                  min-w-24
                  text-center
                  text-xs
                  text-[var(--color-ink-600)]
                  sm:text-sm
                "
              >
                {t('catalog.pageOf', {
                  page: currentPage,
                  pages: totalPages,
                })}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  updateFilters({
                    page: currentPage + 1,
                  })
                }
              >
                {t('catalog.next')}
              </Button>
            </nav>
          )}
        </>
      )}
    </Container>
  );
}
