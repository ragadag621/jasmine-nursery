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
  const image = plant.images[0]?.url || '/placeholders/plant-placeholder.svg';

  const availabilityVariant =
    plant.availability === 'in_stock' ? 'success' : plant.availability === 'low_stock' ? 'warning' : 'danger';
  const availabilityLabel =
    plant.availability === 'in_stock'
      ? t('plant.inStock')
      : plant.availability === 'low_stock'
        ? t('plant.lowStock')
        : t('plant.outOfStock');

  const price = plant.price != null ? `₪${plant.price.toLocaleString('he-IL')}` : t('plant.priceOnRequest');

  return (
    <Link to={`/plants/${plant.slug}`} className="block h-full">
      <Card hoverable className="h-full overflow-hidden p-0">
        <div className="aspect-square w-full overflow-hidden bg-[var(--color-sage-100)]">
          <img
            src={image}
            alt={plant.name[key]}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-botanical)] hover:scale-110"
          />
        </div>
        <div className="p-4">
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <h3 className="font-display text-base leading-snug text-[var(--color-forest-800)]">
              {plant.name[key]}
            </h3>
            <Badge variant={availabilityVariant}>{availabilityLabel}</Badge>
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-[var(--color-ink-600)]">{plant.description[key]}</p>
          <p className="font-display text-lg text-[var(--color-forest-700)]">{price}</p>
        </div>
      </Card>
    </Link>
  );
}
