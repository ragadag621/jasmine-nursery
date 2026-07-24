import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GalleryItem } from '@/types/gallery.types';

interface LightboxGalleryProps {
  items: GalleryItem[];
}

export function LightboxGallery({ items }: LightboxGalleryProps) {
  const [activeImage, setActiveImage] = useState<{ url: string; title: string } | null>(null);
  const { i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) =>
          item.images.map((img, idx) => (
            <button
              key={`${item._id}-${idx}`}
              onClick={() => setActiveImage({ url: img.url, title: item.title[key] })}
              className="aspect-square animate-[scaleIn_0.3s_var(--ease-botanical)] overflow-hidden rounded-2xl bg-[var(--color-sage-100)] shadow-[var(--shadow-soft)] transition-transform duration-300 hover:scale-[1.03]"
            >
              <img
                src={img.url}
                alt={item.title[key]}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))
        )}
      </div>

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-5 left-5 text-2xl text-white"
            aria-label="סגור"
            onClick={() => setActiveImage(null)}
          >
            ✕
          </button>
          <img
            src={activeImage.url}
            alt={activeImage.title}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
