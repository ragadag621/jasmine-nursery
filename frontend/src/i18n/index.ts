import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import he from './locales/he.json';
import ar from './locales/ar.json';

export const SUPPORTED_LANGUAGES = ['he', 'ar'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Both current languages are RTL. English (future) would be 'ltr' —
// keeping this as a lookup table (rather than a hardcoded 'rtl' everywhere)
// is what makes adding English later a one-line change instead of a rewrite.
export const LANGUAGE_DIRECTION: Record<SupportedLanguage, 'rtl' | 'ltr'> = {
  he: 'rtl',
  ar: 'rtl',
};

const STORAGE_KEY = 'alyasmin_language';

function getInitialLanguage(): SupportedLanguage {
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored as SupportedLanguage;
  }
  // Default to Hebrew — the nursery's primary local audience — rather than
  // guessing from browser locale, which would be unreliable for he/ar.
  return 'he';
}

i18n.use(initReactI18next).init({
  resources: {
    he: { translation: he },
    ar: { translation: ar },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'he',
  interpolation: { escapeValue: false },
  returnNull: false,
});

/**
 * Switches the active language, persists the choice, and updates
 * document-level dir/lang attributes so RTL mirroring applies globally
 * (not just to translated strings) — matches App.tsx's initial setup.
 */
export function changeLanguage(lang: SupportedLanguage): void {
  i18n.changeLanguage(lang);
  window.localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = LANGUAGE_DIRECTION[lang];
}

export default i18n;
