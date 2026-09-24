import type { Availability, SunlightNeed, WaterNeed } from '@/types/plant.types';

export function formatPrice(price?: number): string {
  if (price === undefined || price === null) return 'לפי בקשה';
  return `₪${price.toLocaleString('he-IL')}`;
}

const availabilityLabels: Record<Availability, string> = {
  in_stock: 'במלאי',
  low_stock: 'מלאי מוגבל',
  out_of_stock: 'אזל מהמלאי',
};

export function formatAvailability(availability: Availability): string {
  return availabilityLabels[availability];
}

const waterLabels: Record<WaterNeed, string> = {
  low: 'השקיה מועטה',
  medium: 'השקיה בינונית',
  high: 'השקיה מרובה',
};

export function formatWaterNeed(water: WaterNeed): string {
  return waterLabels[water];
}

const sunlightLabels: Record<SunlightNeed, string> = {
  full_sun: 'שמש מלאה',
  partial_shade: 'צל חלקי',
  full_shade: 'צל מלא',
};

export function formatSunlightNeed(sunlight: SunlightNeed): string {
  return sunlightLabels[sunlight];
}

export function formatWhatsAppLink(phone: string, message?: string): string {
  let digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.startsWith('00')) {
    digitsOnly = digitsOnly.slice(2);
  }

  if (digitsOnly.startsWith('0')) {
    digitsOnly = `972${digitsOnly.slice(1)}`;
  }

  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digitsOnly}${text}`;
}
