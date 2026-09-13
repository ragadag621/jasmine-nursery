import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchPlantBySlug } from '@/api/plants.api';
import { fetchSiteContent } from '@/api/content.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { formatWhatsAppLink } from '@/utils/formatters';
import { setPageMeta } from '@/utils/seo';
import { Button } from '@/components/ui/Button';

export default function PlantDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const { t, i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';

  const { data: plant, status, error, refetch } = useFetch(
    () => fetchPlantBySlug(slug ?? ''),
    [slug]
  );
  const { data: content } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    if (plant) {
      setPageMeta(plant.name[key], plant.description[key]);
    }
  }, [plant, key]);

  if (status === 'loading') {
    return (
      <Container as="main" size="medium" className="py-[var(--space-section)]">
        <Skeleton className="mb-4 h-96 w-full" radius="var(--radius-media)" />
        <Skeleton className="mb-2 h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </Container>
    );
  }

  if (status === 'error' || !plant) {
    return (
      <Container as="main" size="medium" className="py-[var(--space-section)]">
        <ErrorState message={error ?? undefined} onRetry={refetch} />
        <div className="mt-4 text-center">
          <Link to="/plants" className="text-sm text-[var(--color-forest-700)] hover:underline">
            {t('plant.backToCatalog')}
          </Link>
        </div>
      </Container>
    );
  }

  const images =
    plant.images.length > 0
      ? plant.images
      : [{ url: '/placeholders/plant-placeholder.svg', publicId: '', order: 0 }];
  const availabilityVariant =
    plant.availability === 'in_stock' ? 'success' : plant.availability === 'low_stock' ? 'warning' : 'danger';
  const availabilityLabel =
    plant.availability === 'in_stock'
      ? t('plant.inStock')
      : plant.availability === 'low_stock'
        ? t('plant.lowStock')
        : t('plant.outOfStock');
  const waterLabel = { low: t('plant.waterLow'), medium: t('plant.waterMedium'), high: t('plant.waterHigh') }[
    plant.care.water
  ];
  const sunLabel = {
    full_sun: t('plant.sunFull'),
    partial_shade: t('plant.sunPartial'),
    full_shade: t('plant.sunShade'),
  }[plant.care.sunlight];
  const price = plant.price != null ? `₪${plant.price.toLocaleString('he-IL')}` : t('plant.priceOnRequest');
  const whatsappHref = formatWhatsAppLink(
    content?.whatsapp || content?.phone || '972546643896',
    `שלום, מעוניין/ת ב${plant.name.he}`
  );

  return (
    <Container as="main" size="medium" className="py-[var(--space-section)]">
      <div className="mb-10 grid gap-8 md:grid-cols-2">
        <div>
          <div
            className="aspect-square overflow-hidden bg-[var(--color-sage-100)] shadow-[var(--shadow-soft)]"
            style={{ borderRadius: 'var(--radius-media)' }}
          >
            <img
              src={images[activeImage]?.url}
              alt={plant.name[key]}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto" role="tablist" aria-label={plant.name[key]}>
              {images.map((img, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeImage}
                  aria-label={`${t('common.viewMore')} ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors ${
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
            <h1 className="font-display text-3xl text-[var(--color-forest-800)]">{plant.name[key]}</h1>
            <Badge variant={availabilityVariant}>{availabilityLabel}</Badge>
          </div>
          {plant.scientificName && (
            <p className="mb-4 text-sm italic text-[var(--color-ink-600)]">{plant.scientificName}</p>
          )}
          <p className="font-display mb-5 text-2xl text-[var(--color-forest-700)]">{price}</p>
          <p className="mb-7 leading-relaxed text-[var(--color-ink-900)]">{plant.description[key]}</p>

          <Card className="mb-7 grid grid-cols-2 gap-4 p-5">
            <div>
              <p className="mb-1 text-xs text-[var(--color-ink-600)]">{t('plant.water')}</p>
              <p className="text-sm font-medium text-[var(--color-forest-800)]">{waterLabel}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-[var(--color-ink-600)]">{t('plant.sunlight')}</p>
              <p className="text-sm font-medium text-[var(--color-forest-800)]">{sunLabel}</p>
            </div>
          </Card>

          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full">
              {t('plant.whatsappInquiry')}
            </Button>
          </a>
        </div>
      </div>

      <Link to="/plants" className="text-sm text-[var(--color-forest-700)] hover:underline">
        ← {t('plant.backToCatalog')}
      </Link>
    </Container>
  );
}
