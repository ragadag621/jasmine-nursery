import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';
import type { Offer } from '@/types/content.types';

export interface OfferFormValues {
  titleHe: string;
  titleAr: string;
  descriptionHe: string;
  descriptionAr: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface OfferFormProps {
  initial?: Offer;
  onSubmit: (
    values: OfferFormValues,
    file: File | null,
  ) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function OfferForm({
  initial,
  onSubmit,
  isSubmitting,
  onCancel,
}: OfferFormProps) {
  const { t } = useTranslation();

  const [values, setValues] = useState<OfferFormValues>({
    titleHe: initial?.title.he ?? '',
    titleAr: initial?.title.ar ?? '',
    descriptionHe: initial?.description.he ?? '',
    descriptionAr: initial?.description.ar ?? '',
    startDate: initial?.startDate
      ? initial.startDate.slice(0, 10)
      : '',
    endDate: initial?.endDate
      ? initial.endDate.slice(0, 10)
      : '',
    isActive: initial?.isActive ?? true,
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    field: keyof OfferFormValues,
    value: string | boolean,
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await onSubmit(values, file);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Input
          label={t('admin.content.offerForm.titleHe')}
          value={values.titleHe}
          onChange={(e) =>
            handleChange('titleHe', e.target.value)
          }
          required
        />

        <Input
          label={t('admin.content.offerForm.titleAr')}
          value={values.titleAr}
          onChange={(e) =>
            handleChange('titleAr', e.target.value)
          }
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Textarea
          label={t(
            'admin.content.offerForm.descriptionHe',
          )}
          rows={3}
          value={values.descriptionHe}
          onChange={(e) =>
            handleChange(
              'descriptionHe',
              e.target.value,
            )
          }
          required
        />

        <Textarea
          label={t(
            'admin.content.offerForm.descriptionAr',
          )}
          rows={3}
          value={values.descriptionAr}
          onChange={(e) =>
            handleChange(
              'descriptionAr',
              e.target.value,
            )
          }
          required
        />
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
        />
      </div>

      <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--color-ink-700)]">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) =>
            handleChange(
              'isActive',
              e.target.checked,
            )
          }
          className="h-4 w-4 rounded border-[var(--color-sage-300)]"
        />

        <span>
          {t(
            'admin.content.offerForm.isActive',
          )}
        </span>
      </label>

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--color-forest-800)]">
          {t('admin.content.offerForm.image')}
        </p>

        <ImageDropzone
          multiple={false}
          onFilesSelected={(files) =>
            setFile(files[0] ?? null)
          }
          existingImages={
            initial?.image?.url
              ? [
                  {
                    id: 'current',
                    url: initial.image.url,
                  },
                ]
              : []
          }
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {initial
            ? t('admin.content.offerForm.update')
            : t('admin.content.offerForm.create')}
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