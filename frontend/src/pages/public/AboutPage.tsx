import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';

import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';

import { setPageMeta } from '@/utils/seo';

export default function AboutPage() {
  const { t, i18n } = useTranslation();

  const key = i18n.language === 'ar' ? 'ar' : 'he';

  const {
    data: content,
    status,
    error,
    refetch,
  } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta(t('about.title'), undefined);
  }, [t]);

  return (
    <Container
      as="main"
      size="narrow"
      className="py-[var(--space-section)]"
    >
      <PageHeader title={t('about.title')} />

      {status === 'loading' && (
        <div
          className={[
            'overflow-hidden rounded-3xl',
            'border border-[var(--color-border)]',
            'bg-white',
            'p-6 shadow-[var(--shadow-soft)]',
            'md:p-8',
          ].join(' ')}
        >
          <div className="mb-6 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-10/12" />
            <Skeleton className="h-5 w-8/12" />
          </div>
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          message={error ?? undefined}
          onRetry={refetch}
        />
      )}

      {status === 'success' && (
        <article
          className={[
            'relative overflow-hidden rounded-3xl',
            'border border-[var(--color-border)]',
            'bg-white shadow-[var(--shadow-soft)]',
          ].join(' ')}
        >
          <div
            className={[
              'absolute inset-x-0 top-0 h-1.5',
              'bg-[var(--color-forest-700)]',
            ].join(' ')}
            aria-hidden="true"
          />

          <div className="p-6 md:p-10">
            <div
              className={[
                'mb-8 flex h-12 w-12 items-center',
                'justify-center rounded-2xl',
                'bg-[var(--color-sage-100)]',
                'text-[var(--color-forest-700)]',
              ].join(' ')}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21c4.5-3.2 7-7.2 7-11.2C19 6.5 16.5 4 12 3 7.5 4 5 6.5 5 9.8 5 13.8 7.5 17.8 12 21Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20V8"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 13c-2.2-1.2-3.8-2.8-4.8-4.8M12 16c2.1-1 3.7-2.5 4.8-4.5"
                />
              </svg>
            </div>

            <div
              className={[
                'text-lg leading-8',
                'text-[var(--color-ink-800)]',
                'md:text-xl md:leading-9',
              ].join(' ')}
            >
              {content?.aboutText?.[key] ? (
                <p
                  className="whitespace-pre-line"
                  dir={key === 'ar' ? 'rtl' : 'rtl'}
                >
                  {content.aboutText[key]}
                </p>
              ) : (
                <p className="text-[var(--color-ink-500)]">
                  {t('about.fallback')}
                </p>
              )}
            </div>
          </div>

          <div
            className={[
              'border-t border-[var(--color-border)]',
              'bg-[var(--color-sage-50)]',
              'px-6 py-5 md:px-10',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <span
                className="h-2 w-2 rounded-full bg-[var(--color-forest-600)]"
                aria-hidden="true"
              />

              <p className="text-sm font-medium text-[var(--color-forest-800)]">
                {t('home.heroTitleFallback')}
              </p>
            </div>
          </div>
        </article>
      )}
    </Container>
  );
}