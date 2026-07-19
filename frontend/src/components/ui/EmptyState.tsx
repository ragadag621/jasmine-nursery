interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export function EmptyState({ title, description, icon = '🌿' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-sage-300)] px-6 py-16 text-center">
      <span className="text-4xl" aria-hidden="true">{icon}</span>
      <p className="font-display text-lg text-[var(--color-forest-800)]">{title}</p>
      {description && <p className="text-sm text-[var(--color-ink-600)]">{description}</p>}
    </div>
  );
}
