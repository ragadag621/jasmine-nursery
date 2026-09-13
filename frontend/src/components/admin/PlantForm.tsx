import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';

import { deletePlantImage } from '@/api/plants.api';

import { useToast } from '@/context/ToastContext';

import type { Category } from '@/types/category.types';
import type {
  Plant,
  Availability,
  WaterNeed,
  SunlightNeed,
} from '@/types/plant.types';

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
  onSubmit: (
    values: PlantFormValues,
    files: File[]
  ) => Promise<void>;
  isSubmitting: boolean;
}

export function PlantForm({
  categories,
  initial,
  onSubmit,
  isSubmitting,
}: PlantFormProps) {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [values, setValues] =
    useState<PlantFormValues>({
      nameHe: initial?.name.he ?? '',
      nameAr: initial?.name.ar ?? '',
      scientificName:
        initial?.scientificName ?? '',
      slug: initial?.slug ?? '',
      descriptionHe:
        initial?.description.he ?? '',
      descriptionAr:
        initial?.description.ar ?? '',
      category:
        initial?.category ??
        categories[0]?._id ??
        '',
      price:
        initial?.price?.toString() ?? '',
      availability:
        initial?.availability ??
        'in_stock',
      water:
        initial?.care.water ??
        'medium',
      sunlight:
        initial?.care.sunlight ??
        'partial_shade',
      featured:
        initial?.featured ?? false,
    });

  const [files, setFiles] = useState<File[]>(
    []
  );

  // Local mirror of saved images so removing
  // one updates the UI immediately.
  const [existingImages, setExistingImages] =
    useState(
      (initial?.images ?? [])
        .filter((img) => !!img._id)
        .map((img) => ({
          id: img._id as string,
          url: img.url,
        }))
    );

  const [isRemovingImage, setIsRemovingImage] =
    useState(false);

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    await onSubmit(values, files);
  };

  const handleRemoveExisting = async (
    imageId: string
  ) => {
    if (!initial?._id) return;

    setIsRemovingImage(true);

    try {
      await deletePlantImage(
        initial._id,
        imageId
      );

      setExistingImages((prev) =>
        prev.filter(
          (img) => img.id !== imageId
        )
      );

      showToast(
        t('admin.plantForm.imageRemoved'),
        'success'
      );
    } catch {
      showToast(
        t('admin.plantForm.imageRemoveFailed'),
        'error'
      );
    } finally {
      setIsRemovingImage(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        w-full
        flex-col
        gap-5
        sm:gap-6
      "
    >
      {/* Plant names */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={t('admin.plantForm.nameHe')}
          value={values.nameHe}
          onChange={(e) =>
            setValues({
              ...values,
              nameHe: e.target.value,
            })
          }
          required
          autoComplete="off"
        />

        <Input
          label={t('admin.plantForm.nameAr')}
          value={values.nameAr}
          onChange={(e) =>
            setValues({
              ...values,
              nameAr: e.target.value,
            })
          }
          required
          dir="rtl"
          autoComplete="off"
        />
      </div>

      {/* Scientific name + slug */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label={t(
            'admin.plantForm.scientificName'
          )}
          value={values.scientificName}
          onChange={(e) =>
            setValues({
              ...values,
              scientificName:
                e.target.value,
            })
          }
          dir="ltr"
          autoComplete="off"
        />

        <Input
          label={t('admin.plantForm.slug')}
          value={values.slug}
          onChange={(e) =>
            setValues({
              ...values,
              slug: e.target.value,
            })
          }
          placeholder={t(
            'admin.plantForm.slugPlaceholder'
          )}
          dir="ltr"
          required
          autoComplete="off"
        />
      </div>

      {/* Descriptions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          label={t(
            'admin.plantForm.descriptionHe'
          )}
          rows={4}
          value={values.descriptionHe}
          onChange={(e) =>
            setValues({
              ...values,
              descriptionHe:
                e.target.value,
            })
          }
          required
        />

        <Textarea
          label={t(
            'admin.plantForm.descriptionAr'
          )}
          rows={4}
          value={values.descriptionAr}
          onChange={(e) =>
            setValues({
              ...values,
              descriptionAr:
                e.target.value,
            })
          }
          required
          dir="rtl"
        />
      </div>

      {/* Category + price + availability */}
      <div className="grid gap-4 md:grid-cols-3">
        <label
          htmlFor="plant-category"
          className="
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          <span className="mb-1.5 block">
            {t('admin.plantForm.category')}
          </span>

          <select
            id="plant-category"
            value={values.category}
            onChange={(e) =>
              setValues({
                ...values,
                category: e.target.value,
              })
            }
            required
            className="
              min-h-11
              w-full
              rounded-lg
              border
              border-[var(--color-sage-300)]
              bg-[var(--color-cream-50)]
              px-3
              py-2.5
              text-[max(16px,0.95rem)]
              font-normal
              text-[var(--color-ink-900)]
              outline-none
              transition-colors
              focus:border-[var(--color-forest-600)]
              focus:ring-2
              focus:ring-[var(--color-forest-600)]/15
            "
          >
            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name.he}
              </option>
            ))}
          </select>
        </label>

        <Input
          label={t('admin.plantForm.price')}
          type="number"
          min="0"
          step="any"
          value={values.price}
          onChange={(e) =>
            setValues({
              ...values,
              price: e.target.value,
            })
          }
          inputMode="decimal"
        />

        <label
          htmlFor="plant-availability"
          className="
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          <span className="mb-1.5 block">
            {t('admin.plantForm.availability')}
          </span>

          <select
            id="plant-availability"
            value={values.availability}
            onChange={(e) =>
              setValues({
                ...values,
                availability:
                  e.target
                    .value as Availability,
              })
            }
            className="
              min-h-11
              w-full
              rounded-lg
              border
              border-[var(--color-sage-300)]
              bg-[var(--color-cream-50)]
              px-3
              py-2.5
              text-[max(16px,0.95rem)]
              font-normal
              text-[var(--color-ink-900)]
              outline-none
              transition-colors
              focus:border-[var(--color-forest-600)]
              focus:ring-2
              focus:ring-[var(--color-forest-600)]/15
            "
          >
            <option value="in_stock">
              {t(
                'admin.plantForm.availabilityInStock'
              )}
            </option>

            <option value="low_stock">
              {t(
                'admin.plantForm.availabilityLowStock'
              )}
            </option>

            <option value="out_of_stock">
              {t(
                'admin.plantForm.availabilityOutOfStock'
              )}
            </option>
          </select>
        </label>
      </div>

      {/* Care requirements */}
      <div className="grid gap-4 md:grid-cols-2">
        <label
          htmlFor="plant-water"
          className="
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          <span className="mb-1.5 block">
            {t('admin.plantForm.water')}
          </span>

          <select
            id="plant-water"
            value={values.water}
            onChange={(e) =>
              setValues({
                ...values,
                water:
                  e.target.value as WaterNeed,
              })
            }
            className="
              min-h-11
              w-full
              rounded-lg
              border
              border-[var(--color-sage-300)]
              bg-[var(--color-cream-50)]
              px-3
              py-2.5
              text-[max(16px,0.95rem)]
              font-normal
              text-[var(--color-ink-900)]
              outline-none
              transition-colors
              focus:border-[var(--color-forest-600)]
              focus:ring-2
              focus:ring-[var(--color-forest-600)]/15
            "
          >
            <option value="low">
              {t(
                'admin.plantForm.waterLow'
              )}
            </option>

            <option value="medium">
              {t(
                'admin.plantForm.waterMedium'
              )}
            </option>

            <option value="high">
              {t(
                'admin.plantForm.waterHigh'
              )}
            </option>
          </select>
        </label>

        <label
          htmlFor="plant-sunlight"
          className="
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          <span className="mb-1.5 block">
            {t('admin.plantForm.sunlight')}
          </span>

          <select
            id="plant-sunlight"
            value={values.sunlight}
            onChange={(e) =>
              setValues({
                ...values,
                sunlight:
                  e.target
                    .value as SunlightNeed,
              })
            }
            className="
              min-h-11
              w-full
              rounded-lg
              border
              border-[var(--color-sage-300)]
              bg-[var(--color-cream-50)]
              px-3
              py-2.5
              text-[max(16px,0.95rem)]
              font-normal
              text-[var(--color-ink-900)]
              outline-none
              transition-colors
              focus:border-[var(--color-forest-600)]
              focus:ring-2
              focus:ring-[var(--color-forest-600)]/15
            "
          >
            <option value="full_sun">
              {t(
                'admin.plantForm.sunlightFullSun'
              )}
            </option>

            <option value="partial_shade">
              {t(
                'admin.plantForm.sunlightPartialShade'
              )}
            </option>

            <option value="full_shade">
              {t(
                'admin.plantForm.sunlightFullShade'
              )}
            </option>
          </select>
        </label>
      </div>

      {/* Featured */}
      <label
        htmlFor="plant-featured"
        className="
          flex
          min-h-11
          cursor-pointer
          items-center
          gap-3
          rounded-lg
          border
          border-[var(--color-border)]
          bg-[var(--color-cream-50)]
          px-3
          py-2.5
          text-sm
          text-[var(--color-ink-900)]
        "
      >
        <input
          id="plant-featured"
          type="checkbox"
          checked={values.featured}
          onChange={(e) =>
            setValues({
              ...values,
              featured: e.target.checked,
            })
          }
          className="
            h-4
            w-4
            shrink-0
            accent-[var(--color-forest-700)]
          "
        />

        <span>
          {t('admin.plantForm.featured')}
        </span>
      </label>

      {/* Images */}
      <div>
        <div className="mb-2">
          <span
            className="
              block
              text-sm
              font-medium
              text-[var(--color-ink-900)]
            "
          >
            {t('admin.plantForm.images')}

            {isRemovingImage && (
              <span className="ms-1 text-xs font-normal text-[var(--color-ink-600)]">
                {t(
                  'admin.plantForm.removingImage'
                )}
              </span>
            )}
          </span>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-[var(--color-ink-600)]
            "
          >
            {t(
              'admin.plantForm.imagesDescription'
            )}
          </p>
        </div>

        <ImageDropzone
          multiple
          onFilesSelected={setFiles}
          existingImages={existingImages}
          onRemoveExisting={
            initial
              ? handleRemoveExisting
              : undefined
          }
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        isLoading={isSubmitting}
        size="lg"
        className="w-full sm:w-auto sm:self-start"
      >
        {initial
          ? t('admin.plantForm.update')
          : t('admin.plantForm.create')}
      </Button>
    </form>
  );
}