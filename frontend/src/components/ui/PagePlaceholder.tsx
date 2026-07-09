interface PagePlaceholderProps {
  titleHe: string;
  note?: string;
}

/**
 * Generic stand-in used by every not-yet-built page in Phase 1, so the
 * router and navigation structure are fully wired and testable before
 * real page content exists.
 */
export function PagePlaceholder({ titleHe, note }: PagePlaceholderProps) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="font-display text-2xl text-[var(--color-forest-800)]">{titleHe}</h1>
      <p className="font-body text-sm text-[var(--color-ink-600)]">
        {note ?? 'עמוד זה ייבנה בשלב הבא.'}
      </p>
    </main>
  );
}
