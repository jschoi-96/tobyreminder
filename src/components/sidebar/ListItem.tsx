'use client';

import { useAppStore } from '@/store/useAppStore';
import type { ReminderList } from '@/types';

interface ListItemProps {
  list: ReminderList;
  incompleteCount: number;
}

export function ListItem({ list, incompleteCount }: ListItemProps) {
  const { selection, selectList } = useAppStore();
  const isSelected = selection.type === 'list' && selection.listId === list.id;

  return (
    <button
      onClick={() => selectList(list.id)}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors ${
        isSelected ? 'bg-blue-100' : 'hover:bg-black/5'
      }`}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        style={{ backgroundColor: list.color ?? '#8E8E93' }}
      >
        {list.icon ?? '📋'}
      </span>
      <span className="flex-1 text-sm font-medium text-gray-800 truncate">{list.name}</span>
      {incompleteCount > 0 && (
        <span className="text-sm text-gray-400">{incompleteCount}</span>
      )}
    </button>
  );
}
