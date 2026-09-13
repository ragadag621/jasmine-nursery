export interface ContactFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}

/**
 * Mirrors the backend's contactCreateSchema rules (see
 * backend/src/validators/contact.validator.ts) so the form can show
 * instant feedback before a round-trip — the backend remains the source
 * of truth and re-validates independently.
 */
export function validateContactForm(input: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (input.name.trim().length < 2) {
    errors.name = 'השם חייב להכיל לפחות 2 תווים';
  }
  if (input.phone.trim().length !== 12) {
    errors.phone = 'מספר הטלפון חייב להכיל 10 תווים';
  }
  if (input.email && input.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = 'כתובת אימייל לא תקינה';
  }
  if (input.message.trim().length < 5) {
    errors.message = 'ההודעה חייבת להכיל לפחות 5 תווים';
  }

  return errors;
}

export function hasErrors(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
