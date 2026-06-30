import { useAuth } from './useAuth';

export function useTeacher() {
  const { user } = useAuth();
  return { teacher: user };
}
