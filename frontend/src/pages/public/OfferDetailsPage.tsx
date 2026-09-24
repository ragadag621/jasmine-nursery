import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { fetchOffer } from '@/api/offers.api';
import { PlantCard } from '@/components/public/PlantCard';
import { Container } from '@/components/ui/Container';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFetch } from '@/hooks/useFetch';
import { setPageMeta } from '@/utils/seo';

export default function OfferDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'he';
  const query = useFetch(() => fetchOffer(id ?? ''), [id]);

  useEffect(() => {
    if (query.data) {
      setPageMeta(query.data.title[language], query.data.description[language]);
    }
  }, [language, query.data]);

  if (query.status === 'loading') {
    return (
      <Container as="main" className="py-[var(--space-section)]">
        <Skeleton className="mb-3 h-10 w-2/3" />
        <Skeleton className="mb-8 h-5 w-full max-w-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4] w-full" />)}
        </div>
      </Container>
    );
  }

  if (query.status === 'error' || !query.data) {
    return (
      <Container as="main" className="py-[var(--space-section)]">
        <ErrorState message={query.error ?? undefined} onRetry={query.refetch} />
        <div className="mt-4 text-center">
          <Link to="/offers" className="text-sm text-[var(--color-forest-700)] hover:underline">{t('offers.backToOffers')}</Link>
        </div>
      </Container>
    );
  }

  return (
    <Container as="main" className="py-[var(--space-section)]">
      <PageHeader title={query.data.title[language]} description={query.data.description[language]} />
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="rounded-full bg-[var(--color-sage-100)] px-3 py-1.5 text-xs font-medium text-[var(--color-forest-700)]">
          {t('offers.plantsIncluded', { count: query.data.plants.length })}
        </span>
        <Link to="/offers" className="text-sm text-[var(--color-forest-700)] hover:underline">{t('offers.backToOffers')}</Link>
      </div>

      {query.data.plants.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-600)]">{t('offers.groupNoPlants')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {query.data.plants.map((plant) => <PlantCard key={plant._id} plant={plant} />)}
        </div>
      )}
    </Container>
  );
}
