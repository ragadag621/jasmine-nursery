import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  buildCategoryFormData,
} from '@/api/categories.api';

import type { CategoryFormValues } from '@/components/admin/CategoryForm';
import { CategoryForm } from '@/components/admin/CategoryForm';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

import type { Category } from '@/types/category.types';

export default function CategoriesPage() {
  const { t, i18n } = useTranslation();

  const {
    data: categories,
    status,
    error,
    refetch,
  } = useFetch(fetchCategories, []);

  const { showToast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentLanguage = i18n.language.startsWith('ar')
    ? 'ar'
    : 'he';

  useEffect(() => {
    setPageMeta(t('admin.categories.pageTitle'), undefined);
  }, [t]);

  const handleCreate = async (
    values: CategoryFormValues,
    file: File | null
  ) => {
    setIsSubmitting(true);

    try {
      await createCategory(
        buildCategoryFormData(values, file)
      );

      showToast(
        t('admin.categories.createSuccess'),
        'success'
      );

      setIsCreateOpen(false);
      refetch();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          t('admin.categories.createError'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    values: CategoryFormValues,
    file: File | null
  ) => {
    if (!editingCategory) return;

    setIsSubmitting(true);

    try {
      await updateCategory(
        editingCategory._id,
        buildCategoryFormData(values, file)
      );

      showToast(
        t('admin.categories.updateSuccess'),
        'success'
      );

      setEditingCategory(null);
      refetch();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          t('admin.categories.updateError'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        t('admin.categories.deleteConfirmation')
      )
    ) {
      return;
    }

    try {
      await deleteCategory(id);

      showToast(
        t('admin.categories.deleteSuccess'),
        'success'
      );

      refetch();
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          t('admin.categories.deleteError'),
        'error'
      );
    }
  };

  return (
    <div className="w-full">
      <div
        className="
          mb-4
          flex
          flex-col
          gap-2
          sm:mb-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <h1
          className="
            font-display
            text-lg
            leading-tight
            text-[var(--color-forest-800)]
            sm:text-xl
            lg:text-2xl
          "
        >
          {t('admin.categories.pageTitle')}
        </h1>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          {t('admin.categories.add')}
        </Button>
      </div>

      {status === 'loading' && (
        <div
          className="
            grid
            grid-cols-2
            gap-2.5
            sm:gap-3
            lg:grid-cols-4
          "
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              className="
                h-40
                w-full
                rounded-lg
                sm:h-44
              "
            />
          ))}
        </div>
      )}

      {status === 'error' && (
        <ErrorState
          message={error ?? undefined}
          onRetry={refetch}
        />
      )}

      {status === 'success' &&
        (categories?.length ?? 0) === 0 && (
          <EmptyState
            title={t('admin.categories.emptyTitle')}
            description={t(
              'admin.categories.emptyDescription'
            )}
          />
        )}

      {status === 'success' &&
        categories &&
        categories.length > 0 && (
          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:grid-cols-3
              sm:gap-3
              lg:grid-cols-4
              lg:gap-4
            "
          >
            {categories.map((category) => {
              const categoryName =
                category.name[currentLanguage];

              return (
                <Card
                  key={category._id}
                  className="
                    overflow-hidden
                    p-0
                  "
                >
                  <img
                    src={
                      category.image?.url ||
                      '/placeholders/gallery-placeholder.svg'
                    }
                    alt={categoryName}
                    className="
                      aspect-[4/3]
                      w-full
                      object-cover
                    "
                    loading="lazy"
                  />

                  <div className="p-2.5 sm:p-3">
                    <p
                      className="
                        mb-2
                        line-clamp-2
                        min-h-9
                        text-xs
                        font-medium
                        leading-4
                        text-[var(--color-forest-800)]
                        sm:text-sm
                        sm:leading-5
                      "
                    >
                      {categoryName}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditingCategory(category)
                        }
                        className="
                          min-h-9
                          w-full
                          px-2
                          text-xs
                          sm:min-h-10
                          sm:text-sm
                        "
                      >
                        {t('admin.categories.edit')}
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          handleDelete(category._id)
                        }
                        className="
                          min-h-9
                          w-full
                          px-2
                          text-xs
                          sm:min-h-10
                          sm:text-sm
                        "
                      >
                        {t('admin.categories.delete')}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={t('admin.categories.addTitle')}
      >
        <CategoryForm
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title={t('admin.categories.editTitle')}
      >
        {editingCategory && (
          <CategoryForm
            initial={editingCategory}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
}