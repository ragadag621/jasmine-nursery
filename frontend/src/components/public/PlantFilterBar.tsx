import { useTranslation } from 'react-i18next';
import type { Category } from '@/types/category.types';
import type { PlantListParams } from '@/api/plants.api';

interface PlantFilterBarProps {
  categories: Category[];
  filters: PlantListParams;
  onChange: (next: Partial<PlantListParams>) => void;
}

export function PlantFilterBar({ categories, filters, onChange }: PlantFilterBarProps) {
  const { t, i18n } = useTranslation();
  const key = i18n.language === 'ar' ? 'ar' : 'he';

  const SORT_OPTIONS: { value: NonNullable<PlantListParams['sort']>; label: string }[] = [
    { value: 'newest', label: t('catalog.sortNewest') },
    { value: 'name_asc', label: t('catalog.sortNameAsc') },
    { value: 'name_desc', label: t('catalog.sortNameDesc') },
    { value: 'price_asc', label: t('catalog.sortPriceAsc') },
    { value: 'price_desc', label: t('catalog.sortPriceDesc') },
  ];

  return (
    <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-4 shadow-[var(--shadow-soft)] md:flex-row md:items-center">
      <input
        type="search"
        placeholder={t('catalog.searchPlaceholder')}
        value={filters.search ?? ''}
        onChange={(e) => onChange({ search: e.target.value })}
        className="w-full rounded-lg border border-[var(--color-sage-300)] px-3 py-2.5 outline-none transition-colors focus:border-[var(--color-forest-600)] md:max-w-xs"
        aria-label={t('catalog.searchPlaceholder')}
      />

      <select
        value={filters.category ?? ''}
        onChange={(e) => onChange({ category: e.target.value || undefined })}
        className="rounded-lg border border-[var(--color-sage-300)] px-3 py-2.5 outline-none transition-colors focus:border-[var(--color-forest-600)]"
        aria-label={t('catalog.allCategories')}
      >
        <option value="">{t('catalog.allCategories')}</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name[key]}
          </option>
        ))}
      </select>

      <select
        value={filters.sort ?? 'newest'}
        onChange={(e) => onChange({ sort: e.target.value as PlantListParams['sort'] })}
        className="rounded-lg border border-[var(--color-sage-300)] px-3 py-2.5 outline-none transition-colors focus:border-[var(--color-forest-600)]"
        aria-label={t('catalog.sortNewest')}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
