import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { setPageMeta } from '@/utils/seo';

export default function AboutPage() {
  const { data: content, status, error, refetch } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta('אודות', 'סיפורה של משתלת אליאסמין, הניסיון והערכים שלנו');
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-display mb-6 text-center text-3xl text-[var(--color-forest-800)]">
        אודות המשתלה
      </h1>

      {status === 'loading' && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      )}

      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={refetch} />}

      {status === 'success' && (
        <div className="space-y-4 leading-relaxed text-[var(--color-ink-900)]">
          <p>{content?.aboutText?.he ?? '[טקסט זמני — יוחלף בתוכן אמיתי על ידי הלקוח]'}</p>
          <p className="text-[var(--color-ink-600)]">
            משתלת אליאסמין נמצאת בג'ת ומציעה מגוון עצום של צמחים, פרחים, עצים ועציצים ללקוחות פרטיים
            ומקצועיים באזור. הצוות שלנו זמין לייעוץ אישי ולעזרה במציאת הפתרון הנכון לגינה או לבית שלכם.
          </p>
        </div>
      )}
    </main>
  );
}
