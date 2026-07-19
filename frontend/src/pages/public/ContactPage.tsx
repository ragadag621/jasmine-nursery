import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { ContactForm } from '@/components/public/ContactForm';
import { MapEmbed } from '@/components/public/MapEmbed';
import { formatWhatsAppLink } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';
import { setPageMeta } from '@/utils/seo';

export default function ContactPage() {
  const { data: content } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta('צור קשר', 'פרטי יצירת קשר עם משתלת אליאסמין - טלפון, וואטסאפ וטופס פנייה');
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-display mb-6 text-center text-3xl text-[var(--color-forest-800)]">
        צור קשר
      </h1>

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-sage-200)] p-6">
          <h2 className="font-display mb-4 text-lg text-[var(--color-forest-800)]">פרטי התקשרות</h2>
          <ul className="space-y-2 text-[var(--color-ink-900)]">
            <li>📞 {content?.phone ?? '054-664-3896'}</li>
            <li>📍 {content?.address ?? "ג'ת, ישראל"}</li>
          </ul>
          <a
            href={formatWhatsAppLink(content?.whatsapp || content?.phone || '972546643896')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block"
          >
            <Button className="w-full">שלחו הודעה בוואטסאפ</Button>
          </a>
        </div>

        <div className="rounded-xl border border-[var(--color-sage-200)] p-6">
          <h2 className="font-display mb-4 text-lg text-[var(--color-forest-800)]">שלחו לנו הודעה</h2>
          <ContactForm />
        </div>
      </div>

      <MapEmbed mapEmbedUrl={content?.mapEmbedUrl} address={content?.address} />
    </main>
  );
}
