import { useTranslation } from 'react-i18next';
import { changeLanguage, SUPPORTED_LANGUAGES } from '@/i18n';
import type { SupportedLanguage } from '@/i18n';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  he: 'עברית',
  ar: 'العربية',
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--color-sage-300)] p-0.5 text-xs">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          aria-pressed={current === lang}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
            current === lang
              ? 'bg-[var(--color-forest-700)] text-white'
              : 'text-[var(--color-ink-600)] hover:bg-[var(--color-sage-100)]'
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
