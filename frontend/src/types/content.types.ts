import type { LocalizedText } from './plant.types';

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

export interface SiteContent {
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroImage?: { url: string; publicId: string };
  aboutText: LocalizedText;
  phone: string;
  whatsapp: string;
  address: string;
  openingHours: OpeningHour[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  googleRating: number;
  googleReviewCount: number;
  mapEmbedUrl?: string;
}

export interface Testimonial {
  _id: string;
  customerName: string;
  rating: number;
  text: LocalizedText;
  isVisible: boolean;
  createdAt: string;
}

export interface Offer {
  _id: string;
  title: LocalizedText;
  description: LocalizedText;
  image?: { url: string; publicId: string };
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}
