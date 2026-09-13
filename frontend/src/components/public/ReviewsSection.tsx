import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { fetchTestimonials } from '@/api/testimonials.api';
import { fetchSiteContent } from '@/api/content.api';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Section } from '@/components/ui/Section';

function Stars({ rating }: { rating: number }) {
  return (
    <div
      aria-label={`${rating} / 5`}
      className="flex items-center gap-0.5 text-[var(--color-terracotta-500)]"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="text-base leading-none sm:text-lg"
        >
          {index < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

export function ReviewsSection() {
  const { data: testimonials, status } = useFetch(
    fetchTestimonials,
    []
  );

  const { data: content } = useFetch(fetchSiteContent, []);

  const { t, i18n } = useTranslation();

  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <Section>
      <div className="mb-8 text-center sm:mb-10">
        <h2
          className="
            font-display
            text-[clamp(1.6rem,6vw,2.25rem)]
            leading-tight
            text-[var(--color-forest-800)]
          "
        >
          {t('home.reviewsTitle')}
        </h2>

        {content && (
          <p className="mt-3 text-sm text-[var(--color-ink-600)] sm:text-base">
            <span className="font-semibold text-[var(--color-forest-700)]">
              {content.googleRating.toFixed(1)} / 5
            </span>

            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>

            {content.googleReviewCount} {t('home.reviewsCount')}
          </p>
        )}
      </div>

      {status === 'loading' && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-36 w-full sm:h-32"
              radius="var(--radius-card)"
            />
          ))}
        </div>
      )}

      {status === 'success' &&
        testimonials &&
        testimonials.length > 0 && (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            {testimonials.map((item) => (
              <Card
                key={item._id}
                className="
                  flex
                  h-full
                  flex-col
                  p-5
                  sm:p-7
                "
                hoverable
              >
                <Stars rating={item.rating} />

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-[var(--color-ink-900)]
                    sm:text-base
                  "
                >
                  {item.text[key]}
                </p>

                <p
                  className="
                    mt-4
                    text-xs
                    font-medium
                    text-[var(--color-ink-600)]
                    sm:text-sm
                  "
                >
                  {item.customerName}
                </p>
              </Card>
            ))}
          </div>
        )}
    </Section>
  );
}