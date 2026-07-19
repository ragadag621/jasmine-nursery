import { useEffect } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { fetchSiteContent } from '@/api/content.api';
import { Hero } from '@/components/public/Hero';
import { AboutPreview } from '@/components/public/AboutPreview';
import { CategoryGrid } from '@/components/public/CategoryGrid';
import { FeaturedPlants } from '@/components/public/FeaturedPlants';
import { GalleryPreview } from '@/components/public/GalleryPreview';
import { ReviewsSection } from '@/components/public/ReviewsSection';
import { MapEmbed } from '@/components/public/MapEmbed';
import { setPageMeta } from '@/utils/seo';

export default function HomePage() {
  const { data: content } = useFetch(fetchSiteContent, []);

  useEffect(() => {
    setPageMeta('בית', 'משתלת אליאסמין - מגוון עצום של צמחים, פרחים, עצים ועציצים בג׳ת');
  }, []);

  return (
    <main>
      <Hero content={content} />
      <AboutPreview content={content} />
      <CategoryGrid />
      <FeaturedPlants />
      <GalleryPreview />
      <ReviewsSection />
      <MapEmbed mapEmbedUrl={content?.mapEmbedUrl} address={content?.address} />
    </main>
  );
}
