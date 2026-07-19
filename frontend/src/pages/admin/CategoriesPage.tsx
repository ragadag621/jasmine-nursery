import { useEffect, useState } from 'react';
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
  const { data: categories, status, error, refetch } = useFetch(fetchCategories, []);
  const { showToast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPageMeta('ניהול קטגוריות', undefined);
  }, []);

  const handleCreate = async (values: CategoryFormValues, file: File | null) => {
    setIsSubmitting(true);
    try {
      await createCategory(buildCategoryFormData(values, file));
      showToast('הקטגוריה נוספה בהצלחה', 'success');
      setIsCreateOpen(false);
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'ההוספה נכשלה', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: CategoryFormValues, file: File | null) => {
    if (!editingCategory) return;
    setIsSubmitting(true);
    try {
      await updateCategory(editingCategory._id, buildCategoryFormData(values, file));
      showToast('הקטגוריה עודכנה בהצלחה', 'success');
      setEditingCategory(null);
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'העדכון נכשל', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את הקטגוריה?')) return;
    try {
      await deleteCategory(id);
      showToast('הקטגוריה נמחקה', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'המחיקה נכשלה', 'error');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-[var(--color-forest-800)]">ניהול קטגוריות</h1>
        <Button onClick={() => setIsCreateOpen(true)}>+ הוספת קטגוריה</Button>
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (categories?.length ?? 0) === 0 && (
        <EmptyState title="אין עדיין קטגוריות" description="לחצו על 'הוספת קטגוריה' כדי להתחיל" />
      )}

      {status === 'success' && categories && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <Card key={cat._id} className="overflow-hidden p-0">
              <img
                src={cat.image?.url || '/placeholders/gallery-placeholder.svg'}
                alt={cat.name.he}
                className="h-24 w-full object-cover"
              />
              <div className="p-3">
                <p className="mb-2 font-medium text-[var(--color-forest-800)]">{cat.name.he}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingCategory(cat)}>
                    עריכה
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(cat._id)}>
                    מחיקה
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="הוספת קטגוריה">
        <CategoryForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
      </Modal>

      <Modal isOpen={!!editingCategory} onClose={() => setEditingCategory(null)} title="עריכת קטגוריה">
        {editingCategory && (
          <CategoryForm initial={editingCategory} onSubmit={handleUpdate} isSubmitting={isSubmitting} />
        )}
      </Modal>
    </div>
  );
}
