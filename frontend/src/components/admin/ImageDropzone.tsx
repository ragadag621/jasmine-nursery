import { useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

export interface ExistingImage {
  id: string;
  url: string;
}

interface ImageDropzoneProps {
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  existingImages?: ExistingImage[];
  onRemoveExisting?: (id: string) => void;
}

export function ImageDropzone({
  multiple = true,
  onFilesSelected,
  existingImages = [],
  onRemoveExisting,
}: ImageDropzoneProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    onFilesSelected(files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="cursor-pointer rounded-lg border-2 border-dashed border-[var(--color-sage-300)] p-6 text-center text-sm text-[var(--color-ink-600)] transition-colors hover:border-[var(--color-forest-600)]"
      >
        גררו תמונות לכאן או לחצו לבחירה ({multiple ? 'ניתן לבחור כמה תמונות' : 'תמונה אחת'})
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {(previews.length > 0 || existingImages.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {existingImages.map((img) => (
            <div key={img.id} className="group relative">
              <img src={img.url} alt="" className="h-16 w-16 rounded-md object-cover opacity-90" />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(img.id)}
                  aria-label="הסרת תמונה"
                  className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-terracotta-600)] text-xs text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {previews.map((url, i) => (
            <img
              key={`new-${i}`}
              src={url}
              alt=""
              className="h-16 w-16 rounded-md object-cover ring-2 ring-[var(--color-forest-500)]"
            />
          ))}
        </div>
      )}
    </div>
  );
}
