import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';

import { ContactForm } from '@/components/public/ContactForm';
import { MapEmbed } from '@/components/public/MapEmbed';

import { formatWhatsAppLink } from '@/utils/formatters';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';

import { setPageMeta } from '@/utils/seo';

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.6 3.5h2.2l1.4 4.1-2.1 1.8a15.4 15.4 0 0 0 6.5 6.5l1.8-2.1 4.1 1.4v2.2a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 10.5c0 5-8 10-8 10s-8-5-8-10a8 8 0 1 1 16 0Z"
      />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 8.5c.3-.5.7-.5 1-.4l1 .8c.3.2.3.5.2.8l-.4.8c.6 1.1 1.5 2 2.6 2.6l.8-.4c.3-.1.6-.1.8.2l.8 1c.2.3.1.7-.4 1-1 .5-2.1.3-3.1-.2a9 9 0 0 1-3.6-3.6c-.5-1-.7-2.1-.2-3.1Z"
      />
    </svg>
  );
}

export default function ContactPage() {
  const { t } = useTranslation();
  const { data: content } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta(t('contact.title'), undefined);
  }, [t]);

  const phone = content?.phone ?? '054-664-3896';
  const address = content?.address ?? "ג'ת, ישראל";

  const whatsappLink = formatWhatsAppLink(
    content?.whatsapp || content?.phone || '972546643896',
  );

  return (
    <Container
      as="main"
      size="medium"
      className="py-[var(--space-section)]"
    >
      <PageHeader title={t('contact.title')} />

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <Card
          className={[
            'overflow-hidden p-0',
            'transition-shadow duration-300',
            'hover:shadow-[var(--shadow-medium)]',
          ].join(' ')}
        >
          <div className="p-6 sm:p-7">
            <div className="mb-6">
              <h2 className="font-display text-xl text-[var(--color-forest-800)]">
                {t('contact.detailsTitle')}
              </h2>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${phone.replace(/\s|-/g, '')}`}
                className={[
                  'group flex min-h-16 items-center gap-4 rounded-2xl',
                  'border border-[var(--color-border)]',
                  'bg-[var(--color-sage-50)]/60 p-4',
                  'transition-all duration-200',
                  'hover:border-[var(--color-sage-300)]',
                  'hover:bg-[var(--color-sage-100)]',
                  'focus:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--color-forest-600)]',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-11 w-11 shrink-0 items-center justify-center',
                    'rounded-xl',
                    'bg-[var(--color-sage-100)]',
                    'text-[var(--color-forest-700)]',
                    'transition-transform duration-200',
                    'group-hover:scale-105',
                  ].join(' ')}
                >
                  <PhoneIcon />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs text-[var(--color-ink-500)]">
                    {t('contact.form.phone')}
                  </span>

                  <span
                    dir="ltr"
                    className="mt-0.5 block text-start font-medium text-[var(--color-forest-800)]"
                  >
                    {phone}
                  </span>
                </span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'group flex min-h-16 items-center gap-4 rounded-2xl',
                  'border border-[var(--color-border)]',
                  'bg-[var(--color-sage-50)]/60 p-4',
                  'transition-all duration-200',
                  'hover:border-[var(--color-sage-300)]',
                  'hover:bg-[var(--color-sage-100)]',
                  'focus:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--color-forest-600)]',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-11 w-11 shrink-0 items-center justify-center',
                    'rounded-xl',
                    'bg-[var(--color-sage-100)]',
                    'text-[var(--color-forest-700)]',
                    'transition-transform duration-200',
                    'group-hover:scale-105',
                  ].join(' ')}
                >
                  <LocationIcon />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs text-[var(--color-ink-500)]">
                    {t('contact.detailsTitle')}
                  </span>

                  <span className="mt-0.5 block text-sm font-medium text-[var(--color-forest-800)]">
                    {address}
                  </span>
                </span>
              </a>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block"
            >
              <Button className="w-full" size="lg">
                <span className="flex items-center justify-center gap-2">
                  <WhatsAppIcon />
                  {t('contact.whatsappCta')}
                </span>
              </Button>
            </a>
          </div>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="mb-6">
            <h2 className="font-display text-xl text-[var(--color-forest-800)]">
              {t('contact.formTitle')}
            </h2>
          </div>

          <ContactForm />
        </Card>
      </div>

      <MapEmbed
        mapEmbedUrl={content?.mapEmbedUrl}
        address={content?.address}
      />
    </Container>
  );
}