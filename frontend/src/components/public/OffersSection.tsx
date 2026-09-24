import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchOffers } from '@/api/offers.api';

export function OffersSection() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('ar') ? 'ar' : 'he';

  const { data: offers, status } = useFetch(
    () => fetchOffers(true),
    []
  );

  if (status === 'loading' || !offers || offers.length === 0) {
    return null;
  }

  const isArabic = currentLanguage === 'ar';

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(
      isArabic ? 'ar-SA' : 'he-IL',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[var(--color-cream-alt)]
        py-[var(--space-section)]
      "
      aria-labelledby="offers-title"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          bg-[var(--color-sage-100)]
          opacity-50
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-32
          -left-24
          h-72
          w-72
          rounded-full
          bg-[var(--color-terracotta-100)]
          opacity-30
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Section Header */}
        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:mb-10
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="
                  h-px
                  w-8
                  bg-[var(--color-terracotta-500)]
                "
              />

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[var(--color-terracotta-600)]
                "
              >
                {isArabic ? 'عروضنا' : 'המבצעים שלנו'}
              </p>
            </div>

            <h2
              id="offers-title"
              className="
                font-display
                text-3xl
                font-semibold
                leading-tight
                text-[var(--color-forest-800)]
                sm:text-4xl
              "
            >
              {isArabic
                ? 'عروض مميزة لا تفوّت'
                : 'מבצעים מיוחדים שלא כדאי לפספס'}
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-[var(--color-ink-600)]
                sm:text-base
              "
            >
              {isArabic
                ? 'اكتشفي عروضنا الحالية واختاري ما يناسبك من النباتات.'
                : 'גלו את המבצעים העדכניים שלנו ובחרו את הצמחים שמתאימים לכם.'}
            </p>
          </div>

          <Link
            to="/offers"
            className="
              inline-flex
              shrink-0
              items-center
              gap-2
              self-start
              rounded-full
              border
              border-[var(--color-forest-700)]
              px-4
              py-2.5
              text-sm
              font-medium
              text-[var(--color-forest-700)]
              transition-all
              duration-200
              hover:bg-[var(--color-forest-700)]
              hover:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--color-forest-700)]
              focus:ring-offset-2
              sm:self-auto
            "
          >
            <span>
              {isArabic ? 'كل العروض' : 'כל המבצעים'}
            </span>

            <span
              aria-hidden="true"
              className="
                text-base
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
            >
              {isArabic ? '←' : '→'}
            </span>
          </Link>
        </div>

        {/* Offers Grid */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {offers.map((offer) => {
            const title = offer.title[currentLanguage];
            const description = offer.description[currentLanguage];

            const hasPlants = offer.plants.length > 0;

            return (
              <Link
                key={offer._id}
                to={hasPlants ? `/offers/${offer._id}` : '/offers'}
                aria-label={title}
                className="
                  group
                  flex
                  h-full
                  flex-col
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[var(--color-sage-200)]
                  bg-white
                  shadow-[0_8px_30px_rgba(42,61,48,0.06)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[var(--color-sage-300)]
                  hover:shadow-[0_16px_40px_rgba(42,61,48,0.12)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--color-forest-700)]
                  focus:ring-offset-2
                "
              >
                {/* Image */}
                {offer.image?.url ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-sage-50)]">
                    <img
                      src={offer.image.url}
                      alt={title}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-105
                      "
                      loading="lazy"
                    />

                    {/* Image overlay */}
                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/25
                        via-transparent
                        to-transparent
                        opacity-70
                      "
                    />

                    {/* Offer badge */}
                    <span
                      className="
                        absolute
                        start-4
                        top-4
                        rounded-full
                        bg-white/95
                        px-3
                        py-1.5
                        text-[11px]
                        font-semibold
                        text-[var(--color-forest-700)]
                        shadow-sm
                        backdrop-blur-sm
                      "
                    >
                      {isArabic ? 'عرض مميز' : 'מבצע מיוחד'}
                    </span>
                  </div>
                ) : (
                  <div
                    className="
                      relative
                      flex
                      aspect-[16/9]
                      items-center
                      justify-center
                      overflow-hidden
                      bg-[var(--color-sage-100)]
                    "
                  >
                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        h-32
                        w-32
                        rounded-full
                        border
                        border-[var(--color-sage-300)]
                        opacity-60
                      "
                    />

                    <span
                      className="
                        relative
                        rounded-full
                        bg-white/80
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        text-[var(--color-forest-700)]
                        shadow-sm
                      "
                    >
                      {isArabic ? 'عرض مميز' : 'מבצע מיוחד'}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3
                      className="
                        font-display
                        text-xl
                        font-semibold
                        leading-snug
                        text-[var(--color-forest-800)]
                        transition-colors
                        duration-200
                        group-hover:text-[var(--color-terracotta-600)]
                      "
                    >
                      {title}
                    </h3>

                    <span
                      aria-hidden="true"
                      className="
                        mt-1
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--color-sage-50)]
                        text-[var(--color-forest-700)]
                        transition-all
                        duration-300
                        group-hover:bg-[var(--color-forest-700)]
                        group-hover:text-white
                      "
                    >
                      {isArabic ? '←' : '→'}
                    </span>
                  </div>

                  <p
                    className="
                      mt-3
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
                        mt-5
                        border-t
                        border-[var(--color-sage-100)]
                        pt-4
                      "
                    >
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-x-2
                          gap-y-1
                          text-xs
                          text-[var(--color-ink-500)]
                        "
                      >
                        {offer.startDate && (
                          <span>
                            {isArabic
                              ? `من ${formatDate(offer.startDate)}`
                              : `מ־${formatDate(offer.startDate)}`}
                          </span>
                        )}

                        {offer.startDate && offer.endDate && (
                          <span
                            aria-hidden="true"
                            className="text-[var(--color-sage-400)]"
                          >
                            •
                          </span>
                        )}

                        {offer.endDate && (
                          <span>
                            {isArabic
                              ? `حتى ${formatDate(offer.endDate)}`
                              : `עד ${formatDate(offer.endDate)}`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-[var(--color-forest-700)]
                    "
                  >
                    <span>
                      {hasPlants
                        ? isArabic
                          ? 'اكتشفي النباتات'
                          : 'לצפייה בצמחים'
                        : isArabic
                          ? 'اكتشفي العرض'
                          : 'לצפייה במבצע'}
                    </span>

                    <span
                      aria-hidden="true"
                      className="
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                        rtl:group-hover:-translate-x-1
                      "
                    >
                      {isArabic ? '←' : '→'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
