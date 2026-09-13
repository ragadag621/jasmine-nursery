
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { useDebounce } from '@/hooks/useDebounce';

import {
  fetchPlantsAdmin,
  togglePlantVisibility,
  deletePlant,
} from '@/api/plants.api';

import { PlantTable } from '@/components/admin/PlantTable';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

export default function PlantsListPage() {
  const { t, i18n } = useTranslation();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  const { showToast } = useToast();

  const direction = i18n.dir();

  useEffect(() => {
    setPageMeta(t('admin.plants.title'), undefined);
  }, [t]);

  const {
    data,
    status,
    error,
    refetch,
  } = useFetch(
    () =>
      fetchPlantsAdmin({
        search: debouncedSearch,
        limit: 50,
      }),
    [debouncedSearch]
  );

  const handleToggleVisibility = async (id: string) => {
    try {
      await togglePlantVisibility(id);

      showToast(
        t('admin.plants.visibilityUpdated'),
        'success'
      );

      refetch();
    } catch {
      showToast(
        t('admin.plants.visibilityUpdateFailed'),
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.plants.deleteConfirm'))) {
      return;
    }

    try {
      await deletePlant(id);

      showToast(
        t('admin.plants.deleted'),
        'success'
      );

      refetch();
    } catch {
      showToast(
        t('admin.plants.deleteFailed'),
        'error'
      );
    }
  };

  return (
    <div>
      {/* Page header */}
      <div
        className="
          mb-5
          flex
          flex-col
          gap-4
          sm:mb-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <h1
          className="
            font-display
            text-xl
            leading-tight
            text-[var(--color-forest-800)]
            sm:text-2xl
          "
        >
          {t('admin.plants.title')}
        </h1>

        <Link
          to="/admin/plants/new"
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto">
            {t('admin.plants.add')}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5 sm:mb-6">
        <label
          htmlFor="plants-search"
          className="
            mb-1.5
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          {t('admin.plants.searchLabel')}
        </label>

        <input
          id="plants-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('admin.plants.searchPlaceholder')}
          dir={direction}
          autoComplete="off"
          className="
            min-h-11
            w-full
            max-w-md
            rounded-lg
            border
            border-[var(--color-sage-300)]
            bg-[var(--color-cream-50)]
            px-3
            py-2.5
            text-[max(16px,0.95rem)]
            text-[var(--color-ink-900)]
            outline-none
            transition-colors
            focus:border-[var(--color-forest-600)]
            focus:ring-2
            focus:ring-[var(--color-forest-600)]/15
          "
        />
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <Skeleton
          className="h-64 w-full"
          radius="var(--radius-card)"
        />
      )}

      {/* Error */}
      {status === 'error' && (
        <ErrorState
          message={error ?? undefined}
          onRetry={refetch}
        />
      )}

      {/* Empty */}
      {status === 'success' &&
        (data?.plants.length ?? 0) === 0 && (
          <EmptyState
            title={t('admin.plants.emptyTitle')}
            description={t('admin.plants.emptyDescription')}
          />
        )}

      {/* Table */}
      {status === 'success' &&
        data &&
        data.plants.length > 0 && (
          <PlantTable
            plants={data.plants}
            onToggleVisibility={handleToggleVisibility}
            onDelete={handleDelete}
          />
        )}
    </div>
  );
}