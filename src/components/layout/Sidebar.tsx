'use client';

import { useQuery } from '@tanstack/react-query';
import { getReminders, getLists } from '@/lib/api';
import { SmartListCard } from '@/components/sidebar/SmartListCard';
import { ListItem } from '@/components/sidebar/ListItem';
import { isToday } from '@/lib/dateUtils';
import type { Reminder } from '@/types';

export function Sidebar() {
  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: () => getReminders({}),
  });

  const { data: lists = [] } = useQuery({
    queryKey: ['lists'],
    queryFn: getLists,
  });

  const todayCount = reminders.filter((r) => isToday(r.dueDate) && !r.completed).length;
  const scheduledCount = reminders.filter(
    (r) => r.dueDate && new Date(r.dueDate) > new Date() && !r.completed,
  ).length;
  const allCount = reminders.filter((r) => !r.completed).length;
  const completedCount = reminders.filter((r) => r.completed).length;

  const incompleteByList = (listId: number) =>
    reminders.filter((r) => r.listId === listId && !r.completed).length;

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full overflow-y-auto py-4 px-3 gap-4"
      style={{ backgroundColor: '#F2F2F7' }}
    >
      {/* Smart list cards */}
      <div className="grid grid-cols-2 gap-2">
        <SmartListCard filter="today" label="오늘" icon="📅" iconBg="#FFD1D1" count={todayCount} />
        <SmartListCard filter="scheduled" label="예정" icon="📋" iconBg="#FFD1D1" count={scheduledCount} />
        <SmartListCard filter="all" label="전체" icon="📌" iconBg="#E5E5EA" count={allCount} />
        <SmartListCard filter="completed" label="완료됨" icon="✅" iconBg="#E5E5EA" count={completedCount} />
      </div>

      {/* My lists */}
      {lists.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 mb-1">
            나의 목록
          </p>
          <div className="flex flex-col gap-0.5">
            {lists.map((list) => (
              <ListItem key={list.id} list={list} incompleteCount={incompleteByList(list.id)} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
