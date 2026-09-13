import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchOffers } from '@/api/offers.api';

export function OffersSection() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('ar') ? 'ar' : 'he';

  const { data: offers, loading } = useFetch(
    () => fetchOffers(true),
    []
  );

  if (loading || !offers || offers.length === 0) {
    return null;
  }

  return (
    <section
      className="
        py-[var(--space-section)]
        bg-[var(--color-cream-alt)]
      "
      aria-labelledby="offers-title"
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <p
            className="
              mb-1
              text-xs
              font-medium
              uppercase
              tracking-[0.16em]
              text-[var(--color-terracotta-600)]
            "
          >
            {currentLanguage === 'ar' ? 'عروضنا' : 'מבצעים'}
          </p>

          <h2
            id="offers-title"
            className="
              font-display
              text-2xl
              leading-tight
              text-[var(--color-forest-800)]
              sm:text-3xl
            "
          >
            {currentLanguage === 'ar'
              ? 'عروض مميزة'
              : 'מבצעים מיוחדים'}
          </h2>
        </div>

        {/* Offers */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {offers.map((offer) => {
            const title = offer.title[currentLanguage];
            const description = offer.description[currentLanguage];

            return (
              <article
                key={offer._id}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[var(--color-sage-200)]
                  bg-white
                  shadow-sm
                  transition-shadow
                  duration-200
                  hover:shadow-md
                "
              >
                {/* Image */}
                {offer.image?.url && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={offer.image.url}
                      alt={title}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3
                      className="
                        font-display
                        text-lg
                        leading-snug
                        text-[var(--color-forest-800)]
                      "
                    >
                      {title}
                    </h3>

                    <span
                      className="
                        shrink-0
                        rounded-full
                        bg-[var(--color-sage-100)]
                        px-2.5
                        py-1
                        text-[11px]
                        font-medium
                        text-[var(--color-forest-700)]
                      "
                    >
                      {currentLanguage === 'ar' ? 'عرض' : 'מבצע'}
                    </span>
                  </div>

                  <p
                    className="
                      line-clamp-3
                      text-sm
                      leading-6
                      text-[var(--color-ink-600)]
                    "
                  >
                    {description}
                  </p>

                  {/* Dates */}
                  {(offer.startDate || offer.endDate) && (
                    <div
                      className="
                        mt-4
                        border-t
                        border-[var(--color-sage-100)]
                        pt-3
                        text-xs
                        text-[var(--color-ink-500)]
                      "
                    >
                      {offer.startDate && (
                        <span>
                          {currentLanguage === 'ar'
                            ? `من ${new Date(offer.startDate).toLocaleDateString('ar')}`
                            : `מ־${new Date(offer.startDate).toLocaleDateString('he-IL')}`}
                        </span>
                      )}

                      {offer.startDate && offer.endDate && (
                        <span className="mx-1">—</span>
                      )}

                      {offer.endDate && (
                        <span>
                          {currentLanguage === 'ar'
                            ? `حتى ${new Date(offer.endDate).toLocaleDateString('ar')}`
                            : `עד ${new Date(offer.endDate).toLocaleDateString('he-IL')}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}