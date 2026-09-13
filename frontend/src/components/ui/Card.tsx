import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`border border-[var(--color-border)] bg-[var(--color-cream-50)] ${
        hoverable
          ? 'transition-all duration-300 ease-[var(--ease-botanical)] hover:-translate-y-1'
          : ''
      } ${className}`}
      style={{ boxShadow: 'var(--shadow-soft)', borderRadius: 'var(--radius-card)' }}
      
      onMouseEnter={
        hoverable
          ? (e) => (e.currentTarget.style.boxShadow = 'var(--shadow-lifted)')
          : undefined
      }
      onMouseLeave={
        hoverable ? (e) => (e.currentTarget.style.boxShadow = 'var(--shadow-soft)') : undefined
      }
      {...rest}
    >
      {children}
    </div>
  );
}
