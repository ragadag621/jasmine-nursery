import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { setPageMeta } from '@/utils/seo';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';
  const { data: content, status, error, refetch } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta(t('about.title'), undefined);
  }, [t]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-display mb-8 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('about.title')}
      </h1>

      {status === 'loading' && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (
        <div className="space-y-4 text-lg leading-relaxed text-[var(--color-ink-900)]">
          <p>{content?.aboutText?.[key] ?? t('about.fallback')}</p>
        </div>
      )}
    </main>
  );
}
