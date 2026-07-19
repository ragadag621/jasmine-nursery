import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchDashboardStats } from '@/api/dashboard.api';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { setPageMeta } from '@/utils/seo';

export default function DashboardPage() {
  const { data: stats, status, error, refetch } = useFetch(fetchDashboardStats, []);

  useEffect(() => {
    setPageMeta('לוח בקרה', undefined);
  }, []);

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl text-[var(--color-forest-800)]">לוח בקרה</h1>

      {status === 'loading' && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && stats && <DashboardStats stats={stats} />}
    </div>
  );
}
