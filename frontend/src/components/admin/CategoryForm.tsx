import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';

import type { Category } from '@/types/category.types';

export interface CategoryFormValues {
  nameHe: string;
  nameAr: string;
  slug: string;
  descriptionHe: string;
  descriptionAr: string;
}

interface CategoryFormProps {
  initial?: Category;
  onSubmit: (
    values: CategoryFormValues,
    file: File | null
  ) => Promise<void>;
  isSubmitting: boolean;
}

export function CategoryForm({
  initial,
  onSubmit,
  isSubmitting,
}: CategoryFormProps) {
  const { t } = useTranslation();

  const [values, setValues] =
    useState<CategoryFormValues>({
      nameHe: initial?.name.he ?? '',
      nameAr: initial?.name.ar ?? '',
      slug: initial?.slug ?? '',
      descriptionHe: initial?.description?.he ?? '',
      descriptionAr: initial?.description?.ar ?? '',
    });

  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(values, file);
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
      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
        "
      >
        <Input
          label={t('admin.categories.form.nameHebrew')}
          value={values.nameHe}
          onChange={(e) =>
            setValues({
              ...values,
              nameHe: e.target.value,
            })
          }
          required
          autoComplete="off"
          dir="rtl"
        />

        <Input
          label={t('admin.categories.form.nameArabic')}
          value={values.nameAr}
          onChange={(e) =>
            setValues({
              ...values,
              nameAr: e.target.value,
            })
          }
          required
          autoComplete="off"
          dir="rtl"
        />
      </div>

      <Input
        label={t('admin.categories.form.slug')}
        value={values.slug}
        onChange={(e) =>
          setValues({
            ...values,
            slug: e.target.value,
          })
        }
        dir="ltr"
        required
        autoComplete="off"
        placeholder={t(
          'admin.categories.form.slugPlaceholder'
        )}
      />

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
        "
      >
        <Textarea
          label={t(
            'admin.categories.form.descriptionHebrew'
          )}
          rows={4}
          value={values.descriptionHe}
          onChange={(e) =>
            setValues({
              ...values,
              descriptionHe: e.target.value,
            })
          }
          dir="rtl"
        />

        <Textarea
          label={t(
            'admin.categories.form.descriptionArabic'
          )}
          rows={4}
          value={values.descriptionAr}
          onChange={(e) =>
            setValues({
              ...values,
              descriptionAr: e.target.value,
            })
          }
          dir="rtl"
        />
      </div>

      <div className="w-full">
        <span
          className="
            mb-2
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          {t('admin.categories.form.image')}
        </span>

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

      <Button
        type="submit"
        isLoading={isSubmitting}
        size="lg"
        className="
          min-h-11
          w-full
          sm:w-auto
          sm:self-start
        "
      >
        {initial
          ? t('admin.categories.form.update')
          : t('admin.categories.form.create')}
      </Button>
    </form>
  );
}