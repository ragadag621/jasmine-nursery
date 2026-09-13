import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';

import {
  fetchGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  deleteGalleryImage,
  buildGalleryFormData,
} from '@/api/gallery.api';

import type { GalleryFormValues } from '@/components/admin/GalleryUploader';
import { GalleryUploader } from '@/components/admin/GalleryUploader';
import {
  GalleryEditor,
  type GalleryEditValues,
} from '@/pages/admin/GalleryEditor';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

const CATEGORY_TRANSLATION_KEYS: Record<string, string> = {
  nursery: 'admin.gallery.categories.nursery',
  'before-after': 'admin.gallery.categories.beforeAfter',
  events: 'admin.gallery.categories.events',
};

export default function GalleryManagerPage() {
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(
    null,
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const languageKey = i18n.language === 'ar' ? 'ar' : 'he';

  const {
    data: items,
    status,
    error,
    refetch,
  } = useFetch(() => fetchGallery(), []);

  useEffect(() => {
    setPageMeta(t('admin.gallery.pageTitle'), undefined);
  }, [t]);

  useEffect(() => {
    if (!editingId) return;

    requestAnimationFrame(() => {
      document
        .getElementById('gallery-editor')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    });
  }, [editingId]);

  const handleCreate = async (
    values: GalleryFormValues,
    files: File[],
  ) => {
    if (files.length === 0) {
      showToast(
        t('admin.gallery.selectAtLeastOneImage'),
        'error',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createGalleryItem(
        buildGalleryFormData(values, files),
      );

      showToast(
        t('admin.gallery.createSuccess'),
        'success',
      );

      await refetch();
    } catch (err: unknown) {
      const message =
        (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        )?.response?.data?.message ??
        t('admin.gallery.createError');

      showToast(message, 'error');

      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    id: string,
    values: GalleryEditValues,
    files: File[],
  ) => {
    setIsSubmitting(true);

    try {
      const formData = buildGalleryFormData(
        values,
        files,
      );

      await updateGalleryItem(id, formData);

      showToast(
        t('admin.gallery.updateSuccess'),
        'success',
      );

      setEditingId(null);

      await refetch();
    } catch (err: unknown) {
      const message =
        (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        )?.response?.data?.message ??
        t('admin.gallery.updateError');

      showToast(message, 'error');

      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      t('admin.gallery.deleteConfirmation'),
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await deleteGalleryItem(id);

      if (editingId === id) {
        setEditingId(null);
      }

      showToast(
        t('admin.gallery.deleteSuccess'),
        'success',
      );

      await refetch();
    } catch {
      showToast(
        t('admin.gallery.deleteError'),
        'error',
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteImage = async (
    itemId: string,
    imageId: string,
  ) => {
    const confirmed = window.confirm(
      t('admin.gallery.deleteImageConfirmation'),
    );

    if (!confirmed) return;

    setDeletingImageId(imageId);

    try {
      await deleteGalleryImage(itemId, imageId);

      showToast(
        t('admin.gallery.deleteImageSuccess'),
        'success',
      );

      await refetch();
    } catch (err: unknown) {
      const message =
        (
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        )?.response?.data?.message ??
        t('admin.gallery.deleteImageError');

      showToast(message, 'error');
    } finally {
      setDeletingImageId(null);
    }
  };

  const getCategoryLabel = (category: string) => {
    const translationKey =
      CATEGORY_TRANSLATION_KEYS[category];

    return translationKey
      ? t(translationKey)
      : category;
  };

  const editingItem = items?.find(
    (item) => item._id === editingId,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--color-forest-800)]">
          {t('admin.gallery.pageTitle')}
        </h1>

        <p className="mt-1 text-sm text-[var(--color-ink-500)]">
          {t('admin.gallery.pageDescription')}
        </p>
      </div>

      {editingItem ? (
        <div id="gallery-editor">
          <GalleryEditor
            item={editingItem}
            onSubmit={(values, files) =>
              handleUpdate(
                editingItem._id,
                values,
                files,
              )
            }
            onRemoveExisting={(imageId) =>
              handleDeleteImage(
                editingItem._id,
                imageId,
              )
            }
            onCancel={() => setEditingId(null)}
            isSubmitting={isSubmitting}
            deletingImageId={deletingImageId}
          />
        </div>
      ) : (
        <GalleryUploader
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      )}

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-forest-800)]">
              {t('admin.gallery.itemsTitle')}
            </h2>

            <p className="mt-1 text-sm text-[var(--color-ink-500)]">
              {t('admin.gallery.itemsDescription')}
            </p>
          </div>

          {status === 'success' &&
            items &&
            items.length > 0 && (
              <span className="shrink-0 rounded-full bg-[var(--color-sage-100)] px-3 py-1 text-xs font-medium text-[var(--color-forest-700)]">
                {t('admin.gallery.itemCount', {
                  count: items.length,
                })}
              </span>
            )}
        </div>

        {status === 'loading' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <Card
                  key={index}
                  className="overflow-hidden p-0"
                >
                  <Skeleton className="aspect-square w-full" />

                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </Card>
              ),
            )}
          </div>
        )}

        {status === 'error' && (
          <ErrorState
            message={error ?? undefined}
            onRetry={refetch}
          />
        )}

        {status === 'success' &&
          (items?.length ?? 0) === 0 && (
            <EmptyState
              title={t('admin.gallery.empty')}
            />
          )}

        {status === 'success' &&
          items &&
          items.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const title =
                  item.title[languageKey];

                const imageCount =
                  item.images.length;

                const firstImage =
                  item.images[0]?.url ||
                  '/placeholders/gallery-placeholder.svg';

                const isEditing =
                  editingId === item._id;

                const isDeleting =
                  deletingId === item._id;

                return (
                  <Card
                    key={item._id}
                    className={[
                      'group overflow-hidden p-0 transition-all duration-200',
                      'hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)]',
                      isEditing
                        ? 'ring-2 ring-[var(--color-forest-500)]'
                        : '',
                    ].join(' ')}
                  >
                    <div className="relative aspect-square overflow-hidden bg-[var(--color-sage-50)]">
                      <img
                        src={firstImage}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-botanical)] group-hover:scale-105"
                      />

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/65 via-black/20 to-transparent p-3 pt-10">
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[var(--color-forest-800)] backdrop-blur-sm">
                          {getCategoryLabel(
                            item.category,
                          )}
                        </span>

                        <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {t(
                            'admin.gallery.imageCount',
                            {
                              count: imageCount,
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 p-4">
                      <div>
                        <h3
                          className="truncate text-sm font-semibold text-[var(--color-forest-800)]"
                          title={title}
                        >
                          {title}
                        </h3>

                        {languageKey === 'ar' &&
                          item.title.he && (
                            <p
                              className="mt-1 truncate text-xs text-[var(--color-ink-400)]"
                              dir="rtl"
                              title={item.title.he}
                            >
                              {item.title.he}
                            </p>
                          )}

                        {languageKey === 'he' &&
                          item.title.ar && (
                            <p
                              className="mt-1 truncate text-xs text-[var(--color-ink-400)]"
                              dir="rtl"
                              title={item.title.ar}
                            >
                              {item.title.ar}
                            </p>
                          )}
                      </div>

                      {imageCount > 1 && (
                        <div className="grid grid-cols-4 gap-1.5">
                          {item.images
                            .slice(0, 4)
                            .map((image) => (
                              <div
                                key={image._id}
                                className="aspect-square overflow-hidden rounded-lg bg-[var(--color-sage-50)]"
                              >
                                <img
                                  src={image.url}
                                  alt=""
                                  loading="lazy"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          disabled={
                            isSubmitting ||
                            deletingId !== null
                          }
                          onClick={() =>
                            setEditingId(item._id)
                          }
                        >
                          {t('admin.gallery.edit')}
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          isLoading={isDeleting}
                          disabled={
                            deletingId !== null &&
                            !isDeleting
                          }
                          onClick={() =>
                            handleDelete(item._id)
                          }
                        >
                          {t('admin.gallery.delete')}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
      </section>
    </div>
  );
}