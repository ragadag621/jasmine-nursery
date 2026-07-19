import { Link } from 'react-router-dom';
import type { SiteContent } from '@/types/content.types';

interface AboutPreviewProps {
  content: SiteContent | null;
}

export function AboutPreview({ content }: AboutPreviewProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
      <h2 className="font-display mb-4 text-2xl text-[var(--color-forest-800)] md:text-3xl">
        קצת עלינו
      </h2>
      <p className="leading-relaxed text-[var(--color-ink-600)]">
        {content?.aboutText?.he ?? '[טקסט זמני — יוחלף בתוכן אמיתי על ידי הלקוח]'}
      </p>
      <Link
        to="/about"
        className="mt-4 inline-block text-sm font-medium text-[var(--color-forest-700)] hover:underline"
      >
        קראו עוד עלינו ←
      </Link>
    </section>
  );
}
