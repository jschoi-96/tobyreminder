import { create } from 'zustand';
import type { SmartFilter } from '@/types';

type Selection =
  | { type: 'smart'; filter: SmartFilter }
  | { type: 'list'; listId: number };

interface AppState {
  selection: Selection;
  searchQuery: string;
  selectSmartFilter: (filter: SmartFilter) => void;
  selectList: (listId: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selection: { type: 'smart', filter: 'all' },
  searchQuery: '',

  selectSmartFilter: (filter) =>
    set({ selection: { type: 'smart', filter }, searchQuery: '' }),

  selectList: (listId) =>
    set({ selection: { type: 'list', listId }, searchQuery: '' }),

  setSearchQuery: (query) => set({ searchQuery: query }),
}));
