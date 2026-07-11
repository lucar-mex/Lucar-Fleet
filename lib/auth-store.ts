import { create } from 'zustand';
import { User, Company } from './types';

interface AuthState {
  user: User | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setCompany: (company: Company | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  company: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setCompany: (company) => set({ company }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ user: null, company: null, loading: false, error: null }),
}));
