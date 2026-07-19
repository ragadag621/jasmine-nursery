import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { fetchCategories } from '@/api/categories.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

export function CategoryGrid() {
  const { data: categories, status, error, refetch } = useFetch(fetchCategories, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-display mb-8 text-center text-2xl text-[var(--color-forest-800)] md:text-3xl">
        קטגוריות
      </h2>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (categories?.length ?? 0) === 0 && (
        <EmptyState title="אין עדיין קטגוריות" />
      )}

      {status === 'success' && categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/plants?category=${cat._id}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={cat.image?.url || '/placeholders/gallery-placeholder.svg'}
                alt={cat.name.he}
                className="h-16 w-16 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-[var(--color-forest-800)] group-hover:text-[var(--color-forest-600)]">
                {cat.name.he}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
