import { useAuthContext } from '@/context/AuthContext';

/**
 * Thin wrapper so components import `useAuth` from hooks/ (conventional
 * location) without needing to know the state lives in a React Context.
 */
export function useAuth() {
  return useAuthContext();
}
