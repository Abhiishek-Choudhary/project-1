import { create } from 'zustand';
import { getJsonStorage, setJsonStorage } from '../utils/storage';

export type AppLocale = 'en' | 'hi';

interface LanguageState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  hydrate: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  locale: 'en',

  setLocale: async (locale) => {
    await setJsonStorage('LANGUAGE', locale);
    set({ locale });
  },

  hydrate: async () => {
    const saved = await getJsonStorage<AppLocale>('LANGUAGE');
    if (saved === 'en' || saved === 'hi') set({ locale: saved });
  },
}));
