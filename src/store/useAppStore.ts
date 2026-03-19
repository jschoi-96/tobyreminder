import { create } from 'zustand';
import type { SmartFilter } from '@/types';

type Selection =
  | { type: 'smart'; filter: SmartFilter }
  | { type: 'list'; listId: number };

interface AppState {
  selection: Selection;
  searchQuery: string;
  selectedReminderId: number | null;
  selectSmartFilter: (filter: SmartFilter) => void;
  selectList: (listId: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedReminderId: (id: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selection: { type: 'smart', filter: 'all' },
  searchQuery: '',
  selectedReminderId: null,

  selectSmartFilter: (filter) =>
    set({ selection: { type: 'smart', filter }, searchQuery: '', selectedReminderId: null }),

  selectList: (listId) =>
    set({ selection: { type: 'list', listId }, searchQuery: '', selectedReminderId: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedReminderId: (id) => set({ selectedReminderId: id }),
}));
