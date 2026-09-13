interface SkeletonProps {
  className?: string;
  radius?: string;
}

export function Skeleton({ className = 'h-4 w-full', radius = 'var(--radius-sm)' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-sage-200)] ${className}`}
      style={{ borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export function PlantCardSkeleton() {
  return (
    <div
      className="border border-[var(--color-border)] bg-[var(--color-cream-50)] p-4"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      <Skeleton className="mb-3 h-48 w-full" radius="var(--radius-media)" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
