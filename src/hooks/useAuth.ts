import { useAuthContext } from '../contexts/AuthContext';
import type { User } from '../types';

export function useAuth(): { user: User; isAuthenticated: boolean } {
  const { user, isAuthenticated } = useAuthContext();
  return { user: user as User, isAuthenticated };
}
