import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { fetchPlantBySlug } from '@/api/plants.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import {
  formatPrice,
  formatAvailability,
  formatWaterNeed,
  formatSunlightNeed,
  formatWhatsAppLink,
} from '@/utils/formatters';
import { setPageMeta } from '@/utils/seo';
import { Button } from '@/components/ui/Button';

export default function PlantDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data: plant, status, error, refetch } = useFetch(
    () => fetchPlantBySlug(slug ?? ''),
    [slug]
  );

  useEffect(() => {
    if (plant) {
      setPageMeta(plant.name.he, plant.description.he);
    }
  }, [plant]);

  if (status === 'loading') {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <Skeleton className="mb-4 h-96 w-full rounded-xl" />
        <Skeleton className="mb-2 h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </main>
    );
  }

  if (status === 'error' || !plant) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <ErrorState message={error ?? 'הצמח לא נמצא'} onRetry={refetch} />
        <div className="mt-4 text-center">
          <Link to="/plants" className="text-sm text-[var(--color-forest-700)] hover:underline">
            חזרה לקטלוג
          </Link>
        </div>
      </main>
    );
  }

  const images = plant.images.length > 0 ? plant.images : [{ url: '/placeholders/plant-placeholder.svg', publicId: '', order: 0 }];
  const availabilityVariant =
    plant.availability === 'in_stock' ? 'success' : plant.availability === 'low_stock' ? 'warning' : 'danger';

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-[var(--color-sage-100)]">
            <img
              src={images[activeImage]?.url}
              alt={plant.name.he}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? 'border-[var(--color-forest-700)]' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-start justify-between gap-2">
            <h1 className="font-display text-2xl text-[var(--color-forest-800)]">{plant.name.he}</h1>
            <Badge variant={availabilityVariant}>{formatAvailability(plant.availability)}</Badge>
          </div>
          {plant.scientificName && (
            <p className="mb-3 text-sm italic text-[var(--color-ink-600)]">{plant.scientificName}</p>
          )}
          <p className="mb-4 text-xl font-medium text-[var(--color-forest-700)]">
            {formatPrice(plant.price)}
          </p>
          <p className="mb-6 leading-relaxed text-[var(--color-ink-900)]">{plant.description.he}</p>

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-[var(--color-sage-200)] p-4">
            <div>
              <p className="text-xs text-[var(--color-ink-600)]">השקיה</p>
              <p className="text-sm font-medium text-[var(--color-forest-800)]">
                {formatWaterNeed(plant.care.water)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-ink-600)]">תאורה</p>
              <p className="text-sm font-medium text-[var(--color-forest-800)]">
                {formatSunlightNeed(plant.care.sunlight)}
              </p>
            </div>
          </div>

          <a
            href={formatWhatsAppLink('972546643896', `שלום, מעוניין/ת ב${plant.name.he}`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="w-full">
              בירור זמינות בוואטסאפ
            </Button>
          </a>
        </div>
      </div>

      <Link to="/plants" className="text-sm text-[var(--color-forest-700)] hover:underline">
        ← חזרה לקטלוג
      </Link>
    </main>
  );
}
