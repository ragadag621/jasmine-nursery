import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageDropzone } from './ImageDropzone';

export interface GalleryFormValues {
  titleHe: string;
  titleAr: string;
  category: string;
}

interface GalleryUploaderProps {
  onSubmit: (values: GalleryFormValues, files: File[]) => Promise<void>;
  isSubmitting: boolean;
}

export function GalleryUploader({ onSubmit, isSubmitting }: GalleryUploaderProps) {
  const [values, setValues] = useState<GalleryFormValues>({ titleHe: '', titleAr: '', category: 'nursery' });
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(values, files);
    setValues({ titleHe: '', titleAr: '', category: 'nursery' });
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-[var(--color-sage-200)] p-4">
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

      <label className="block text-sm">
        <span className="mb-1 block font-medium">קטגוריה</span>
        <select
          value={values.category}
          onChange={(e) => setValues({ ...values, category: e.target.value })}
          className="w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2"
        >
          <option value="nursery">המשתלה</option>
          <option value="before-after">עיצוב גינות</option>
          <option value="events">אירועים</option>
        </select>
      </label>

      <ImageDropzone multiple onFilesSelected={setFiles} />

      <Button type="submit" isLoading={isSubmitting} size="md">
        העלאת תמונות
      </Button>
    </form>
  );
}
