import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { AppRouter } from '@/routes/AppRouter';
import { LANGUAGE_DIRECTION, type SupportedLanguage } from './i18n';
/**
 * dir/lang are driven by the active i18n language rather than hardcoded —
 * both Hebrew and Arabic are RTL today, but this stays correct if/when
 * English (LTR) is added later (see i18n/index.ts LANGUAGE_DIRECTION).
 */
function App() {
  const { i18n } = useTranslation();
  const lang = i18n.language as SupportedLanguage;
  const dir = LANGUAGE_DIRECTION[lang] ?? 'rtl';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <div dir={dir} lang={lang}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
