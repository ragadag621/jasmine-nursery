import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { fetchCategories } from '@/api/categories.api';

import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';

export function CategoryGrid() {
  const {
    data: categories,
    status,
    error,
    refetch,
  } = useFetch(fetchCategories, []);

  const { t, i18n } = useTranslation();

  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <Section>
      <PageHeader
        as="h2"
        title={t('home.categoriesTitle')}
      />

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-32 w-full sm:h-36"
              radius="var(--radius-card)"
            />
          ))}
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          message={error ?? undefined}
          onRetry={refetch}
        />
      )}

      {status === 'success' &&
        (categories?.length ?? 0) === 0 && (
          <EmptyState
            title={t('home.categoriesEmpty')}
          />
        )}

      {status === 'success' &&
        categories &&
        categories.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/plants?category=${category._id}`}
                style={{
                  borderRadius: 'var(--radius-card)',
                }}
                className="
                  group
                  flex
                  min-h-11
                  flex-col
                  items-center
                  justify-center
                  gap-2.5
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-cream-50)]
                  p-4
                  text-center
                  shadow-[var(--shadow-soft)]
                  transition-all
                  duration-300
                  ease-[var(--ease-botanical)]
                  md:gap-3
                  md:p-5
                  md:hover:-translate-y-1.5
                  md:hover:shadow-[var(--shadow-lifted)]
                "
              >
                <div
                  className="
                    overflow-hidden
                    rounded-full
                    ring-1
                    ring-[var(--color-border)]
                    transition-all
                    duration-300
                    md:group-hover:ring-2
                    md:group-hover:ring-[var(--color-forest-500)]
                  "
                >
                  <img
                    src={
                      category.image?.url ||
                      '/placeholders/gallery-placeholder.svg'
                    }
                    alt={category.name[key]}
                    loading="lazy"
                    className="
                      h-14
                      w-14
                      object-cover
                      transition-transform
                      duration-300
                      md:h-16
                      md:w-16
                      md:group-hover:scale-110
                    "
                  />
                </div>

                <span
                  className="
                    text-xs
                    font-medium
                    leading-5
                    text-[var(--color-forest-800)]
                    sm:text-sm
                    md:group-hover:text-[var(--color-forest-600)]
                  "
                >
                  {category.name[key]}
                </span>
              </Link>
            ))}
          </div>
        )}
    </Section>
  );
}