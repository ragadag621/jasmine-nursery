import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Testimonial } from '@/types/content.types';

export interface TestimonialFormValues {
  customerName: string;
  rating: number;
  text: {
    he: string;
    ar: string;
  };
  isVisible: boolean;
}

interface TestimonialFormProps {
  initial?: Testimonial;
  onSubmit: (
    values: TestimonialFormValues,
  ) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function TestimonialForm({
  initial,
  onSubmit,
  isSubmitting,
  onCancel,
}: TestimonialFormProps) {
  const { t } = useTranslation();

  const [customerName, setCustomerName] = useState(
    initial?.customerName ?? '',
  );

  const [rating, setRating] = useState(
    initial?.rating ?? 5,
  );

  const [textHe, setTextHe] = useState(
    initial?.text.he ?? '',
  );

  const [textAr, setTextAr] = useState(
    initial?.text.ar ?? '',
  );

  const [isVisible, setIsVisible] = useState(
    initial?.isVisible ?? true,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await onSubmit({
      customerName,
      rating,
      text: {
        he: textHe,
        ar: textAr,
      },
      isVisible,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <Input
        label={t(
          'admin.content.testimonialForm.customerName',
        )}
        value={customerName}
        onChange={(e) =>
          setCustomerName(e.target.value)
        }
        required
      />

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-[var(--color-ink-700)]">
          {t(
            'admin.content.testimonialForm.rating',
          )}
        </span>

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
          className="
            min-h-11
            w-full
            rounded-md
            border
            border-[var(--color-sage-300)]
            bg-white
            px-3
            py-2
            text-base
            text-[var(--color-ink-700)]
            outline-none
            focus:border-[var(--color-forest-500)]
            focus:ring-2
            focus:ring-[var(--color-forest-200)]
          "
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)} ({n})
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <Textarea
          label={t(
            'admin.content.testimonialForm.textHe',
          )}
          rows={3}
          value={textHe}
          onChange={(e) =>
            setTextHe(e.target.value)
          }
          required
        />

        <Textarea
          label={t(
            'admin.content.testimonialForm.textAr',
          )}
          rows={3}
          value={textAr}
          onChange={(e) =>
            setTextAr(e.target.value)
          }
          required
        />
      </div>

      <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--color-ink-700)]">
        <input
          type="checkbox"
          checked={isVisible}
          onChange={(e) =>
            setIsVisible(e.target.checked)
          }
          className="
            h-4
            w-4
            rounded
            border-[var(--color-sage-300)]
          "
        />

        <span>
          {t(
            'admin.content.testimonialForm.isVisible',
          )}
        </span>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {initial
            ? t(
                'admin.content.testimonialForm.update',
              )
            : t(
                'admin.content.testimonialForm.create',
              )}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t(
              'admin.content.testimonialForm.cancel',
            )}
          </Button>
        )}
      </div>
    </form>
  );
}