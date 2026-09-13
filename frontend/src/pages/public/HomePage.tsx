import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { Hero } from '@/components/public/Hero';
import { AboutPreview } from '@/components/public/AboutPreview';
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
  const { data: content } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta('בית', 'משתלת אליאסמין - מגוון עצום של צמחים, פרחים, עצים ועציצים בג׳ת');
  }, []);

  return (
    <main>
      <Hero content={content} />
      <CategoryGrid />
      <FeaturedPlants />
      <OffersSection />
      <AboutPreview content={content} />
      <WhyChooseUs />
      <GalleryPreview />
      <ReviewsSection />
      <MapEmbed mapEmbedUrl={content?.mapEmbedUrl} address={content?.address} tone="sage" />
      <FinalCta content={content} />
    </main>
  );
}
