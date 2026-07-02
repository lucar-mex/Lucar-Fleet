import { create } from 'zustand';
import { Usuario, Empresa } from './types';

interface AuthState {
  user: Usuario | null;
  empresa: Empresa | null;
  loading: boolean;
  error: string | null;
  setUser: (user: Usuario | null) => void;
  setEmpresa: (empresa: Empresa | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  empresa: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setEmpresa: (empresa) => set({ empresa }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ user: null, empresa: null, loading: false, error: null }),
}));
