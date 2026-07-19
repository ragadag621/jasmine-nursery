import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Testimonial } from '@/types/content.types';

interface TestimonialFormProps {
  initial?: Testimonial;
  onSubmit: (values: {
    customerName: string;
    rating: number;
    text: { he: string; ar: string };
    isVisible: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function TestimonialForm({ initial, onSubmit, isSubmitting, onCancel }: TestimonialFormProps) {
  const [customerName, setCustomerName] = useState(initial?.customerName ?? '');
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [textHe, setTextHe] = useState(initial?.text.he ?? '');
  const [textAr, setTextAr] = useState(initial?.text.ar ?? '');
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ customerName, rating, text: { he: textHe, ar: textAr }, isVisible });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="שם הלקוח" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />

      <label className="block text-sm">
        <span className="mb-1 block font-medium">דירוג</span>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)} ({n})
            </option>
          ))}
        </select>
      </label>

      <Textarea label="תוכן (עברית)" rows={2} value={textHe} onChange={(e) => setTextHe(e.target.value)} required />
      <Textarea label="תוכן (ערבית)" rows={2} value={textAr} onChange={(e) => setTextAr(e.target.value)} required />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
        הצג באתר הציבורי
      </label>

      <div className="flex gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? 'עדכון' : 'הוספה'}
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
