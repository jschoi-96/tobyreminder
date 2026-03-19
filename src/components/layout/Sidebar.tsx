'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReminders, getLists } from '@/lib/api';
import { SmartListCard } from '@/components/sidebar/SmartListCard';
import { ListItem } from '@/components/sidebar/ListItem';
import { isToday } from '@/lib/dateUtils';
import { buildIncompleteCountMap } from '@/lib/countUtils';
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

  const todayCount = useMemo(
    () => reminders.filter((r) => isToday(r.dueDate) && !r.completed).length,
    [reminders],
  );
  const scheduledCount = useMemo(
    () => reminders.filter((r) => r.dueDate && new Date(r.dueDate) > new Date() && !r.completed).length,
    [reminders],
  );
  const allCount = useMemo(() => reminders.filter((r) => !r.completed).length, [reminders]);
  const completedCount = useMemo(() => reminders.filter((r) => r.completed).length, [reminders]);

  // O(n) 단일 패스로 listId별 미완료 카운트 맵을 생성
  const incompleteCountMap = useMemo(() => buildIncompleteCountMap(reminders), [reminders]);

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
              <ListItem key={list.id} list={list} incompleteCount={incompleteCountMap[list.id] ?? 0} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
