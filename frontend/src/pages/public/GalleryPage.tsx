import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchGallery } from '@/api/gallery.api';
import { LightboxGallery } from '@/components/public/LightboxGallery';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { setPageMeta } from '@/utils/seo';

const CATEGORY_TABS = [
  { value: undefined, label: 'הכל' },
  { value: 'nursery', label: 'המשתלה' },
  { value: 'before-after', label: 'עיצוב גינות' },
  { value: 'events', label: 'אירועים' },
];

export default function GalleryPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);

  useEffect(() => {
    setPageMeta('גלריה', 'תמונות מהמשתלה, מהעיצובים ומהמוצרים שלנו');
  }, []);

  const { data: items, status, error, refetch } = useFetch(() => fetchGallery(category), [category]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-display mb-6 text-center text-3xl text-[var(--color-forest-800)]">גלריה</h1>

      <div className="mb-8 flex justify-center gap-2 overflow-x-auto">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setCategory(tab.value)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
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
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (items?.length ?? 0) === 0 && (
        <EmptyState title="אין עדיין תמונות בקטגוריה זו" />
      )}

      {status === 'success' && items && items.length > 0 && <LightboxGallery items={items} />}
    </main>
  );
}
