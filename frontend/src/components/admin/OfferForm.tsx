import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';

import type { Offer } from '@/types/content.types';
import type { Plant } from '@/types/plant.types';

export interface OfferFormValues {
  titleHe: string;
  titleAr: string;

  descriptionHe: string;
  descriptionAr: string;

  plants: string[];

  startDate: string;
  endDate: string;

  isActive: boolean;
}

export type OfferType = 'group' | 'general';

interface OfferFormProps {
  initial?: Offer;

  type: OfferType;

  plants: Plant[];

  onSubmit: (
    values: OfferFormValues,
    file: File | null,
  ) => Promise<void>;

  isSubmitting: boolean;

  onCancel?: () => void;
}

export function OfferForm({
  initial,
  type,
  plants,
  onSubmit,
  isSubmitting,
  onCancel,
}: OfferFormProps) {
  const { t, i18n } = useTranslation();

  const direction = i18n.dir();

  const [values, setValues] =
    useState<OfferFormValues>({
      titleHe: initial?.title.he ?? '',
      titleAr: initial?.title.ar ?? '',

      descriptionHe:
        initial?.description.he ?? '',

      descriptionAr:
        initial?.description.ar ?? '',

      plants: initial?.plants ?? [],

      startDate: initial?.startDate
        ? initial.startDate.slice(0, 10)
        : '',

      endDate: initial?.endDate
        ? initial.endDate.slice(0, 10)
        : '',

      isActive: initial?.isActive ?? true,
    });

  const [file, setFile] =
    useState<File | null>(null);

  const selectedPlants = useMemo(
    () =>
      plants.filter((plant) =>
        values.plants.includes(plant._id),
      ),
    [plants, values.plants],
  );

  const handleChange = (
    field: keyof OfferFormValues,
    value: string | boolean,
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePlantToggle = (
    plantId: string,
  ) => {
    setValues((current) => {
      const isSelected =
        current.plants.includes(plantId);

      return {
        ...current,

        plants: isSelected
          ? current.plants.filter(
              (id) => id !== plantId,
            )
          : [...current.plants, plantId],
      };
    });
  };

  const handleSubmit = async (
    e: FormEvent,
  ) => {
    e.preventDefault();

    await onSubmit(values, file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      dir={direction}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label={t(
            'admin.content.offerForm.titleHe',
          )}
          value={values.titleHe}
          onChange={(e) =>
            handleChange(
              'titleHe',
              e.target.value,
            )
          }
          dir="rtl"
          required
        />

        <Input
          label={t(
            'admin.content.offerForm.titleAr',
          )}
          value={values.titleAr}
          onChange={(e) =>
            handleChange(
              'titleAr',
              e.target.value,
            )
          }
          dir="rtl"
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Textarea
          label={t(
            'admin.content.offerForm.descriptionHe',
          )}
          value={values.descriptionHe}
          onChange={(e) =>
            handleChange(
              'descriptionHe',
              e.target.value,
            )
          }
          dir="rtl"
          required
        />

        <Textarea
          label={t(
            'admin.content.offerForm.descriptionAr',
          )}
          value={values.descriptionAr}
          onChange={(e) =>
            handleChange(
              'descriptionAr',
              e.target.value,
            )
          }
          dir="rtl"
          required
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-medium">
            {t(
              type === 'group'
                ? 'admin.content.offerForm.groupPlants'
                : 'admin.content.offerForm.generalNoPlants',
            )}
          </p>

          {type === 'group' && (
            <span className="text-xs text-muted-foreground">
              {selectedPlants.length}
            </span>
          )}
        </div>

        {type === 'general' ? (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground" dir={direction}>
            {t('admin.content.offerForm.generalNoPlantsDescription')}
          </div>
        ) : plants.length === 0 ? (
          <div
            className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground"
            dir={direction}
          >
            {t(
              'admin.content.offerForm.noPlants',
            )}
          </div>
        ) : (
          <div
            className="max-h-72 overflow-y-auto rounded-lg border p-3"
            dir={direction}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {plants.map((plant) => {
                const checked =
                  values.plants.includes(
                    plant._id,
                  );

                const plantName =
                  i18n.language === 'ar'
                    ? plant.name.ar
                    : plant.name.he;

                return (
                  <label
                    key={plant._id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        handlePlantToggle(
                          plant._id,
                        )
                      }
                      className="h-4 w-4"
                    />

                    <span
                      className="min-w-0 flex-1 text-sm"
                      dir="rtl"
                    >
                      {plantName}

                      {plant.scientificName && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {plant.scientificName}
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          type="date"
          label={t(
            'admin.content.offerForm.startDate',
          )}
          value={values.startDate}
          onChange={(e) =>
            handleChange(
              'startDate',
              e.target.value,
            )
          }
          dir="ltr"
        />

        <Input
          type="date"
          label={t(
            'admin.content.offerForm.endDate',
          )}
          value={values.endDate}
          onChange={(e) =>
            handleChange(
              'endDate',
              e.target.value,
            )
          }
          dir="ltr"
        />
      </div>

      <label className="flex min-h-11 items-center gap-2 rounded-md border px-3">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) =>
            handleChange(
              'isActive',
              e.target.checked,
            )
          }
          className="h-4 w-4"
        />

        <span className="text-sm">
          {t(
            'admin.content.offerForm.isActive',
          )}
        </span>
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">
          {t(
            'admin.content.offerForm.image',
          )}
        </p>

        <ImageDropzone
          multiple={false}
          onFilesSelected={(files) =>
            setFile(files[0] ?? null)
          }
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={type === 'group' && values.plants.length === 0}
        >
          {initial
            ? t(
                'admin.content.offerForm.update',
              )
            : t(
                'admin.content.offerForm.create',
              )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t(
              'admin.content.offerForm.cancel',
            )}
          </Button>
        )}
      </div>
    </form>
  );
}