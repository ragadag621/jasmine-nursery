import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';

export interface GalleryFormValues {
  titleHe: string;
  titleAr: string;
  category: string;
}

interface GalleryUploaderProps {
  onSubmit: (values: GalleryFormValues, files: File[]) => Promise<void>;
  isSubmitting: boolean;
}

const INITIAL_VALUES: GalleryFormValues = {
  titleHe: '',
  titleAr: '',
  category: 'nursery',
};

const GALLERY_CATEGORIES = [
  {
    value: 'nursery',
    translationKey: 'admin.gallery.categories.nursery',
  },
  {
    value: 'before-after',
    translationKey: 'admin.gallery.categories.beforeAfter',
  },
  {
    value: 'events',
    translationKey: 'admin.gallery.categories.events',
  },
] as const;

export function GalleryUploader({
  onSubmit,
  isSubmitting,
}: GalleryUploaderProps) {
  const { t } = useTranslation();

  const [values, setValues] = useState<GalleryFormValues>(INITIAL_VALUES);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (files.length === 0) {
      return;
    }

    await onSubmit(values, files);

    setValues(INITIAL_VALUES);
    setFiles([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)]"
    >
      <div className="border-b border-[var(--color-border)] bg-[var(--color-sage-50)] px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-[var(--color-forest-800)]">
          {t('admin.gallery.addTitle')}
        </h2>

        <p className="mt-1 text-sm text-[var(--color-ink-500)]">
          {t('admin.gallery.addDescription')}
        </p>
      </div>

      <div className="space-y-6 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t('admin.gallery.titleHebrew')}
            value={values.titleHe}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                titleHe: event.target.value,
              }))
            }
            required
          />

          <Input
            label={t('admin.gallery.titleArabic')}
            value={values.titleAr}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                titleAr: event.target.value,
              }))
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="gallery-category"
            className="mb-1.5 block text-sm font-medium text-[var(--color-ink-700)]"
          >
            {t('admin.gallery.category')}
          </label>

          <select
            id="gallery-category"
            value={values.category}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            className={[
              'w-full rounded-xl border border-[var(--color-sage-300)]',
              'bg-white px-3 py-2.5 text-sm text-[var(--color-ink-700)]',
              'outline-none transition-all',
              'focus:border-[var(--color-forest-500)]',
              'focus:ring-2 focus:ring-[var(--color-forest-500)]/20',
            ].join(' ')}
          >
            {GALLERY_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {t(category.translationKey)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-[var(--color-ink-700)]">
              {t('admin.gallery.images')}
            </h3>

            <p className="mt-0.5 text-xs text-[var(--color-ink-500)]">
              {t('admin.gallery.imagesDescription')}
            </p>
          </div>

          <ImageDropzone
            multiple
            onFilesSelected={setFiles}
          />
        </div>

        <div className="flex justify-end border-t border-[var(--color-border)] pt-5">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting || files.length === 0}
            size="md"
          >
            {isSubmitting
              ? t('admin.gallery.uploading')
              : t('admin.gallery.upload')}
          </Button>
        </div>
      </div>
    </form>
  );
}