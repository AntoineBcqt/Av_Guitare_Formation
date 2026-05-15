import { currentUser } from '../mock';

export function useAuth() {
  return { user: currentUser, isAuthenticated: true };
}
