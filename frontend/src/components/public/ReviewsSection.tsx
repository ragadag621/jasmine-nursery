import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchTestimonials } from '@/api/testimonials.api';
import { fetchSiteContent } from '@/api/content.api';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

function Stars({ rating }: { rating: number }) {
  return (
    <div aria-label={`${rating} מתוך 5 כוכבים`} className="text-[var(--color-terracotta-500)]">
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </div>
  );
}

export function ReviewsSection() {
  const { data: testimonials, status } = useFetch(fetchTestimonials, []);
  const { data: content } = useFetch(fetchSiteContent, []);
  const { t, i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';

  return (
    <section className="bg-[var(--color-sage-100)] px-4 py-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-display mb-3 text-3xl text-[var(--color-forest-800)] md:text-4xl">
            {t('home.reviewsTitle')}
          </h2>
          {content && (
            <p className="text-[var(--color-ink-600)]">
              <span className="font-semibold text-[var(--color-forest-700)]">
                {content.googleRating.toFixed(1)} / 5
              </span>{' '}
              · {content.googleReviewCount} {t('home.reviewsCount')}
            </p>
          )}
        </div>

        {status === 'loading' && (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {status === 'success' && testimonials && testimonials.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((item) => (
              <Card key={item._id} className="p-7" hoverable>
                <Stars rating={item.rating} />
                <p className="mt-3 leading-relaxed text-[var(--color-ink-900)]">{item.text[key]}</p>
                <p className="mt-4 text-sm font-medium text-[var(--color-ink-600)]">{item.customerName}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
