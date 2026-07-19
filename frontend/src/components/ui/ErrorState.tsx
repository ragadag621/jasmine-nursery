import { Button } from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'משהו השתבש בטעינת הנתונים', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-terracotta-400)]/40 bg-[var(--color-terracotta-400)]/5 px-6 py-16 text-center">
      <span className="text-3xl" aria-hidden="true">⚠️</span>
      <p className="text-[var(--color-ink-900)]">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          נסה שוב
        </Button>
      )}
    </div>
  );
}
