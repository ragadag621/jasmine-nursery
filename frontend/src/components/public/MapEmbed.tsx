interface MapEmbedProps {
  mapEmbedUrl?: string;
  address?: string;
}

export function MapEmbed({ mapEmbedUrl, address }: MapEmbedProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h2 className="font-display mb-6 text-center text-2xl text-[var(--color-forest-800)] md:text-3xl">
        איך מגיעים אלינו
      </h2>
      <div className="overflow-hidden rounded-xl border border-[var(--color-sage-200)]">
        {mapEmbedUrl ? (
          <iframe
            src={mapEmbedUrl}
            title="מיקום המשתלה במפה"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-64 items-center justify-center bg-[var(--color-sage-100)] text-center text-[var(--color-ink-600)]">
            <p>{address ?? "ג'ת, ישראל"} — מפה תתעדכן בקרוב</p>
          </div>
        )}
      </div>
    </section>
  );
}
