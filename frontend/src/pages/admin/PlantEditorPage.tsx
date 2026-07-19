import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { fetchCategories } from '@/api/categories.api';
import { fetchPlantByIdAdmin, createPlant, updatePlant, buildPlantFormData } from '@/api/plants.api';
import type { PlantFormValues } from '@/components/admin/PlantForm';
import { PlantForm } from '@/components/admin/PlantForm';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

export default function PlantEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPageMeta(isEditMode ? 'עריכת צמח' : 'הוספת צמח', undefined);
  }, [isEditMode]);

  const { data: categories, status: categoriesStatus } = useFetch(fetchCategories, []);
  const {
    data: plant,
    status: plantStatus,
    error: plantError,
  } = useFetch(() => (id ? fetchPlantByIdAdmin(id) : Promise.resolve(null)), [id]);

  const handleSubmit = async (values: PlantFormValues, files: File[]) => {
    setIsSubmitting(true);
    try {
      const formData = buildPlantFormData(values, files);
      if (isEditMode && id) {
        await updatePlant(id, formData);
        showToast('הצמח עודכן בהצלחה', 'success');
      } else {
        await createPlant(formData);
        showToast('הצמח נוסף בהצלחה', 'success');
      }
      navigate('/admin/plants');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'השמירה נכשלה', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesStatus === 'loading' || (isEditMode && plantStatus === 'loading')) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  if (isEditMode && plantStatus === 'error') {
    return <ErrorState message={plantError ?? undefined} />;
  }

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl text-[var(--color-forest-800)]">
        {isEditMode ? 'עריכת צמח' : 'הוספת צמח חדש'}
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
