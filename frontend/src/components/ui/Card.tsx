import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-sage-200)] bg-[var(--color-cream-50)] shadow-sm ${
        hoverable
          ? 'transition-all duration-300 ease-[var(--ease-botanical)] hover:-translate-y-1 hover:shadow-md'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
