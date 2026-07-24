import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

/**
 * Functional in Phase 1 (unlike other admin pages) because it's the
 * concrete proof of the httpOnly-cookie auth flow: submitting calls
 * POST /auth/login, the backend sets the cookie, and AuthContext then
 * holds the resulting admin profile — no token ever touches this
 * component's state or localStorage.
 */
export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch {
      setError(t('admin.login.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--color-sage-100)] to-[var(--color-cream-100)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm animate-[fadeInUp_0.4s_var(--ease-botanical)] rounded-2xl border border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-8 shadow-[var(--shadow-lifted)]"
      >
        <div className="mb-6 text-center">
          <span className="mb-2 block text-3xl" aria-hidden="true">🌿</span>
          <h1 className="font-display mb-1 text-xl text-[var(--color-forest-800)]">
            {t('admin.login.title')}
          </h1>
          <p className="text-sm text-[var(--color-ink-600)]">{t('admin.login.subtitle')}</p>
        </div>

        <label className="mb-3 block text-sm">
          {t('admin.login.username')}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-[var(--color-sage-300)] px-3 py-2.5 outline-none transition-colors focus:border-[var(--color-forest-600)]"
          />
        </label>

        <label className="mb-5 block text-sm">
          {t('admin.login.password')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-[var(--color-sage-300)] px-3 py-2.5 outline-none transition-colors focus:border-[var(--color-forest-600)]"
          />
        </label>

        {error && (
          <p role="alert" className="mb-4 text-sm text-[var(--color-terracotta-600)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[var(--color-forest-700)] py-2.5 font-medium text-white shadow-[0_2px_8px_rgba(32,74,43,0.25)] transition-all hover:bg-[var(--color-forest-800)] active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? t('admin.login.submitting') : t('admin.login.submit')}
        </button>
      </form>
    </main>
  );
}
