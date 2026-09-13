import type { ElementType, ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  size?: 'default' | 'narrow' | 'medium' | 'wide';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<ContainerProps['size']>, string> = {
  narrow: 'max-w-3xl',
  medium: 'max-w-4xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
};

/**
 * Single source of truth for page-content width + horizontal gutters.
 * Every public page previously repeated `mx-auto max-w-6xl px-4 md:px-6`
 * by hand — centralizing it here means the gutter/width can change once,
 * everywhere, and pages can't silently drift out of alignment with each
 * other.
 */
export function Container({ children, as: Tag = 'div', size = 'default', className = '' }: ContainerProps) {
  return <Tag className={`mx-auto px-4 md:px-6 ${SIZE_CLASSES[size]} ${className}`}>{children}</Tag>;
}
