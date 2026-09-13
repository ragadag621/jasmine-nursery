import { useEffect, useRef, useState } from 'react';
import type {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
} from 'react';
import { useTranslation } from 'react-i18next';

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

interface PreviewFile {
  id: string;
  file: File;
  url: string;
}

const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function ImageDropzone({
  multiple = true,
  onFilesSelected,
  existingImages = [],
  onRemoveExisting,
}: ImageDropzoneProps) {
  const { t } = useTranslation();

  const [selectedFiles, setSelectedFiles] = useState<
    PreviewFile[]
  >([]);

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<PreviewFile[]>([]);

  useEffect(() => {
    previewsRef.current = selectedFiles;
  }, [selectedFiles]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, []);

  const createFileId = (file: File) =>
    `${file.name}-${file.size}-${file.lastModified}`;

  const validateFiles = (files: File[]) => {
    const validFiles: File[] = [];
    const validationErrors: string[] = [];

    files.forEach((file) => {
      if (!ACCEPTED_TYPES.has(file.type)) {
        validationErrors.push(
          t('admin.gallery.invalidFileType', {
            name: file.name,
          }),
        );

        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(
          t('admin.gallery.fileTooLarge', {
            name: file.name,
          }),
        );

        return;
      }

      validFiles.push(file);
    });

    return {
      validFiles,
      validationErrors,
    };
  };

  const addFiles = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) {
      return;
    }

    const filesToProcess = multiple
      ? incomingFiles
      : incomingFiles.slice(0, 1);

    const {
      validFiles,
      validationErrors,
    } = validateFiles(filesToProcess);

    setErrors(validationErrors);

    if (validFiles.length === 0) {
      return;
    }

    const existingIds = new Set(
      selectedFiles.map((item) => item.id),
    );

    const uniqueFiles = validFiles.filter(
      (file) =>
        !existingIds.has(createFileId(file)),
    );

    if (uniqueFiles.length === 0) {
      return;
    }

    const newPreviews = uniqueFiles.map((file) => ({
      id: createFileId(file),
      file,
      url: URL.createObjectURL(file),
    }));

    const nextPreviews = multiple
      ? [...selectedFiles, ...newPreviews]
      : newPreviews;

    if (!multiple) {
      selectedFiles.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    }

    setSelectedFiles(nextPreviews);

    onFilesSelected(
      nextPreviews.map((preview) => preview.file),
    );

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    addFiles(
      Array.from(event.target.files ?? []),
    );
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    addFiles(
      Array.from(event.dataTransfer.files),
    );
  };

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);
  };

  const handleRemoveNewFile = (id: string) => {
    const fileToRemove = selectedFiles.find(
      (item) => item.id === id,
    );

    if (!fileToRemove) {
      return;
    }

    URL.revokeObjectURL(fileToRemove.url);

    const nextFiles = selectedFiles.filter(
      (item) => item.id !== id,
    );

    setSelectedFiles(nextFiles);

    onFilesSelected(
      nextFiles.map((item) => item.file),
    );
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleDropzoneKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        aria-label={t(
          'admin.gallery.uploadArea',
        )}
        onClick={openFilePicker}
        onKeyDown={handleDropzoneKeyDown}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'group relative overflow-hidden rounded-2xl',
          'border-2 border-dashed',
          'transition-all duration-200',
          'focus:outline-none',
          'focus:ring-2 focus:ring-[var(--color-forest-500)]',
          'focus:ring-offset-2',
          isDragging
            ? [
                'border-[var(--color-forest-600)]',
                'bg-[var(--color-sage-100)]',
              ].join(' ')
            : [
                'border-[var(--color-sage-300)]',
                'bg-[var(--color-cream-50)]',
                'hover:border-[var(--color-forest-500)]',
                'hover:bg-[var(--color-sage-50)]',
              ].join(' '),
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex min-h-44 flex-col items-center justify-center px-6 py-8 text-center">
          <div
            className={[
              'mb-4 flex h-14 w-14 items-center',
              'justify-center rounded-2xl',
              'bg-[var(--color-sage-100)]',
              'text-[var(--color-forest-700)]',
              'transition-transform duration-200',
              'group-hover:scale-105',
              isDragging ? 'scale-105' : '',
            ].join(' ')}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0 4 4m-4-4L8 8"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
              />
            </svg>
          </div>

          <p className="font-medium text-[var(--color-forest-800)]">
            {isDragging
              ? t('admin.gallery.dropImages')
              : t('admin.gallery.chooseImages')}
          </p>

          <p className="mt-1 text-sm text-[var(--color-ink-500)]">
            {t('admin.gallery.uploadHint')}
          </p>

          <p className="mt-3 text-xs text-[var(--color-ink-400)]">
            {multiple
              ? t('admin.gallery.multipleImages')
              : t('admin.gallery.singleImage')}
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div
            className="border-t border-[var(--color-sage-200)] bg-white/80 p-4"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-forest-800)]">
                  {t(
                    'admin.gallery.selectedImages',
                  )}
                </h3>

                <p className="mt-0.5 text-xs text-[var(--color-ink-500)]">
                  {t(
                    'admin.gallery.imageCount',
                    {
                      count:
                        selectedFiles.length,
                    },
                  )}
                </p>
              </div>

              <span className="rounded-full bg-[var(--color-sage-100)] px-2.5 py-1 text-xs font-medium text-[var(--color-forest-700)]">
                {t('admin.gallery.newImages', {
                  count: selectedFiles.length,
                })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {selectedFiles.map((preview) => (
                <div
                  key={preview.id}
                  className={[
                    'group relative aspect-square',
                    'overflow-hidden rounded-xl',
                    'bg-[var(--color-sage-50)]',
                    'ring-2 ring-[var(--color-forest-500)]',
                    'ring-offset-1',
                  ].join(' ')}
                >
                  <img
                    src={preview.url}
                    alt={preview.file.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveNewFile(
                        preview.id,
                      )
                    }
                    aria-label={t(
                      'admin.gallery.removeImage',
                    )}
                    className={[
                      'absolute right-2 top-2 flex h-8 w-8',
                      'items-center justify-center',
                      'rounded-full bg-black/65 text-white',
                      'shadow-md backdrop-blur-sm',
                      'transition-all',
                      'hover:bg-[var(--color-terracotta-600)]',
                      'focus:outline-none',
                      'focus:ring-2 focus:ring-white',
                    ].join(' ')}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6l12 12M18 6 6 18"
                      />
                    </svg>
                  </button>

                  <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-[var(--color-forest-700)] px-2 py-1 text-[10px] font-medium text-white">
                    {t('admin.gallery.new')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          className={[
            'rounded-xl border',
            'border-[var(--color-terracotta-300)]',
            'bg-[var(--color-terracotta-50)]',
            'px-4 py-3',
          ].join(' ')}
        >
          <ul className="space-y-1 text-sm text-[var(--color-terracotta-700)]">
            {errors.map((error, index) => (
              <li key={`${error}-${index}`}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {existingImages.length > 0 && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-soft)]">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-[var(--color-forest-800)]">
              {t(
                'admin.gallery.currentImages',
              )}
            </h3>

            <p className="mt-0.5 text-xs text-[var(--color-ink-500)]">
              {t(
                'admin.gallery.currentImagesDescription',
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {existingImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-[var(--color-sage-50)]"
              >
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() =>
                      onRemoveExisting(
                        image.id,
                      )
                    }
                    aria-label={t(
                      'admin.gallery.removeImage',
                    )}
                    className={[
                      'absolute right-2 top-2 flex h-8 w-8',
                      'items-center justify-center',
                      'rounded-full bg-black/65 text-white',
                      'shadow-md backdrop-blur-sm',
                      'transition-all',
                      'hover:bg-[var(--color-terracotta-600)]',
                      'focus:outline-none',
                      'focus:ring-2 focus:ring-white',
                    ].join(' ')}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6l12 12M18 6 6 18"
                      />
                    </svg>
                  </button>
                )}

                <div className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                  {t(
                    'admin.gallery.existing',
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}