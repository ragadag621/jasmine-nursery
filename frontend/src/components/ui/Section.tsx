import type { ReactNode } from 'react';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  tone?: 'default' | 'sage' | 'cream-alt';
  spacing?: 'default' | 'compact';
  containerSize?: 'default' | 'narrow' | 'wide';
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<SectionProps['tone']>, string> = {
  default: '',
  sage: 'bg-[var(--color-sage-100)]',
  'cream-alt': 'bg-[var(--color-cream-50)]',
};

/**
 * Wraps a homepage/page section with the shared vertical rhythm
 * (--space-section) and an optional background tone, so alternating
 * section backgrounds are a deliberate, consistent pattern rather than
 * ad-hoc per-section decisions.
 */
export function Section({
  children,
  tone = 'default',
  spacing = 'default',
  containerSize = 'default',
  className = '',
}: SectionProps) {
  const padding = spacing === 'compact' ? 'py-[var(--space-section-sm)]' : 'py-[var(--space-section)]';

  return (
    <section className={`${padding} ${TONE_CLASSES[tone]} ${className}`}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
