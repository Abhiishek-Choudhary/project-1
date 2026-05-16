import { create } from 'zustand';
import { getJsonStorage, setJsonStorage } from '../utils/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  hydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'light',

  setMode: async (mode) => {
    await setJsonStorage('THEME', mode);
    set({ mode });
  },

  hydrate: async () => {
    const saved = await getJsonStorage<ThemeMode>('THEME');
    if (saved) set({ mode: saved });
  },
}));
