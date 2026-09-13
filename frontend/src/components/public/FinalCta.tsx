import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { formatWhatsAppLink } from '@/utils/formatters';

import type { SiteContent } from '@/types/content.types';

interface FinalCtaProps {
  content: SiteContent | null;
}

export function FinalCta({ content }: FinalCtaProps) {
  const { t } = useTranslation();

  const whatsappHref = formatWhatsAppLink(
    content?.whatsapp || content?.phone || '972546643896'
  );

  return (
    <section
      className="
        bg-[var(--color-forest-800)]
        py-12
        text-center
        text-white
        sm:py-14
        md:py-[var(--space-section-sm)]
      "
    >
      <Container size="narrow">
        <h2
          className="
            font-display
            text-[clamp(1.5rem,6vw,1.875rem)]
            leading-tight
          "
        >
          {t('home.finalCtaTitle')}
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-xl
            text-sm
            leading-6
            text-white/85
            sm:text-base
            sm:leading-7
          "
        >
          {t('home.finalCtaSubtitle')}
        </p>

        <div
          className="
            mt-6
            flex
            flex-col
            items-stretch
            justify-center
            gap-3
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
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {t('home.viewPlants')}
            </Button>
          </Link>

          <a
            href={whatsappHref}
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
                text-white
                hover:bg-white
                hover:text-[var(--color-forest-800)]
                sm:w-auto
              "
            >
              {t('home.contactWhatsApp')}
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
}