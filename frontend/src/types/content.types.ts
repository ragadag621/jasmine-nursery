import type { LocalizedText, Plant } from './plant.types';

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

export interface SiteContent {
  siteName: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroImage?: {
    url: string;
    publicId: string;
  };
  logo?: {
    url: string;
    publicId: string;
  };
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

  image?: {
    url: string;
    publicId: string;
  };

  /**
   * IDs of plants included in this general offer.
   *
   * The backend currently returns ObjectId values
   * as strings when the offer is not populated.
   */
  plants: string[];

  startDate?: string;

  endDate?: string;

  isActive: boolean;
}

export interface OfferPlant {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: string;
  price?: number;
  availability: string;
  images: Array<{
    url: string;
    publicId: string;
    order: number;
  }>;
}

export type PopulatedOffer = Omit<Offer, 'plants'> & {
  plants: Plant[];
};