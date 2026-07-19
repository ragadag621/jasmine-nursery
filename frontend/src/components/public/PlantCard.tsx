import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatAvailability } from '@/utils/formatters';
import type { Plant } from '@/types/plant.types';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  const image = plant.images[0]?.url || '/placeholders/plant-placeholder.svg';
  const availabilityVariant =
    plant.availability === 'in_stock' ? 'success' : plant.availability === 'low_stock' ? 'warning' : 'danger';

  return (
    <Link to={`/plants/${plant.slug}`}>
      <Card hoverable className="h-full overflow-hidden p-0">
        <div className="aspect-square w-full overflow-hidden bg-[var(--color-sage-100)]">
          <img
            src={image}
            alt={plant.name.he}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-display text-base text-[var(--color-forest-800)]">{plant.name.he}</h3>
            <Badge variant={availabilityVariant}>{formatAvailability(plant.availability)}</Badge>
          </div>
          <p className="mb-2 line-clamp-2 text-sm text-[var(--color-ink-600)]">{plant.description.he}</p>
          <p className="font-medium text-[var(--color-forest-700)]">{formatPrice(plant.price)}</p>
        </div>
      </Card>
    </Link>
  );
}
