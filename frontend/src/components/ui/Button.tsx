import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[var(--color-forest-700)] text-white shadow-[0_2px_8px_rgba(32,74,43,0.25)] hover:bg-[var(--color-forest-800)] hover:shadow-[0_4px_14px_rgba(32,74,43,0.32)] active:scale-[0.98] disabled:bg-[var(--color-forest-700)]/50 disabled:shadow-none',
  secondary:
    'bg-[var(--color-sage-200)] text-[var(--color-forest-900)] hover:bg-[var(--color-sage-300)] active:scale-[0.98]',
  outline:
    'border border-[var(--color-forest-700)] text-[var(--color-forest-700)] hover:bg-[var(--color-forest-700)] hover:text-white bg-transparent active:scale-[0.98]',
  ghost: 'bg-transparent text-[var(--color-forest-700)] hover:bg-[var(--color-sage-100)] active:scale-[0.98]',
  danger: 'bg-[var(--color-terracotta-600)] text-white hover:bg-[var(--color-terracotta-500)] active:scale-[0.98]',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3.5 text-base rounded-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 ease-[var(--ease-botanical)] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
