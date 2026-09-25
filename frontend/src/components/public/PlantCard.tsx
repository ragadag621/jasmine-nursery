import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

import type { Plant } from '@/types/plant.types';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const { t, i18n } = useTranslation();

  const key = i18n.language === 'ar' ? 'ar' : 'he';
  const isArabic = key === 'ar';

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const image =
    plant.images[0]?.url ||
    '/placeholders/plant-placeholder.svg';

  const isOfferActive = (() => {
    if (!plant.offer?.enabled || plant.offer.price == null) return false;

    const currentTime = new Date(now);
    const startDate = plant.offer.startDate
      ? new Date(plant.offer.startDate)
      : null;
    const endDate = plant.offer.endDate
      ? new Date(plant.offer.endDate)
      : null;

    if (startDate && startDate > currentTime) return false;
    if (endDate && endDate < currentTime) return false;

    return true;
  })();

  const currentPrice = isOfferActive ? plant.offer?.price : null;

  const getRemainingTime = (endDate?: string) => {
    if (!endDate || !isOfferActive) return null;

    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) return null;

    const totalMinutes = Math.floor(difference / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    if (days > 1) {
      return isArabic
        ? `متبقي ${days} أيام على انتهاء الحملة`
        : `נותרו ${days} ימים לסיום המבצע`;
    }

    if (days === 1) {
      return isArabic
        ? 'متبقي يوم واحد على انتهاء الحملة'
        : 'נותר יום אחד לסיום המבצע';
    }

    if (totalHours >= 1) {
      return isArabic
        ? `متبقي ${totalHours} ساعات على انتهاء الحملة`
        : `נותרו ${totalHours} שעות לסיום המבצע`;
    }

    return isArabic
      ? `متبقي ${Math.max(totalMinutes, 1)} دقيقة على انتهاء الحملة`
      : `נותרו ${Math.max(totalMinutes, 1)} דקות לסיום המבצע`;
  };

  const formatDate = (date?: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const remainingTime = isOfferActive
    ? getRemainingTime(plant.offer?.endDate)
    : null;

  const offerEndDate =
    isOfferActive && plant.offer?.endDate
      ? formatDate(plant.offer.endDate)
      : null;

  const availabilityVariant =
    plant.availability === 'in_stock'
      ? 'success'
      : plant.availability === 'low_stock'
        ? 'warning'
        : 'danger';

  const availabilityLabel =
    plant.availability === 'in_stock'
      ? t('plant.inStock')
      : plant.availability === 'low_stock'
        ? t('plant.lowStock')
        : t('plant.outOfStock');

  const price =
    plant.price != null
      ? `₪${plant.price.toLocaleString('he-IL')}`
      : t('plant.priceOnRequest');

  const discountedPrice =
    currentPrice != null
      ? `₪${currentPrice.toLocaleString('he-IL')}`
      : null;

  return (
    <Link
      to={`/plants/${plant.slug}`}
      className="block h-full"
      aria-label={plant.name[key]}
    >
      <Card
        hoverable
        className="
          flex
          h-full
          flex-col
          overflow-hidden
          p-0
        "
      >
        <div
          className="
            aspect-square
            w-full
            shrink-0
            overflow-hidden
            bg-[var(--color-sage-100)]
          "
        >
          <img
            src={image}
            alt={plant.name[key]}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              ease-[var(--ease-botanical)]
              md:hover:scale-105
            "
          />
        </div>

        <div
          className="
            flex
            flex-1
            flex-col
            p-3
            sm:p-4
          "
        >
          <div className="flex items-start gap-2">
            <h3
              className="
                min-w-0
                flex-1
                font-display
                text-sm
                leading-snug
                text-[var(--color-forest-800)]
                sm:text-base
              "
            >
              {plant.name[key]}
            </h3>

            <Badge
              variant={availabilityVariant}
              className="shrink-0"
            >
              {availabilityLabel}
            </Badge>
          </div>

          <p
            className="
              mt-2
              line-clamp-2
              text-xs
              leading-5
              text-[var(--color-ink-600)]
              sm:text-sm
              sm:leading-6
            "
          >
            {plant.description[key]}
          </p>

          <div
            dir="ltr"
            className="
              mt-auto
              flex
              flex-col
              items-start
              gap-1
              pt-3
            "
          >
            {isOfferActive && discountedPrice && (
              <>
                <span className="text-xs text-[var(--color-ink-500)] line-through">
                  {price}
                </span>

                <span className="font-display text-base text-[var(--color-forest-700)] sm:text-lg">
                  {discountedPrice}
                </span>
              </>
            )}

            {!isOfferActive && (
              <span className="font-display text-base text-[var(--color-forest-700)] sm:text-lg">
                {price}
              </span>
            )}
          </div>

          {/* Campaign countdown */}
          {remainingTime && (
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
                px-3
                py-2.5
                text-xs
                font-semibold
                text-red-600
              "
              dir="rtl"
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
          )}

          {/* Campaign end date */}
          {offerEndDate && (
            <div
              className="
                mt-3
                border-t
                border-[var(--color-sage-100)]
                pt-3
                text-xs
                text-[var(--color-ink-500)]
              "
              dir="rtl"
            >
              <span>
                {isArabic
                  ? `ينتهي العرض في ${offerEndDate}`
                  : `המבצע מסתיים בתאריך ${offerEndDate}`}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
