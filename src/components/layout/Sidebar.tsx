'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReminders, getLists, createList } from '@/lib/api';
import { SmartListCard } from '@/components/sidebar/SmartListCard';
import { ListItem } from '@/components/sidebar/ListItem';
import { isToday, isScheduled } from '@/lib/dateUtils';
import { buildIncompleteCountMap } from '@/lib/countUtils';
import type { Reminder, ReminderList } from '@/types';

export function Sidebar() {
  const queryClient = useQueryClient();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const listInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAddingList) listInputRef.current?.focus();
  }, [isAddingList]);

  const { mutate: addList, isPending: isAddingListPending } = useMutation({
    mutationFn: (name: string) => createList({ name }),
    onSuccess: (created) => {
      queryClient.setQueryData<ReminderList[]>(['lists'], (old = []) => [...old, created]);
      setNewListName('');
      setIsAddingList(false);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['lists'] }),
  });

  function handleListKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmed = newListName.trim();
      if (!trimmed) return;
      addList(trimmed);
    }
    if (e.key === 'Escape') {
      setNewListName('');
      setIsAddingList(false);
    }
  }

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
    () => reminders.filter((r) => isScheduled(r.dueDate, r.completed)).length,
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
      <div>
        <div className="flex items-center justify-between px-3 mb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">나의 목록</p>
          <button
            onClick={() => setIsAddingList((v) => !v)}
            className="text-gray-400 hover:text-blue-500 transition-colors text-lg leading-none"
            title="목록 추가"
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {lists.map((list) => (
            <ListItem key={list.id} list={list} incompleteCount={incompleteCountMap[list.id] ?? 0} />
          ))}
          {isAddingList && (
            <div className="flex items-center gap-2 px-3 py-1.5">
              <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm flex-shrink-0">
                📋
              </span>
              <input
                ref={listInputRef}
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={handleListKeyDown}
                onBlur={() => { if (!newListName.trim()) setIsAddingList(false); }}
                placeholder="목록 이름"
                disabled={isAddingListPending}
                className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder:text-gray-400 disabled:opacity-50"
              />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
