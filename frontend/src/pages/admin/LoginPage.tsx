
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

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
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        bg-[var(--color-cream-100)]
        px-4
        py-8
        sm:px-6
      "
    >
      {/* Language switcher */}
      <div
        className="
          absolute
          right-4
          top-4
          sm:right-6
          sm:top-6
        "
      >
        <LanguageSwitcher />
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="
          w-full
          max-w-sm
          animate-[fadeInUp_0.4s_var(--ease-botanical)]
          rounded-2xl
          border
          border-[var(--color-border)]
          bg-[var(--color-cream-50)]
          p-6
          shadow-[var(--shadow-lifted)]
          sm:p-8
        "
      >
        {/* Header */}
        <div className="mb-7 text-center">

          <h1
            className="
              font-display
              text-xl
              leading-tight
              text-[var(--color-forest-800)]
              sm:text-2xl
            "
          >
            {t('admin.login.title')}
          </h1>

          <p
            className="
              mt-1.5
              text-sm
              leading-6
              text-[var(--color-ink-600)]
            "
          >
            {t('admin.login.subtitle')}
          </p>
        </div>

        {/* Username */}
        <label
          htmlFor="admin-username"
          className="
            mb-4
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          {t('admin.login.username')}

          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            className="
              mt-1.5
              min-h-11
              w-full
              rounded-lg
              border
              border-[var(--color-sage-300)]
              bg-[var(--color-cream-50)]
              px-3
              py-2.5
              text-[max(16px,0.95rem)]
              font-normal
              text-[var(--color-ink-900)]
              outline-none
              transition-colors
              focus:border-[var(--color-forest-600)]
              focus:ring-2
              focus:ring-[var(--color-forest-600)]/15
            "
          />
        </label>

        {/* Password */}
        <label
          htmlFor="admin-password"
          className="
            mb-5
            block
            text-sm
            font-medium
            text-[var(--color-ink-900)]
          "
        >
          {t('admin.login.password')}

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="
              mt-1.5
              min-h-11
              w-full
              rounded-lg
              border
              border-[var(--color-sage-300)]
              bg-[var(--color-cream-50)]
              px-3
              py-2.5
              text-[max(16px,0.95rem)]
              font-normal
              text-[var(--color-ink-900)]
              outline-none
              transition-colors
              focus:border-[var(--color-forest-600)]
              focus:ring-2
              focus:ring-[var(--color-forest-600)]/15
            "
          />
        </label>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="
              mb-4
              rounded-lg
              border
              border-[var(--color-terracotta-500)]/20
              bg-[var(--color-terracotta-500)]/5
              px-3
              py-2.5
              text-sm
              leading-5
              text-[var(--color-terracotta-600)]
            "
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            min-h-11
            w-full
            rounded-lg
            bg-[var(--color-forest-700)]
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            shadow-[var(--shadow-soft)]
            transition-all
            duration-200
            ease-[var(--ease-botanical)]
            hover:bg-[var(--color-forest-800)]
            active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--color-forest-600)]
            focus-visible:ring-offset-2
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting
            ? t('admin.login.submitting')
            : t('admin.login.submit')}
        </button>
      </form>
    </main>
  );
}
