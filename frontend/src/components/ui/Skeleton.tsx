interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--color-sage-200)] ${className}`}
      aria-hidden="true"
    />
  );
}

export function PlantCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-4">
      <Skeleton className="mb-3 h-48 w-full rounded-lg" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
