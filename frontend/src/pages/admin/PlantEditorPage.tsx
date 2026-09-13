import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';

import {
  fetchCategories,
} from '@/api/categories.api';

import {
  fetchPlantByIdAdmin,
  createPlant,
  updatePlant,
  buildPlantFormData,
} from '@/api/plants.api';

import type { PlantFormValues } from '@/components/admin/PlantForm';
import { PlantForm } from '@/components/admin/PlantForm';

import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

export default function PlantEditorPage() {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const isEditMode = !!id;

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPageMeta(
      isEditMode
        ? t('admin.plantEditor.editTitle')
        : t('admin.plantEditor.createTitle'),
      undefined
    );
  }, [isEditMode, t]);

  const {
    data: categories,
    status: categoriesStatus,
  } = useFetch(fetchCategories, []);

  const {
    data: plant,
    status: plantStatus,
    error: plantError,
  } = useFetch(
    () =>
      id
        ? fetchPlantByIdAdmin(id)
        : Promise.resolve(null),
    [id]
  );

  const handleSubmit = async (
    values: PlantFormValues,
    files: File[]
  ) => {
    setIsSubmitting(true);

    try {
      const formData = buildPlantFormData(
        values,
        files
      );

      if (isEditMode && id) {
        await updatePlant(id, formData);

        showToast(
          t('admin.plantEditor.updateSuccess'),
          'success'
        );
      } else {
        await createPlant(formData);

        showToast(
          t('admin.plantEditor.createSuccess'),
          'success'
        );
      }

      navigate('/admin/plants');
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          t('admin.plantEditor.saveFailed'),
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    categoriesStatus === 'loading' ||
    (isEditMode && plantStatus === 'loading')
  ) {
    return (
      <Skeleton
        className="h-96 w-full"
        radius="var(--radius-card)"
      />
    );
  }

  if (
    isEditMode &&
    plantStatus === 'error'
  ) {
    return (
      <ErrorState
        message={plantError ?? undefined}
      />
    );
  }

  return (
    <div className="w-full">
      <h1
        className="
          mb-5
          font-display
          text-xl
          leading-tight
          text-[var(--color-forest-800)]
          sm:mb-6
          sm:text-2xl
        "
      >
        {isEditMode
          ? t('admin.plantEditor.editTitle')
          : t('admin.plantEditor.createTitle')}
      </h1>

      <PlantForm
        categories={categories ?? []}
        initial={plant ?? undefined}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
