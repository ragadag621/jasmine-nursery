import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { validateContactForm, hasErrors } from '@/utils/validators';
import type { ContactFormErrors } from '@/utils/validators';
import { submitContactForm } from '@/api/contact.api';
import { useToast } from '@/context/ToastContext';

const initialState = { name: '', phone: '', email: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(form);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    try {
      await submitContactForm(form);
      setIsSubmitted(true);
      setForm(initialState);
      showToast('ההודעה נשלחה בהצלחה!', 'success');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'שליחת ההודעה נכשלה, נסו שוב';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-[var(--color-forest-600)]/30 bg-[var(--color-forest-600)]/5 p-6 text-center">
        <p className="font-display text-lg text-[var(--color-forest-800)]">תודה על פנייתכם!</p>
        <p className="mt-1 text-sm text-[var(--color-ink-600)]">ניצור איתכם קשר בהקדם.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsSubmitted(false)}>
          שליחת הודעה נוספת
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="שם מלא"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        required
      />
      <Input
        label="טלפון"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        error={errors.phone}
        required
      />
      <Input
        label="אימייל (אופציונלי)"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
      />
      <Textarea
        label="הודעה"
        rows={4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        error={errors.message}
        required
      />
      <Button type="submit" isLoading={isSubmitting} size="lg">
        שליחה
      </Button>
    </form>
  );
}
