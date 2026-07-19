import type { Category } from '@/types/category.types';
import type { PlantListParams } from '@/api/plants.api';

interface PlantFilterBarProps {
  categories: Category[];
  filters: PlantListParams;
  onChange: (next: Partial<PlantListParams>) => void;
}

const SORT_OPTIONS: { value: NonNullable<PlantListParams['sort']>; label: string }[] = [
  { value: 'newest', label: 'החדשים ביותר' },
  { value: 'name_asc', label: 'שם: א-ת' },
  { value: 'name_desc', label: 'שם: ת-א' },
  { value: 'price_asc', label: 'מחיר: מהנמוך לגבוה' },
  { value: 'price_desc', label: 'מחיר: מהגבוה לנמוך' },
];

export function PlantFilterBar({ categories, filters, onChange }: PlantFilterBarProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
      <input
        type="search"
        placeholder="חיפוש צמח לפי שם..."
        value={filters.search ?? ''}
        onChange={(e) => onChange({ search: e.target.value })}
        className="w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2 outline-none focus:border-[var(--color-forest-600)] md:max-w-xs"
        aria-label="חיפוש צמחים"
      />

      <select
        value={filters.category ?? ''}
        onChange={(e) => onChange({ category: e.target.value || undefined })}
        className="rounded-md border border-[var(--color-sage-300)] px-3 py-2 outline-none focus:border-[var(--color-forest-600)]"
        aria-label="סינון לפי קטגוריה"
      >
        <option value="">כל הקטגוריות</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name.he}
          </option>
        ))}
      </select>

      <select
        value={filters.sort ?? 'newest'}
        onChange={(e) => onChange({ sort: e.target.value as PlantListParams['sort'] })}
        className="rounded-md border border-[var(--color-sage-300)] px-3 py-2 outline-none focus:border-[var(--color-forest-600)]"
        aria-label="מיון"
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
