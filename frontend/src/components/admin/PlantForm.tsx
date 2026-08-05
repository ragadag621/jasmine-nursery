import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';
import { deletePlantImage } from '@/api/plants.api';
import { useToast } from '@/context/ToastContext';
import type { Category } from '@/types/category.types';
import type { Plant, Availability, WaterNeed, SunlightNeed } from '@/types/plant.types';

export interface PlantFormValues {
  nameHe: string;
  nameAr: string;
  scientificName: string;
  slug: string;
  descriptionHe: string;
  descriptionAr: string;
  category: string;
  price: string;
  availability: Availability;
  water: WaterNeed;
  sunlight: SunlightNeed;
  featured: boolean;
}

interface PlantFormProps {
  categories: Category[];
  initial?: Plant;
  onSubmit: (values: PlantFormValues, files: File[]) => Promise<void>;
  isSubmitting: boolean;
}

export function PlantForm({ categories, initial, onSubmit, isSubmitting }: PlantFormProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState<PlantFormValues>({
    nameHe: initial?.name.he ?? '',
    nameAr: initial?.name.ar ?? '',
    scientificName: initial?.scientificName ?? '',
    slug: initial?.slug ?? '',
    descriptionHe: initial?.description.he ?? '',
    descriptionAr: initial?.description.ar ?? '',
    category: initial?.category ?? categories[0]?._id ?? '',
    price: initial?.price?.toString() ?? '',
    availability: initial?.availability ?? 'in_stock',
    water: initial?.care.water ?? 'medium',
    sunlight: initial?.care.sunlight ?? 'partial_shade',
    featured: initial?.featured ?? false,
  });
  const [files, setFiles] = useState<File[]>([]);
  // Local mirror of the plant's saved images, so removing one updates the UI
  // immediately without needing to reload the whole edit page.
  const [existingImages, setExistingImages] = useState(
    (initial?.images ?? []).filter((img) => !!img._id).map((img) => ({ id: img._id as string, url: img.url }))
  );
  const [isRemovingImage, setIsRemovingImage] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(values, files);
  };

  /**
   * Deletes a single existing image right away (its own request, separate
   * from the main form submit) — this is what actually fixes the "new
   * image never shows" issue: previously there was no way to remove the
   * old cover image, so it stayed at position 0 forever no matter how many
   * new images were added afterward.
   */
  const handleRemoveExisting = async (imageId: string) => {
    if (!initial?._id) return;
    setIsRemovingImage(true);
    try {
      await deletePlantImage(initial._id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      showToast('התמונה הוסרה בהצלחה', 'success');
    } catch {
      showToast('הסרת התמונה נכשלה', 'error');
    } finally {
      setIsRemovingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="שם הצמח (עברית)"
          value={values.nameHe}
          onChange={(e) => setValues({ ...values, nameHe: e.target.value })}
          required
        />
        <Input
          label="שם הצמח (ערבית)"
          value={values.nameAr}
          onChange={(e) => setValues({ ...values, nameAr: e.target.value })}
          required
          dir="rtl"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="שם מדעי (אופציונלי)"
          value={values.scientificName}
          onChange={(e) => setValues({ ...values, scientificName: e.target.value })}
          dir="ltr"
        />
        <Input
          label="Slug (מזהה כתובת URL)"
          value={values.slug}
          onChange={(e) => setValues({ ...values, slug: e.target.value })}
          placeholder="e.g. monstera-deliciosa"
          dir="ltr"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          label="תיאור (עברית)"
          rows={3}
          value={values.descriptionHe}
          onChange={(e) => setValues({ ...values, descriptionHe: e.target.value })}
          required
        />
        <Textarea
          label="תיאור (ערבית)"
          rows={3}
          value={values.descriptionAr}
          onChange={(e) => setValues({ ...values, descriptionAr: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">קטגוריה</span>
          <select
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value })}
            className="w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2"
            required
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name.he}
              </option>
            ))}
          </select>
        </label>

        <Input
          label="מחיר (₪, אופציונלי)"
          type="number"
          min="0"
          value={values.price}
          onChange={(e) => setValues({ ...values, price: e.target.value })}
        />

        <label className="block text-sm">
          <span className="mb-1 block font-medium">זמינות</span>
          <select
            value={values.availability}
            onChange={(e) => setValues({ ...values, availability: e.target.value as Availability })}
            className="w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2"
          >
            <option value="in_stock">במלאי</option>
            <option value="low_stock">מלאי מוגבל</option>
            <option value="out_of_stock">אזל מהמלאי</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium">צורכי השקיה</span>
          <select
            value={values.water}
            onChange={(e) => setValues({ ...values, water: e.target.value as WaterNeed })}
            className="w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2"
          >
            <option value="low">השקיה מועטה</option>
            <option value="medium">השקיה בינונית</option>
            <option value="high">השקיה מרובה</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">צורכי תאורה</span>
          <select
            value={values.sunlight}
            onChange={(e) => setValues({ ...values, sunlight: e.target.value as SunlightNeed })}
            className="w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2"
          >
            <option value="full_sun">שמש מלאה</option>
            <option value="partial_shade">צל חלקי</option>
            <option value="full_shade">צל מלא</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.featured}
          onChange={(e) => setValues({ ...values, featured: e.target.checked })}
        />
        הצג בעמוד הבית (צמח נבחר)
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium">
          תמונות {isRemovingImage && '(מסיר...)'}
        </span>
        <p className="mb-2 text-xs text-[var(--color-ink-600)]">
          התמונה הראשונה ברשימה היא זו שמוצגת בכרטיס הצמח ובקטלוג. כדי להחליף אותה, הסירו אותה קודם (✕
          בריחוף) ואז העלו את התמונה החדשה.
        </p>
        <ImageDropzone
          multiple
          onFilesSelected={setFiles}
          existingImages={existingImages}
          onRemoveExisting={initial ? handleRemoveExisting : undefined}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} size="lg">
        {initial ? 'עדכון צמח' : 'הוספת צמח'}
      </Button>
    </form>
  );
}
