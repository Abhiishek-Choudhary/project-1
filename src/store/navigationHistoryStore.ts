import { create } from 'zustand';
import type { UserStackParamList } from '../types/navigation';

export type NavHistoryEntry = {
  key: string;
  screen: keyof UserStackParamList;
  params?: UserStackParamList[keyof UserStackParamList];
};

interface NavigationHistoryState {
  entries: NavHistoryEntry[];
  index: number;
  isApplyingHistory: boolean;
  pushEntry: (entry: NavHistoryEntry) => void;
  setApplyingHistory: (value: boolean) => void;
  goBackIndex: () => number | null;
  goForwardIndex: () => number | null;
  reset: () => void;
}

const INITIAL: NavHistoryEntry = {
  key: 'MainTabs-Home',
  screen: 'MainTabs',
  params: { screen: 'Home' },
};

export const useNavigationHistoryStore = create<NavigationHistoryState>((set, get) => ({
  entries: [INITIAL],
  index: 0,
  isApplyingHistory: false,

  pushEntry: (entry) => {
    const { entries, index, isApplyingHistory } = get();
    if (isApplyingHistory) return;
    if (entries[index]?.key === entry.key) return;

    const next = entries.slice(0, index + 1);
    next.push(entry);
    set({ entries: next, index: next.length - 1 });
  },

  setApplyingHistory: (value) => set({ isApplyingHistory: value }),

  goBackIndex: () => {
    const { index } = get();
    return index > 0 ? index - 1 : null;
  },

  goForwardIndex: () => {
    const { index, entries } = get();
    return index < entries.length - 1 ? index + 1 : null;
  },

  reset: () => set({ entries: [INITIAL], index: 0, isApplyingHistory: false }),
}));
