import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { fetchOffers } from '@/api/offers.api';
import { fetchPlants } from '@/api/plants.api';
import { PlantCard } from '@/components/public/PlantCard';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFetch } from '@/hooks/useFetch';
import { setPageMeta } from '@/utils/seo';

function isOfferActive(startDate?: string, endDate?: string) {
  const now = new Date();

  if (startDate && new Date(startDate) > now) return false;
  if (endDate && new Date(endDate) < now) return false;

  return true;
}

export default function OffersPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'he';

  const offersQuery = useFetch(() => fetchOffers(true), []);
  const plantsQuery = useFetch(
    () => fetchPlants({ page: 1, limit: 50 }),
    [],
  );

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setPageMeta(t('offers.pageTitle'), t('offers.pageSubtitle'));
  }, [t]);

  const activeOffers = (offersQuery.data ?? []).filter((offer) =>
    isOfferActive(offer.startDate, offer.endDate),
  );

  const groupOffers = activeOffers.filter(
    (offer) => offer.plants.length > 0,
  );

  const generalOffers = activeOffers.filter(
    (offer) => offer.plants.length === 0,
  );

  const plantDiscounts = (plantsQuery.data?.plants ?? []).filter((plant) => {
    const offer = plant.offer;

    return Boolean(
      offer?.enabled &&
        offer.price != null &&
        isOfferActive(offer.startDate, offer.endDate),
    );
  });

  const isLoading =
    offersQuery.status === 'loading' || plantsQuery.status === 'loading';

  const hasError =
    offersQuery.status === 'error' || plantsQuery.status === 'error';

  /*
   * All dates intentionally use he-IL so numbers stay in the
   * standard Hebrew / Western digit format even in Arabic UI.
   */
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

  const CampaignCountdown = ({ endDate }: { endDate?: string }) => {
    const remainingTime = getRemainingTime(endDate);

    if (!remainingTime) {
      return null;
    }

    return (
      <div
        className="
          mt-4
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-red-100
          bg-red-50
          px-3.5
          py-2.5
          text-xs
          font-semibold
          text-red-600
        "
        dir={language === 'ar' ? 'rtl' : 'rtl'}
      >
        <span
          aria-hidden="true"
          className="
            h-2
            w-2
            shrink-0
            rounded-full
            bg-red-500
          "
        />

        <span>{remainingTime}</span>
      </div>
    );
  };

  const CampaignEndDate = ({ endDate }: { endDate?: string }) => {
    if (!endDate) {
      return null;
    }

    return (
      <div
        className="
          mt-4
          border-t
          border-[var(--color-border)]
          pt-3
          text-xs
          text-[var(--color-ink-500)]
        "
        dir="rtl"
      >
        <span>
          {language === 'ar'
            ? `ينتهي العرض في ${formatDate(endDate)}`
            : `המבצע מסתיים בתאריך ${formatDate(endDate)}`}
        </span>
      </div>
    );
  };

  return (
    <Container as="main" className="py-[var(--space-section)]">
      <PageHeader
        title={t('offers.pageTitle')}
        description={t('offers.pageSubtitle')}
      />

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-5">
              <Skeleton className="mb-3 h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </Card>
          ))}
        </div>
      )}

      {!isLoading && hasError && (
        <ErrorState
          message={offersQuery.error ?? plantsQuery.error ?? undefined}
          onRetry={() => {
            offersQuery.refetch();
            plantsQuery.refetch();
          }}
        />
      )}

      {!isLoading && !hasError && (
        <div className="space-y-12">
          {/* =========================================================
              GROUP OFFERS
          ========================================================= */}
          <section aria-labelledby="group-offers-title">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-terracotta-600)]">
                {t('offers.groupEyebrow')}
              </p>

              <h2
                id="group-offers-title"
                className="mt-1 font-display text-2xl text-[var(--color-forest-800)]"
              >
                {t('offers.sections.groupTitle')}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink-600)]">
                {t('offers.sections.groupDescription')}
              </p>
            </div>

            {groupOffers.length === 0 ? (
              <EmptyState
                title={t('offers.groupEmptyTitle')}
                description={t('offers.groupEmptyDescription')}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {groupOffers.map((offer) => (
                  <Link
                    key={offer._id}
                    to={`/offers/${offer._id}`}
                    className="group block h-full"
                  >
                    <Card
                      className="
                        flex
                        h-full
                        items-center
                        gap-4
                        border
                        border-[var(--color-sage-200)]
                        p-4
                        transition-transform
                        duration-200
                        group-hover:-translate-y-1
                        group-hover:shadow-[var(--shadow-medium)]
                        sm:p-5
                      "
                    >
                      <div
                        className="
                          flex
                          h-20
                          w-20
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          bg-[var(--color-sage-100)]
                          sm:h-24
                          sm:w-24
                        "
                      >
                        {offer.image?.url ? (
                          <img
                            src={offer.image.url}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span
                            className="
                              font-display
                              text-3xl
                              text-[var(--color-forest-700)]
                            "
                            aria-hidden="true"
                          >
                            ₪
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1" dir="rtl">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3
                            className="
                              font-display
                              text-xl
                              text-[var(--color-forest-800)]
                            "
                          >
                            {offer.title[language]}
                          </h3>

                          <span
                            className="
                              rounded-full
                              bg-[var(--color-sage-100)]
                              px-2.5
                              py-1
                              text-[11px]
                              font-medium
                              text-[var(--color-forest-700)]
                            "
                          >
                            {t('offers.groupBadge')}
                          </span>
                        </div>

                        <p
                          className="
                            mt-2
                            text-sm
                            leading-6
                            text-[var(--color-ink-600)]
                          "
                        >
                          {offer.description[language]}
                        </p>

                        <p
                          className="
                            mt-3
                            text-xs
                            font-medium
                            text-[var(--color-forest-700)]
                          "
                        >
                          {t('offers.plantsIncluded', {
                            count: offer.plants.length,
                          })}{' '}
                          · {t('offers.openOffer')}
                        </p>

                        <CampaignCountdown endDate={offer.endDate} />

                        <CampaignEndDate endDate={offer.endDate} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* =========================================================
              PLANT DISCOUNTS
          ========================================================= */}
          <section aria-labelledby="plant-discounts-title">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-terracotta-600)]">
                {t('offers.discountEyebrow')}
              </p>

              <h2
                id="plant-discounts-title"
                className="mt-1 font-display text-2xl text-[var(--color-forest-800)]"
              >
                {t('offers.sections.plantsTitle')}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink-600)]">
                {t('offers.sections.plantsDescription')}
              </p>
            </div>

            {plantDiscounts.length === 0 ? (
              <EmptyState
                title={t('offers.plantEmptyTitle')}
                description={t('offers.plantEmptyDescription')}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {plantDiscounts.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </div>
            )}
          </section>

          {/* =========================================================
              GENERAL OFFERS
          ========================================================= */}
          <section aria-labelledby="general-offers-title">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-terracotta-600)]">
                {t('offers.generalEyebrow')}
              </p>

              <h2
                id="general-offers-title"
                className="mt-1 font-display text-2xl text-[var(--color-forest-800)]"
              >
                {t('offers.sections.generalTitle')}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-ink-600)]">
                {t('offers.sections.generalDescription')}
              </p>
            </div>

            {generalOffers.length === 0 ? (
              <EmptyState
                title={t('offers.generalEmptyTitle')}
                description={t('offers.generalEmptyDescription')}
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {generalOffers.map((offer) => (
                  <Card
                    key={offer._id}
                    className="
                      h-full
                      overflow-hidden
                      border
                      border-[var(--color-border)]
                      p-0
                    "
                  >
                    {offer.image?.url && (
                      <div className="aspect-[16/9] overflow-hidden bg-[var(--color-sage-50)]">
                        <img
                          src={offer.image.url}
                          alt={offer.title[language]}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-5" dir="rtl">
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className="
                            font-display
                            text-xl
                            text-[var(--color-forest-800)]
                          "
                        >
                          {offer.title[language]}
                        </h3>

                        <span
                          className="
                            rounded-full
                            bg-[var(--color-terracotta-100)]
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            text-[var(--color-terracotta-700)]
                          "
                        >
                          {t('offers.generalBadge')}
                        </span>
                      </div>

                      <p
                        className="
                          mt-3
                          text-sm
                          leading-6
                          text-[var(--color-ink-600)]
                        "
                      >
                        {offer.description[language]}
                      </p>

                      <CampaignCountdown endDate={offer.endDate} />

                      <CampaignEndDate endDate={offer.endDate} />

                      {offer.startDate && (
                        <p
                          className="
                            mt-3
                            text-xs
                            text-[var(--color-ink-500)]
                          "
                          dir="ltr"
                        >
                          {language === 'ar'
                            ? `بدأ العرض في ${formatDate(offer.startDate)}`
                            : `המבצע התחיל בתאריך ${formatDate(offer.startDate)}`}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </Container>
  );
}
