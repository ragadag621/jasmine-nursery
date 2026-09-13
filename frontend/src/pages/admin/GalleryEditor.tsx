import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from '@/components/admin/ImageDropzone';

import type { GalleryItem } from '@/types/gallery.types';

export interface GalleryEditValues {
  titleHe: string;
  titleAr: string;
  category: string;
}

interface GalleryEditorProps {
  item: GalleryItem;
  onSubmit: (
    values: GalleryEditValues,
    files: File[],
  ) => Promise<void>;
  onRemoveExisting: (imageId: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  deletingImageId: string | null;
}

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

export function GalleryEditor({
  item,
  onSubmit,
  onRemoveExisting,
  onCancel,
  isSubmitting,
  deletingImageId,
}: GalleryEditorProps) {
  const { t } = useTranslation();

  const [values, setValues] = useState<GalleryEditValues>({
    titleHe: item.title.he,
    titleAr: item.title.ar,
    category: item.category,
  });

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setValues({
      titleHe: item.title.he,
      titleAr: item.title.ar,
      category: item.category,
    });

    setFiles([]);
  }, [item]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await onSubmit(values, files);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-sage-50)] px-5 py-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-forest-800)]">
            {t('admin.gallery.editTitle')}
          </h2>

          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            {t('admin.gallery.editDescription')}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          aria-label={t('admin.gallery.cancel')}
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center',
            'rounded-full text-[var(--color-ink-500)]',
            'transition-colors',
            'hover:bg-white hover:text-[var(--color-forest-700)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-forest-500)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M18 6 6 18"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 p-5">
          {/* Titles */}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="gallery-edit-category"
              className="mb-1.5 block text-sm font-medium text-[var(--color-ink-700)]"
            >
              {t('admin.gallery.category')}
            </label>

            <select
              id="gallery-edit-category"
              value={values.category}
              disabled={isSubmitting}
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
                'disabled:cursor-not-allowed disabled:bg-[var(--color-sage-50)] disabled:opacity-70',
              ].join(' ')}
            >
              {GALLERY_CATEGORIES.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {t(category.translationKey)}
                </option>
              ))}
            </select>
          </div>

          {/* Existing images */}
          <div>
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[var(--color-ink-700)]">
                {t('admin.gallery.currentImages')}
              </h3>

              <p className="mt-0.5 text-xs text-[var(--color-ink-500)]">
                {t('admin.gallery.currentImagesDescription')}
              </p>
            </div>

            {item.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {item.images.map((image) => {
                  const isDeleting =
                    deletingImageId === image._id;

                  return (
                    <div
                      key={image._id}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--color-sage-50)]"
                    >
                      <img
                        src={image.url}
                        alt=""
                        className={[
                          'h-full w-full object-cover',
                          'transition-transform duration-300',
                          'group-hover:scale-105',
                          isDeleting ? 'opacity-40' : '',
                        ].join(' ')}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          onRemoveExisting(image._id)
                        }
                        disabled={
                          isSubmitting ||
                          deletingImageId !== null
                        }
                        aria-label={t(
                          'admin.gallery.removeImage',
                        )}
                        className={[
                          'absolute right-2 top-2 flex h-8 w-8',
                          'items-center justify-center rounded-full',
                          'bg-black/65 text-white shadow-md',
                          'backdrop-blur-sm transition-all',
                          'hover:bg-[var(--color-terracotta-600)]',
                          'focus:outline-none focus:ring-2 focus:ring-white',
                          'disabled:cursor-not-allowed disabled:opacity-60',
                        ].join(' ')}
                      >
                        {isDeleting ? (
                          <span
                            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                            aria-hidden="true"
                          />
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 6l12 12M18 6 6 18"
                            />
                          </svg>
                        )}
                      </button>

                      <div className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        {t('admin.gallery.existing')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--color-sage-300)] bg-[var(--color-cream-50)] px-4 py-8 text-center">
                <p className="text-sm text-[var(--color-ink-500)]">
                  {t('admin.gallery.noImages')}
                </p>
              </div>
            )}
          </div>

          {/* Replacement images */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-[var(--color-ink-700)]">
                {t('admin.gallery.replaceImages')}
              </h3>

              <p className="mt-0.5 text-xs text-[var(--color-ink-500)]">
                {t('admin.gallery.replaceImagesDescription')}
              </p>
            </div>

            <ImageDropzone
              multiple
              existingImages={[]}
              onFilesSelected={setFiles}
            />

            {files.length > 0 && (
              <div className="mt-3 rounded-xl border border-[var(--color-sage-200)] bg-[var(--color-sage-50)] px-4 py-3">
                <p className="text-xs font-medium text-[var(--color-forest-700)]">
                  {t('admin.gallery.replacementSelected', {
                    count: files.length,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] bg-[var(--color-cream-50)] px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('admin.gallery.cancel')}
          </Button>

          <Button
            type="submit"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t('admin.gallery.saving')
              : t('admin.gallery.saveChanges')}
          </Button>
        </div>
      </form>
    </div>
  );
}