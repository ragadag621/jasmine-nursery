import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GalleryItem } from '@/types/gallery.types';

interface LightboxImage {
  url: string;
  title: string;
}

interface LightboxGalleryProps {
  items: GalleryItem[];
}

const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  nursery: 'admin.gallery.categories.nursery',
  'before-after': 'admin.gallery.categories.beforeAfter',
  events: 'admin.gallery.categories.events',
};

export function LightboxGallery({
  items,
}: LightboxGalleryProps) {
  const { t, i18n } = useTranslation();

  const [activeImage, setActiveImage] =
    useState<LightboxImage | null>(null);

  const key = i18n.language === 'ar' ? 'ar' : 'he';

  const getCategoryLabel = (category: string) => {
    const translationKey =
      CATEGORY_TRANSLATION_KEYS[category];

    return translationKey
      ? t(translationKey)
      : category;
  };

  return (
    <>
      <div className="space-y-12">
        {items.map((item) => {
          const title = item.title[key];
          const category = getCategoryLabel(item.category);

          return (
            <section
              key={item._id}
              aria-labelledby={`gallery-item-${item._id}`}
            >
              <div className="mb-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    id={`gallery-item-${item._id}`}
                    className="font-display text-xl font-semibold text-[var(--color-forest-800)]"
                  >
                    {title}
                  </h2>

                  <span className="rounded-full bg-[var(--color-sage-100)] px-3 py-1 text-xs font-medium text-[var(--color-forest-700)]">
                    {category}
                  </span>
                </div>

                {key === 'ar' && item.title.he && (
                  <p className="mt-1 text-sm text-[var(--color-ink-400)]">
                    {item.title.he}
                  </p>
                )}

                {key === 'he' && item.title.ar && (
                  <p
                    className="mt-1 text-sm text-[var(--color-ink-400)]"
                    dir="rtl"
                  >
                    {item.title.ar}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {item.images.map((img) => (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() =>
                      setActiveImage({
                        url: img.url,
                        title,
                      })
                    }
                    aria-label={`${title} - ${t(
                      'admin.gallery.imageCount',
                      {
                        count: 1,
                      },
                    )}`}
                    className={[
                      'group aspect-square overflow-hidden',
                      'rounded-2xl bg-[var(--color-sage-100)]',
                      'shadow-[var(--shadow-soft)]',
                      'transition-transform duration-300',
                      'hover:scale-[1.03]',
                      'focus:outline-none',
                      'focus:ring-2 focus:ring-[var(--color-forest-500)]',
                      'focus:ring-offset-2',
                    ].join(' ')}
                  >
                    <img
                      src={img.url}
                      alt={title}
                      loading="lazy"
                      className={[
                        'h-full w-full object-cover',
                        'transition-transform duration-500',
                        'ease-[var(--ease-botanical)]',
                        'group-hover:scale-110',
                      ].join(' ')}
                    />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {activeImage && (
        <div
          className={[
            'fixed inset-0 z-50 flex items-center',
            'justify-center bg-black/80 p-4',
            'animate-[fadeIn_0.2s_ease-out]',
          ].join(' ')}
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
        >
          <button
            type="button"
            className={[
              'absolute left-5 top-5 flex h-10 w-10',
              'items-center justify-center rounded-full',
              'bg-black/40 text-xl text-white',
              'transition-colors hover:bg-black/70',
              'focus:outline-none',
              'focus:ring-2 focus:ring-white',
            ].join(' ')}
            aria-label={t('common.back')}
            onClick={() => setActiveImage(null)}
          >
            ✕
          </button>

          <div
            className="flex max-h-[90vh] max-w-[95vw] flex-col items-center gap-4"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
            />

            <p className="text-center text-base font-medium text-white">
              {activeImage.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}