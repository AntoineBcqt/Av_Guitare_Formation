import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api, setToken, clearToken } from '../lib/api';
import { disconnectSocket } from '../lib/socket';
import type { User } from '../types';

interface LoginResponse {
  access_token: string;
  user: { id: string; email: string; role: 'student' | 'admin'; firstName: string; lastName: string };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

function makeInitials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

function mapApiUser(raw: LoginResponse['user']): User {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: raw.role === 'admin' ? 'teacher' : 'student',
    initials: makeInitials(raw.firstName, raw.lastName),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const stored = localStorage.getItem('av_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        clearToken();
        localStorage.removeItem('av_user');
      }
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const data = await api.post<LoginResponse>('/auth/login', { email, password }, false);
    setToken(data.access_token);
    const mapped = mapApiUser(data.user);
    localStorage.setItem('av_user', JSON.stringify(mapped));
    setUser(mapped);
    return mapped;
  }

  async function register(email: string, password: string, firstName: string, lastName: string) {
    await api.post('/auth/register', { email, password, firstName, lastName }, false);
    await login(email, password);
  }

  function logout() {
    clearToken();
    localStorage.removeItem('av_user');
    disconnectSocket();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
