'use client';

import { useQuery } from '@tanstack/react-query';
import { getReminders, getLists } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { ReminderItem } from './ReminderItem';
import type { Reminder, ReminderList as ReminderListType } from '@/types';

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function ReminderList() {
  const { selection } = useAppStore();

  // 모든 컴포넌트가 동일한 ['reminders'] 캐시를 공유 → optimistic update 일관성 보장
  const { data: allReminders = [], isLoading } = useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: () => getReminders({}),
  });

  const { data: lists = [] } = useQuery<ReminderListType[]>({
    queryKey: ['lists'],
    queryFn: getLists,
  });

  const listColorMap = Object.fromEntries(lists.map((l) => [l.id, l.color ?? '#007AFF']));

  // 클라이언트 사이드 필터링
  let filtered: Reminder[];
  if (selection.type === 'list') {
    filtered = allReminders.filter((r) => r.listId === selection.listId);
  } else if (selection.filter === 'today') {
    filtered = allReminders.filter((r) => isToday(r.dueDate));
  } else if (selection.filter === 'scheduled') {
    filtered = allReminders.filter(
      (r) => r.dueDate && new Date(r.dueDate) > new Date() && !r.completed,
    );
  } else if (selection.filter === 'completed') {
    filtered = allReminders.filter((r) => r.completed);
  } else {
    filtered = allReminders;
  }

  const incomplete = filtered.filter((r) => !r.completed);
  const completed = filtered.filter((r) => r.completed);

  if (isLoading) {
    return <p className="text-sm text-gray-400 pt-4">불러오는 중...</p>;
  }

  if (filtered.length === 0) {
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
