import { useEffect, useState } from 'react';
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

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (query.data) {
      setPageMeta(
        query.data.title[language],
        query.data.description[language],
      );
    }
  }, [language, query.data]);

  const formatDate = (date?: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRemainingTime = (endDate?: string) => {
    if (!endDate) return null;

    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return null;
    }

    const totalMinutes = Math.floor(difference / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    if (days > 1) {
      return language === 'ar'
        ? `متبقي ${days} أيام على انتهاء الحملة`
        : `נותרו ${days} ימים לסיום המבצע`;
    }

    if (days === 1) {
      return language === 'ar'
        ? 'متبقي يوم واحد على انتهاء الحملة'
        : 'נותר יום אחד לסיום המבצע';
    }

    if (totalHours >= 1) {
      return language === 'ar'
        ? `متبقي ${totalHours} ساعات على انتهاء الحملة`
        : `נותרו ${totalHours} שעות לסיום המבצע`;
    }

    return language === 'ar'
      ? `متبقي ${Math.max(totalMinutes, 1)} دقيقة على انتهاء الحملة`
      : `נותרו ${Math.max(totalMinutes, 1)} דקות לסיום המבצע`;
  };

  if (query.status === 'loading') {
    return (
      <Container as="main" className="py-[var(--space-section)]">
        <Skeleton className="mb-3 h-10 w-2/3" />
        <Skeleton className="mb-8 h-5 w-full max-w-2xl" />

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-[3/4] w-full"
            />
          ))}
        </div>
      </Container>
    );
  }

  if (query.status === 'error' || !query.data) {
    return (
      <Container as="main" className="py-[var(--space-section)]">
        <ErrorState
          message={query.error ?? undefined}
          onRetry={query.refetch}
        />

        <div className="mt-4 text-center">
          <Link
            to="/offers"
            className="text-sm text-[var(--color-forest-700)] hover:underline"
          >
            {t('offers.backToOffers')}
          </Link>
        </div>
      </Container>
    );
  }

  const offer = query.data;
  const remainingTime = getRemainingTime(offer.endDate);

  return (
    <Container as="main" className="py-[var(--space-section)]">
      <PageHeader
        title={offer.title[language]}
        description={offer.description[language]}
      />

      {/* Campaign information */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span
            className="
              rounded-full
              bg-[var(--color-sage-100)]
              px-3
              py-1.5
              text-xs
              font-medium
              text-[var(--color-forest-700)]
            "
          >
            {t('offers.plantsIncluded', {
              count: offer.plants.length,
            })}
          </span>

          <Link
            to="/offers"
            className="
              text-sm
              text-[var(--color-forest-700)]
              hover:underline
            "
          >
            {t('offers.backToOffers')}
          </Link>
        </div>

        {/* Remaining time */}
        {remainingTime && (
          <div
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-100
              bg-red-50
              px-4
              py-3
              text-sm
              font-semibold
              text-red-600
            "
            dir="rtl"
          >
            <span
              aria-hidden="true"
              className="
                h-2.5
                w-2.5
                shrink-0
                rounded-full
                bg-red-500
              "
            />

            <span>{remainingTime}</span>
          </div>
        )}

        {/* End date */}
        {offer.endDate && (
          <div
            className="
              flex
              items-center
              rounded-xl
              border
              border-[var(--color-sage-200)]
              bg-[var(--color-sage-50)]
              px-4
              py-3
              text-sm
              text-[var(--color-ink-600)]
            "
            dir="rtl"
          >
            <span>
              {language === 'ar'
                ? `ينتهي العرض في ${formatDate(offer.endDate)}`
                : `המבצע מסתיים בתאריך ${formatDate(offer.endDate)}`}
            </span>
          </div>
        )}
      </div>

      {offer.plants.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-600)]">
          {t('offers.groupNoPlants')}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {offer.plants.map((plant) => (
            <PlantCard
              key={plant._id}
              plant={plant}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
