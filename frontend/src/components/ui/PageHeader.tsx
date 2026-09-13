import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  align?: 'center' | 'start';
  as?: 'h1' | 'h2';
  className?: string;
}

/**
 * The "title + optional description" block was hand-written with slightly
 * different sizes/margins on About, Catalog, Gallery, Services, Contact,
 * and every homepage section. This is the one place that pattern lives now.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  align = 'center',
  as: Tag = 'h1',
  className = '',
}: PageHeaderProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-start items-start';
  const headingSize = Tag === 'h1' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl';

  return (
    <div className={`mb-10 flex flex-col gap-3 ${alignment} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-forest-600)]">
          {eyebrow}
        </span>
      )}
      <Tag className={`font-display ${headingSize} text-[var(--color-forest-800)]`}>{title}</Tag>
      {description && (
        <p className="max-w-xl text-[var(--color-ink-600)]">{description}</p>
      )}
    </div>
  );
}
