import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { formatWhatsAppLink } from '@/utils/formatters';
import type { SiteContent } from '@/types/content.types';

interface HeroProps {
  content: SiteContent | null;
}

export function Hero({ content }: HeroProps) {
  const { t, i18n } = useTranslation();
  const heroImage = content?.heroImage?.url || 'https://i.pinimg.com/1200x/e5/c9/61/e5c961ebfffbf0f3a137eb902443c5bb.jpg';
  const titleKey = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <section
      className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-cover bg-center px-4 text-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Layered overlay: darker at the base for text contrast, lighter toward
          the top so the image itself still reads through */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-forest-950)]/55 via-[var(--color-forest-900)]/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-5 px-4 animate-[fadeInUp_0.7s_var(--ease-botanical)]">
        <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white backdrop-blur-sm">
          🌿 {content?.address ?? "ג'ת, ישראל"}
        </span>
        <h1 className="font-display text-4xl leading-[1.15] text-white drop-shadow-sm md:text-6xl">
          {content?.heroTitle?.[titleKey] || t('home.heroTitleFallback')}
        </h1>
        <p className="max-w-lg text-lg text-white/90 md:text-xl">
          {content?.heroSubtitle?.[titleKey] || t('home.heroSubtitleFallback')}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Link to="/plants">
            <Button size="lg">{t('home.viewPlants')}</Button>
          </Link>
          <a
            href={formatWhatsAppLink(content?.whatsapp || content?.phone || '972546643896')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              variant="outline"
              className="border-white/70 bg-white/5 text-white backdrop-blur-sm hover:bg-white hover:text-[var(--color-forest-800)]"
            >
              {t('home.contactWhatsApp')}
            </Button>
          </a>
        </div>
      </div>

      {/* Soft fade into the page background below, so the hero doesn't end abruptly */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[var(--color-cream-100)]" />
    </section>
  );
}
