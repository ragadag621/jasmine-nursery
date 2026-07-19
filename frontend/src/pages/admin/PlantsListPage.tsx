import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchPlantsAdmin, togglePlantVisibility, deletePlant } from '@/api/plants.api';
import { PlantTable } from '@/components/admin/PlantTable';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

export default function PlantsListPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const { showToast } = useToast();

  useEffect(() => {
    setPageMeta('ניהול צמחים', undefined);
  }, []);

  const { data, status, error, refetch } = useFetch(
    () => fetchPlantsAdmin({ search: debouncedSearch, limit: 50 }),
    [debouncedSearch]
  );

  const handleToggleVisibility = async (id: string) => {
    try {
      await togglePlantVisibility(id);
      showToast('הסטטוס עודכן', 'success');
      refetch();
    } catch {
      showToast('העדכון נכשל', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את הצמח? פעולה זו אינה הפיכה.')) return;
    try {
      await deletePlant(id);
      showToast('הצמח נמחק', 'success');
      refetch();
    } catch {
      showToast('המחיקה נכשלה', 'error');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-[var(--color-forest-800)]">ניהול צמחים</h1>
        <Link to="/admin/plants/new">
          <Button>+ הוספת צמח</Button>
        </Link>
      </div>

      <input
        type="search"
        placeholder="חיפוש צמח..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-xs rounded-md border border-[var(--color-sage-300)] px-3 py-2"
      />

      {status === 'loading' && <Skeleton className="h-64 w-full rounded-xl" />}
      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}
      {status === 'success' && (data?.plants.length ?? 0) === 0 && (
        <EmptyState title="אין עדיין צמחים" description="לחצו על 'הוספת צמח' כדי להתחיל" />
      )}
      {status === 'success' && data && data.plants.length > 0 && (
        <PlantTable plants={data.plants} onToggleVisibility={handleToggleVisibility} onDelete={handleDelete} />
      )}
    </div>
  );
}
