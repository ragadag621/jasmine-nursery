import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchGallery, createGalleryItem, deleteGalleryItem, buildGalleryFormData } from '@/api/gallery.api';
import type { GalleryFormValues } from '@/components/admin/GalleryUploader';
import { GalleryUploader } from '@/components/admin/GalleryUploader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

export default function GalleryManagerPage() {
  const { data: items, status, error, refetch } = useFetch(() => fetchGallery(), []);
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPageMeta('ניהול גלריה', undefined);
  }, []);

  const handleCreate = async (values: GalleryFormValues, files: File[]) => {
    if (files.length === 0) {
      showToast('יש לבחור לפחות תמונה אחת', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await createGalleryItem(buildGalleryFormData(values, files));
      showToast('התמונות הועלו בהצלחה', 'success');
      refetch();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'ההעלאה נכשלה', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את פריט הגלריה?')) return;
    try {
      await deleteGalleryItem(id);
      showToast('נמחק בהצלחה', 'success');
      refetch();
    } catch {
      showToast('המחיקה נכשלה', 'error');
    }
  };

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl text-[var(--color-forest-800)]">ניהול גלריה</h1>

      <div className="mb-8">
        <GalleryUploader onSubmit={handleCreate} isSubmitting={isSubmitting} />
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (items?.length ?? 0) === 0 && (
        <EmptyState title="אין עדיין תמונות בגלריה" />
      )}

      {status === 'success' && items && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden p-0">
              <img
                src={item.images[0]?.url || '/placeholders/gallery-placeholder.svg'}
                alt={item.title.he}
                className="aspect-square w-full object-cover"
              />
              <div className="p-2">
                <p className="mb-2 truncate text-sm font-medium text-[var(--color-forest-800)]">
                  {item.title.he}
                </p>
                <Button size="sm" variant="danger" onClick={() => handleDelete(item._id)}>
                  מחיקה
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
