import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  return (
    <label className="block text-sm text-[var(--color-ink-900)]" htmlFor={id}>
      {label && <span className="mb-1 block font-medium">{label}</span>}
      <input
        id={id}
        className={`w-full rounded-md border px-3 py-2 outline-none transition-colors focus:border-[var(--color-forest-600)] ${
          error ? 'border-[var(--color-terracotta-500)]' : 'border-[var(--color-sage-300)]'
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-[var(--color-terracotta-600)]">{error}</span>}
    </label>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...rest }: TextareaProps) {
  return (
    <label className="block text-sm text-[var(--color-ink-900)]" htmlFor={id}>
      {label && <span className="mb-1 block font-medium">{label}</span>}
      <textarea
        id={id}
        className={`w-full rounded-md border px-3 py-2 outline-none transition-colors focus:border-[var(--color-forest-600)] ${
          error ? 'border-[var(--color-terracotta-500)]' : 'border-[var(--color-sage-300)]'
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <span className="mt-1 block text-xs text-[var(--color-terracotta-600)]">{error}</span>}
    </label>
  );
}
