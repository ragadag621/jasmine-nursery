import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchContactMessages, updateContactStatus, deleteContactMessage } from '@/api/contact.api';
import type { ContactStatus } from '@/types/contact.types';
import { MessagesTable } from '@/components/admin/MessagesTable';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useToast } from '@/context/ToastContext';
import { setPageMeta } from '@/utils/seo';

const STATUS_TABS: { value?: ContactStatus; label: string }[] = [
  { value: undefined, label: 'הכל' },
  { value: 'new', label: 'חדש' },
  { value: 'read', label: 'נקרא' },
  { value: 'resolved', label: 'טופל' },
];

export default function MessagesPage() {
  const [statusFilter, setStatusFilter] = useState<ContactStatus | undefined>(undefined);
  const { showToast } = useToast();

  useEffect(() => {
    setPageMeta('הודעות פנייה', undefined);
  }, []);

  const { data, status, error, refetch } = useFetch(
    () => fetchContactMessages({ status: statusFilter, limit: 50 }),
    [statusFilter]
  );

  const handleStatusChange = async (id: string, newStatus: ContactStatus) => {
    try {
      await updateContactStatus(id, newStatus);
      showToast('הסטטוס עודכן', 'success');
      refetch();
    } catch {
      showToast('העדכון נכשל', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את ההודעה?')) return;
    try {
      await deleteContactMessage(id);
      showToast('ההודעה נמחקה', 'success');
      refetch();
    } catch {
      showToast('המחיקה נכשלה', 'error');
    }
  };

  return (
    <div>
      <h1 className="font-display mb-6 text-2xl text-[var(--color-forest-800)]">הודעות פנייה</h1>

      <div className="mb-4 flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              statusFilter === tab.value
                ? 'bg-[var(--color-forest-700)] text-white'
                : 'bg-[var(--color-sage-100)] text-[var(--color-ink-600)] hover:bg-[var(--color-sage-200)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {status === 'loading' && <Skeleton className="h-64 w-full rounded-xl" />}
      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}
      {status === 'success' && (data?.messages.length ?? 0) === 0 && (
        <EmptyState title="אין הודעות" icon="✉️" />
      )}
      {status === 'success' && data && data.messages.length > 0 && (
        <MessagesTable messages={data.messages} onStatusChange={handleStatusChange} onDelete={handleDelete} />
      )}
    </div>
  );
}
