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

  const image =
    plant.images[0]?.url ||
    '/placeholders/plant-placeholder.svg';

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

          <p
            dir="ltr"
            className="
              mt-auto
              pt-3
              font-display
              text-base
              text-[var(--color-forest-700)]
              sm:text-lg
            "
          >
            {price}
          </p>
        </div>
      </Card>
    </Link>
  );
}
