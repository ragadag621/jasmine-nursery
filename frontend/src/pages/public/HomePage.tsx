import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { Hero } from '@/components/public/Hero';
import { CategoryGrid } from '@/components/public/CategoryGrid';
import { FeaturedPlants } from '@/components/public/FeaturedPlants';
import { WhyChooseUs } from '@/components/public/WhyChooseUs';
import { GalleryPreview } from '@/components/public/GalleryPreview';
import { ReviewsSection } from '@/components/public/ReviewsSection';
import { MapEmbed } from '@/components/public/MapEmbed';
import { FinalCta } from '@/components/public/FinalCta';
import { setPageMeta } from '@/utils/seo';
import { OffersSection } from '@/components/public/OffersSection';

/**
 * Section order follows: hero -> what we offer (categories/featured) ->
 * who we are (about/why-us) -> gallery -> social proof (reviews) ->
 * location -> closing CTA -> footer (rendered by PublicLayout).
 * Background tones alternate deliberately (default / cream-alt / sage)
 * so no two adjacent sections share the same tone.
 */
export default function HomePage() {
  const { i18n } = useTranslation();

  const {
    data: content,
    status: contentStatus,
    refetch: refetchContent,
  } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    if (!content) return;

    const language = i18n.language.startsWith('ar') ? 'ar' : 'he';

    setPageMeta(
      content.siteName?.[language] ?? '',
      content.heroSubtitle?.[language],
    );
  }, [content, i18n.language]);

  return (
    <main>
      <Hero
        content={content}
        status={contentStatus}
        onRetry={refetchContent}
      />
      <CategoryGrid />
      <FeaturedPlants />
      <OffersSection />
      <WhyChooseUs />
      <GalleryPreview />
      <ReviewsSection />
      <MapEmbed mapEmbedUrl={content?.mapEmbedUrl} address={content?.address} tone="sage" />
      <FinalCta content={content} />
    </main>
  );
}
