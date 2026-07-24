import { useTranslation } from 'react-i18next';

interface MapEmbedProps {
  mapEmbedUrl?: string;
  address?: string;
}

export function MapEmbed({ mapEmbedUrl, address }: MapEmbedProps) {
  const { t } = useTranslation();

  const mapUrl =
    mapEmbedUrl ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d215355.60173551925!2d34.74225199453125!3d32.50126590000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d05e5ddebafcd%3A0x6a0b45eb35811f94!2z15DXlteU15DXqCDXkNec15nXkNeh157XmdefICjYp9iy2YfYp9ixINin2YTZitin2LPZhdmK2YYp!5e0!3m2!1sen!2sil!4v1784818624981!5m2!1sen!2sil";

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <h2 className="font-display mb-8 text-center text-3xl text-[var(--color-forest-800)] md:text-4xl">
        {t('home.mapTitle')}
      </h2>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-sage-200)] shadow-[var(--shadow-soft)]">

        <iframe
          src={mapUrl}
          title="משתלת אליאסמין מיקום"
          className="h-[400px] w-full md:h-[500px]"
          loading="lazy"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
        />

      </div>
    </section>
  );
}
