import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Blocks rendering of any nested /admin/* route until AuthContext has
 * resolved the session check (GET /auth/me against the httpOnly cookie).
 * While that request is in flight we show a minimal loading state rather
 * than flashing the login page then redirecting — avoids UI jank on
 * refresh for an already-logged-in admin.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-cream-100)]">
        <p className="font-body text-[var(--color-ink-600)]">טוען...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
