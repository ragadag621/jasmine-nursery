import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { validateContactForm, hasErrors } from '@/utils/validators';
import type { ContactFormErrors } from '@/utils/validators';

import { submitContactForm } from '@/api/contact.api';
import { useToast } from '@/context/ToastContext';

const initialState = {
  name: '',
  phone: '',
  email: '',
  message: '',
};

function formatIsraeliPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function ContactForm() {
  const { t } = useTranslation();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { showToast } = useToast();

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatIsraeliPhone(e.target.value);

    setForm((current) => ({
      ...current,
      phone: formattedPhone,
    }));

    if (errors.phone) {
      setErrors((current) => ({
        ...current,
        phone: undefined,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateContactForm(form);

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactForm(form);

      setIsSubmitted(true);
      setForm(initialState);

      showToast(
        t('contact.form.successTitle'),
        'success',
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        t('contact.form.submit');

      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="animate-[scaleIn_0.3s_var(--ease-botanical)] rounded-2xl border border-[var(--color-forest-600)]/30 bg-[var(--color-forest-600)]/5 p-7 text-center">
        <p className="font-display text-lg text-[var(--color-forest-800)]">
          {t('contact.form.successTitle')}
        </p>

        <p className="mt-1 text-sm text-[var(--color-ink-600)]">
          {t('contact.form.successBody')}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setIsSubmitted(false)}
        >
          {t('contact.form.sendAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
      noValidate
    >
      <Input
        id="contact-name"
        label={t('contact.form.name')}
        placeholder={t('contact.form.namePlaceholder')}
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
        error={errors.name}
        autoComplete="name"
        required
      />

      <Input
        id="contact-phone"
        label={t('contact.form.phone')}
        placeholder={t('contact.form.phonePlaceholder')}
        type="tel"
        value={form.phone}
        onChange={handlePhoneChange}
        error={errors.phone}
        inputMode="tel"
        autoComplete="tel"
        dir="ltr"
        maxLength={12}
        required
      />

      <Input
        id="contact-email"
        label={t('contact.form.email')}
        placeholder={t('contact.form.emailPlaceholder')}
        type="email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value,
          })
        }
        error={errors.email}
        autoComplete="email"
        inputMode="email"
        dir="ltr"
      />

      <Textarea
        id="contact-message"
        label={t('contact.form.message')}
        placeholder={t('contact.form.messagePlaceholder')}
        rows={4}
        value={form.message}
        onChange={(e) =>
          setForm({
            ...form,
            message: e.target.value,
          })
        }
        error={errors.message}
        required
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        size="lg"
        className="mt-1 w-full"
      >
        {isSubmitting
          ? t('contact.form.sending')
          : t('contact.form.submit')}
      </Button>
    </form>
  );
}