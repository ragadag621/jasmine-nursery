import { useState } from 'react';
import type { FormEvent } from 'react';
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
  onSubmit: (values: CategoryFormValues, file: File | null) => Promise<void>;
  isSubmitting: boolean;
}

export function CategoryForm({ initial, onSubmit, isSubmitting }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="שם (עברית)"
          value={values.nameHe}
          onChange={(e) => setValues({ ...values, nameHe: e.target.value })}
          required
        />
        <Input
          label="שם (ערבית)"
          value={values.nameAr}
          onChange={(e) => setValues({ ...values, nameAr: e.target.value })}
          required
        />
      </div>

      <Input
        label="Slug"
        value={values.slug}
        onChange={(e) => setValues({ ...values, slug: e.target.value })}
        dir="ltr"
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          label="תיאור (עברית, אופציונלי)"
          rows={2}
          value={values.descriptionHe}
          onChange={(e) => setValues({ ...values, descriptionHe: e.target.value })}
        />
        <Textarea
          label="תיאור (ערבית, אופציונלי)"
          rows={2}
          value={values.descriptionAr}
          onChange={(e) => setValues({ ...values, descriptionAr: e.target.value })}
        />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">תמונת קטגוריה</span>
        <ImageDropzone
          multiple={false}
          onFilesSelected={(files) => setFile(files[0] ?? null)}
          existingImages={initial?.image?.url ? [{ id: 'current', url: initial.image.url }] : []}
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} size="lg">
        {initial ? 'עדכון קטגוריה' : 'הוספת קטגוריה'}
      </Button>
    </form>
  );
}
