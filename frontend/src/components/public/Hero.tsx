import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { formatWhatsAppLink } from '@/utils/formatters';
import type { SiteContent } from '@/types/content.types';

interface HeroProps {
  content: SiteContent | null;
}

export function Hero({ content }: HeroProps) {
  const heroImage = content?.heroImage?.url || '/placeholders/hero-placeholder.svg';

  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center px-4 text-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-cream-100)]/10 to-[var(--color-cream-100)]/70" />
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-4 animate-[fadeIn_0.6s_ease-out]">
        <h1 className="font-display text-4xl leading-tight text-[var(--color-forest-900)] md:text-5xl">
          {content?.heroTitle?.he ?? 'משתלת אליאסמין'}
        </h1>
        <p className="text-lg text-[var(--color-ink-600)]">
          {content?.heroSubtitle?.he ?? 'מגוון עצום של צמחים, פרחים ועצים'}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Link to="/plants">
            <Button size="lg">עיינו בצמחים</Button>
          </Link>
          <a
            href={formatWhatsAppLink(content?.whatsapp || content?.phone || '972546643896')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline">
              צור קשר בוואטסאפ
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
