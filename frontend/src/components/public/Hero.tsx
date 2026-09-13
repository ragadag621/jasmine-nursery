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

  const heroImage =
    content?.heroImage?.url ||
    '/placeholders/hero-placeholder.svg';

  const titleKey = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <section
      className="
        relative
        flex
        min-h-[68vh]
        items-center
        justify-center
        overflow-hidden
        bg-cover
        bg-center
        px-4
        py-16
        text-center
        sm:min-h-[72vh]
        md:min-h-[78vh]
      "
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Darker overlay at the bottom for text contrast */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[var(--color-forest-950)]/60
          via-[var(--color-forest-900)]/25
          to-transparent
        "
      />

      {/* Subtle top overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-black/10
          to-transparent
        "
      />

      <div
        className="
          relative
          z-10
          flex
          max-w-2xl
          flex-col
          items-center
          gap-4
          px-2
          animate-[fadeInUp_0.7s_var(--ease-botanical)]
          sm:gap-5
        "
      >
        

        <span
          className="
            rounded-full
            border
            border-white/30
            bg-white/10
            px-3.5
            py-1.5
            text-xs
            font-medium
            tracking-wide
            text-white
            backdrop-blur-sm
            sm:px-4
          "
        >
          {content?.address ?? t('home.heroAddressFallback')}
        </span>

        <h1
          className="
            max-w-xl
            font-display
            text-[clamp(2rem,9vw,3.75rem)]
            leading-[1.12]
            text-white
            drop-shadow-sm
          "
        >
          {content?.heroTitle?.[titleKey] ||
            t('home.heroTitleFallback')}
        </h1>

        <p
          className="
            max-w-lg
            text-sm
            leading-6
            text-white/90
            sm:text-base
            sm:leading-7
            md:text-xl
          "
        >
          {content?.heroSubtitle?.[titleKey] ||
            t('home.heroSubtitleFallback')}
        </p>

        <div
          className="
            mt-2
            flex
            w-full
            max-w-sm
            flex-col
            items-stretch
            justify-center
            gap-3
            sm:mt-3
            sm:max-w-none
            sm:flex-row
            sm:items-center
          "
        >
          <Link
            to="/plants"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto"
            >
              {t('home.viewPlants')}
            </Button>
          </Link>

          <a
            href={formatWhatsAppLink(
              content?.whatsapp ||
                content?.phone ||
                '972546643896'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              className="
                w-full
                border-white/70
                bg-white/5
                text-white
                backdrop-blur-sm
                hover:bg-[var(--color-forest-900)]
                sm:w-auto
              "
            >
              {t('home.contactWhatsApp')}
            </Button>
          </a>
        </div>
      </div>

      {/* Soft transition into the page background */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-16
          bg-gradient-to-b
          from-transparent
          to-[var(--color-cream-100)]
          sm:h-24
        "
      />
    </section>
  );
}