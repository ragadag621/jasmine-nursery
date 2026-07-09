import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Functional in Phase 1 (unlike other admin pages) because it's the
 * concrete proof of the httpOnly-cookie auth flow: submitting calls
 * POST /auth/login, the backend sets the cookie, and AuthContext then
 * holds the resulting admin profile — no token ever touches this
 * component's state or localStorage.
 */
export default function LoginPage() {
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
      setError('שם משתמש או סיסמה שגויים');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-sage-100)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-[var(--color-sage-200)] bg-[var(--color-cream-50)] p-8 shadow-sm"
      >
        <h1 className="font-display mb-1 text-xl text-[var(--color-forest-800)]">
          כניסת מנהל
        </h1>
        <p className="mb-6 text-sm text-[var(--color-ink-600)]">
          משתלת אליאסמין — לוח ניהול
        </p>

        <label className="mb-3 block text-sm">
          שם משתמש
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2 outline-none focus:border-[var(--color-forest-600)]"
          />
        </label>

        <label className="mb-4 block text-sm">
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[var(--color-sage-300)] px-3 py-2 outline-none focus:border-[var(--color-forest-600)]"
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
          className="w-full rounded-md bg-[var(--color-forest-700)] py-2 font-medium text-white transition-colors hover:bg-[var(--color-forest-800)] disabled:opacity-60"
        >
          {isSubmitting ? 'מתחבר...' : 'התחברות'}
        </button>
      </form>
    </main>
  );
}
