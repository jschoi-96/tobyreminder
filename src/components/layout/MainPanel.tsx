'use client';

import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { getLists } from '@/lib/api';
import { ReminderList } from '@/components/reminder/ReminderList';
import { AddReminderInput } from '@/components/reminder/AddReminderInput';
import type { ReminderList as ReminderListType } from '@/types';

const SMART_LABELS: Record<string, string> = {
  all: '전체',
  today: '오늘',
  scheduled: '예정',
  completed: '완료됨',
};

export function MainPanel() {
  const { selection } = useAppStore();

  const { data: lists = [] } = useQuery<ReminderListType[]>({
    queryKey: ['lists'],
    queryFn: getLists,
  });

  let title = '전체';
  let titleColor = '#000000';

  if (selection.type === 'smart') {
    title = SMART_LABELS[selection.filter] ?? '전체';
    if (selection.filter === 'today' || selection.filter === 'scheduled') {
      titleColor = '#FF3B30';
    }
  } else {
    const list = lists.find((l) => l.id === selection.listId);
    title = list?.name ?? '';
    titleColor = list?.color ?? '#000000';
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      <div className="px-6 pt-8 pb-2">
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {title}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-2">
        <ReminderList />
        {(selection.type === 'list' ||
          (selection.type === 'smart' && selection.filter !== 'completed')) && (
          <div className="mt-1">
            <AddReminderInput />
          </div>
        )}
      </div>
    </main>
  );
}
