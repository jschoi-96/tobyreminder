'use client';

import { useQuery } from '@tanstack/react-query';
import { getReminders, getLists } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { ReminderItem } from './ReminderItem';
import type { Reminder, ReminderList as ReminderListType } from '@/types';
import type { GetRemindersParams } from '@/lib/api';

export function ReminderList() {
  const { selection } = useAppStore();

  const params: GetRemindersParams =
    selection.type === 'list'
      ? { listId: selection.listId }
      : selection.filter !== 'all'
      ? { filter: selection.filter }
      : {};

  const { data: reminders = [], isLoading } = useQuery<Reminder[]>({
    queryKey: ['reminders', params],
    queryFn: () => getReminders(params),
  });

  const { data: lists = [] } = useQuery<ReminderListType[]>({
    queryKey: ['lists'],
    queryFn: getLists,
  });

  const listColorMap = Object.fromEntries(lists.map((l) => [l.id, l.color ?? '#007AFF']));

  const incomplete = reminders.filter((r) => !r.completed);
  const completed = reminders.filter((r) => r.completed);

  if (isLoading) {
    return <p className="text-sm text-gray-400 pt-4">불러오는 중...</p>;
  }

  if (reminders.length === 0) {
    return <p className="text-sm text-gray-400 pt-4">리마인더가 없습니다.</p>;
  }

  return (
    <div className="flex flex-col">
      {incomplete.map((r) => (
        <ReminderItem
          key={r.id}
          reminder={r}
          listColor={r.listId ? listColorMap[r.listId] : undefined}
        />
      ))}

      {completed.length > 0 && (
        <>
          {incomplete.length > 0 && <div className="my-2 border-t border-gray-100" />}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            완료됨
          </p>
          {completed.map((r) => (
            <ReminderItem
              key={r.id}
              reminder={r}
              listColor={r.listId ? listColorMap[r.listId] : undefined}
            />
          ))}
        </>
      )}
    </div>
  );
}
