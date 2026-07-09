export interface LocalizedText {
  he: string;
  ar: string;
}

export interface PlantImage {
  url: string;
  publicId: string;
  order: number;
}

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock';
export type WaterNeed = 'low' | 'medium' | 'high';
export type SunlightNeed = 'full_sun' | 'partial_shade' | 'full_shade';

export interface Plant {
  _id: string;
  name: LocalizedText;
  scientificName?: string;
  slug: string;
  description: LocalizedText;
  category: string; // Category._id
  price?: number;
  availability: Availability;
  images: PlantImage[];
  care: {
    water: WaterNeed;
    sunlight: SunlightNeed;
  };
  featured: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}
