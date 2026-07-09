import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrentAdmin, loginRequest, logoutRequest } from '@/api/auth.api';
import type { AdminUser } from '@/api/auth.api';

interface AuthContextValue {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Because auth is cookie-based (httpOnly), this context holds no token —
 * only the admin's profile info once the backend confirms a valid session.
 * On mount, we ask the backend "who am I?" (GET /auth/me); the browser
 * automatically attaches the httpOnly cookie if one exists. If it doesn't
 * (or is expired), that call 401s and `admin` stays null.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const user = await fetchCurrentAdmin();
      setAdmin(user);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    const handleUnauthorized = () => setAdmin(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [checkSession]);

  const login = async (username: string, password: string) => {
    const user = await loginRequest(username, password);
    setAdmin(user);
  };

  const logout = async () => {
    await logoutRequest();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ admin, isLoading, isAuthenticated: !!admin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
