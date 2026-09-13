interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
        border-[var(--color-sage-300)]
        bg-white
        px-6
        py-12
        text-center
        sm:py-16
      "
    >
      <p
        className="
          font-display
          text-lg
          text-[var(--color-forest-800)]
          sm:text-xl
        "
      >
        {title}
      </p>

      {description && (
        <p
          className="
            mt-1
            max-w-md
            text-sm
            leading-6
            text-[var(--color-ink-600)]
          "
        >
          {description}
        </p>
      )}
    </div>
  );
}