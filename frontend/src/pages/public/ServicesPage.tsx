import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { setPageMeta } from '@/utils/seo';

export default function ServicesPage() {
  const { t } = useTranslation();

  const SERVICES = [
    { icon: '🌿', title: t('nav.catalog'), description: '[טקסט זמני] מגוון עצום של צמחי בית, חוץ, פרחים ועצים במחירים הוגנים.' },
    { icon: '🏡', title: 'עיצוב וייעוץ גינות', description: '[טקסט זמני] ליווי מקצועי בבחירת צמחים ותכנון הגינה או המרפסת שלכם.' },
    { icon: '🪴', title: 'עציצים ואביזרים', description: '[טקסט זמני] מבחר עציצים בכל הגדלים והסגנונות להשלמת המראה.' },
    { icon: '🧰', title: 'מוצרי גינון', description: '[טקסט זמני] אדמה, דשן, כלי עבודה וכל מה שצריך לטיפוח הצמחים.' },
  ];

  useEffect(() => {
    setPageMeta(t('services.title'), t('services.subtitle'));
  }, [t]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 md:px-6">
      <h1 className="font-display mb-3 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('services.title')}
      </h1>
      <p className="mb-12 text-center text-[var(--color-ink-600)]">{t('services.subtitle')}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {SERVICES.map((service) => (
          <Card key={service.title} className="p-7" hoverable>
            <span className="mb-3 block text-3xl" aria-hidden="true">
              {service.icon}
            </span>
            <h2 className="font-display mb-2 text-lg text-[var(--color-forest-800)]">{service.title}</h2>
            <p className="text-sm text-[var(--color-ink-600)]">{service.description}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
