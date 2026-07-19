import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  success: 'bg-[var(--color-forest-600)]/10 text-[var(--color-forest-700)]',
  warning: 'bg-[var(--color-terracotta-500)]/15 text-[var(--color-terracotta-600)]',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-[var(--color-sage-200)] text-[var(--color-ink-600)]',
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
