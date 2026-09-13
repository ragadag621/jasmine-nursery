import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchGallery } from '@/api/gallery.api';
import { LightboxGallery } from '@/components/public/LightboxGallery';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { setPageMeta } from '@/utils/seo';

export default function GalleryPage() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string | undefined>(undefined);

  const CATEGORY_TABS = [
    { value: undefined, label: t('gallery.tabAll') },
    { value: 'nursery', label: t('gallery.tabNursery') },
    { value: 'before-after', label: t('gallery.tabBeforeAfter') },
    { value: 'events', label: t('gallery.tabEvents') },
  ];

  useEffect(() => {
    setPageMeta(t('gallery.title'), undefined);
  }, [t]);

  const { data: items, status, error, refetch } = useFetch(() => fetchGallery(category), [category]);

  return (
    <Container as="main" className="py-[var(--space-section)]">
      <PageHeader title={t('gallery.title')} />

      <div className="mb-10 flex justify-center gap-2 overflow-x-auto" role="tablist" aria-label={t('gallery.title')}>
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={category === tab.value}
            onClick={() => setCategory(tab.value)}
            className={`whitespace-nowrap rounded-[var(--radius-pill)] px-4 py-1.5 text-sm font-medium transition-colors ${
              category === tab.value
                ? 'bg-[var(--color-forest-700)] text-white'
                : 'bg-[var(--color-sage-100)] text-[var(--color-ink-600)] hover:bg-[var(--color-sage-200)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" radius="var(--radius-media)" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (items?.length ?? 0) === 0 && <EmptyState title={t('gallery.empty')} />}

      {status === 'success' && items && items.length > 0 && <LightboxGallery items={items} />}
    </Container>
  );
}
