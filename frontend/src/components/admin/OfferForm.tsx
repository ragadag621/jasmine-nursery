import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';
import type { Offer } from '@/types/content.types';

export interface OfferFormValues {
  titleHe: string;
  titleAr: string;
  descriptionHe: string;
  descriptionAr: string;
  isActive: boolean;
}

interface OfferFormProps {
  initial?: Offer;
  onSubmit: (values: OfferFormValues, file: File | null) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function OfferForm({ initial, onSubmit, isSubmitting, onCancel }: OfferFormProps) {
  const [values, setValues] = useState<OfferFormValues>({
    titleHe: initial?.title.he ?? '',
    titleAr: initial?.title.ar ?? '',
    descriptionHe: initial?.description.he ?? '',
    descriptionAr: initial?.description.ar ?? '',
    isActive: initial?.isActive ?? true,
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
          label="כותרת (עברית)"
          value={values.titleHe}
          onChange={(e) => setValues({ ...values, titleHe: e.target.value })}
          required
        />
        <Input
          label="כותרת (ערבית)"
          value={values.titleAr}
          onChange={(e) => setValues({ ...values, titleAr: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Textarea
          label="תיאור (עברית)"
          rows={2}
          value={values.descriptionHe}
          onChange={(e) => setValues({ ...values, descriptionHe: e.target.value })}
          required
        />
        <Textarea
          label="תיאור (ערבית)"
          rows={2}
          value={values.descriptionAr}
          onChange={(e) => setValues({ ...values, descriptionAr: e.target.value })}
          required
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => setValues({ ...values, isActive: e.target.checked })}
        />
        מבצע פעיל
      </label>

      <ImageDropzone
        multiple={false}
        onFilesSelected={(files) => setFile(files[0] ?? null)}
        existingImageUrls={initial?.image?.url ? [initial.image.url] : []}
      />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? 'עדכון מבצע' : 'הוספת מבצע'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            ביטול
          </Button>
        )}
      </div>
    </form>
  );
}
