import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchCategories } from '@/api/categories.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

export function CategoryGrid() {
  const { data: categories, status, error, refetch } = useFetch(fetchCategories, []);
  const { t, i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <h2 className="font-display mb-10 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('home.categoriesTitle')}
      </h2>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (categories?.length ?? 0) === 0 && (
        <EmptyState title={t('home.categoriesEmpty')} />
      )}

      {status === 'success' && categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/plants?category=${cat._id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-5 text-center shadow-[var(--shadow-soft)] transition-all duration-300 ease-[var(--ease-botanical)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lifted)]"
            >
              <div className="overflow-hidden rounded-full ring-1 ring-[var(--color-sage-200)] transition-all group-hover:ring-2 group-hover:ring-[var(--color-forest-500)]">
                <img
                  src={cat.image?.url || '/placeholders/gallery-placeholder.svg'}
                  alt={cat.name[key]}
                  className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-sm font-medium text-[var(--color-forest-800)] group-hover:text-[var(--color-forest-600)]">
                {cat.name[key]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
