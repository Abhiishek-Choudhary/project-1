import { create } from 'zustand';
import type { User } from '../types';
import { clearSecureTokens } from '../utils/storage';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: (user) => set({ user, isAuthenticated: true, isLoading: false }),

  logout: async () => {
    await authService.logout();
    await clearSecureTokens();
    set({ user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const user = await authService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
