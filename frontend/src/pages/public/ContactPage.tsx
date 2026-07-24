import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { ContactForm } from '@/components/public/ContactForm';
import { MapEmbed } from '@/components/public/MapEmbed';
import { formatWhatsAppLink } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { setPageMeta } from '@/utils/seo';

export default function ContactPage() {
  const { t } = useTranslation();
  const { data: content } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta(t('contact.title'), undefined);
  }, [t]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-14 md:px-6">
      <h1 className="font-display mb-8 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('contact.title')}
      </h1>

      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-sage-200)] p-7 shadow-[var(--shadow-soft)]">
          <h2 className="font-display mb-4 text-lg text-[var(--color-forest-800)]">
            {t('contact.detailsTitle')}
          </h2>
          <ul className="space-y-2 text-[var(--color-ink-900)]">
            <li>📞 {content?.phone ?? '054-664-3896'}</li>
            <li>📍 {content?.address ?? "ג'ת, ישראל"}</li>
          </ul>
          <a
            href={formatWhatsAppLink(content?.whatsapp || content?.phone || '972546643896')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block"
          >
            <Button className="w-full">{t('contact.whatsappCta')}</Button>
          </a>
        </div>

        <div className="rounded-2xl border border-[var(--color-sage-200)] p-7 shadow-[var(--shadow-soft)]">
          <h2 className="font-display mb-4 text-lg text-[var(--color-forest-800)]">
            {t('contact.formTitle')}
          </h2>
          <ContactForm />
        </div>
      </div>

      <MapEmbed mapEmbedUrl={content?.mapEmbedUrl} address={content?.address} />
    </main>
  );
}
