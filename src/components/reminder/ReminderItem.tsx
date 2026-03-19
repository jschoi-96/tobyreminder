'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleComplete } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { isOverdue, formatDueDate } from '@/lib/dateUtils';
import { safeRollback } from '@/lib/toggleRollback';
import type { Reminder } from '@/types';

interface ReminderItemProps {
  reminder: Reminder;
  listColor?: string;
}

const PRIORITY_ICONS: Record<string, string> = {
  LOW: '!',
  MEDIUM: '!!',
  HIGH: '!!!',
};

export function ReminderItem({ reminder, listColor }: ReminderItemProps) {
  const queryClient = useQueryClient();
  const { setSelectedReminderId } = useAppStore();

  const { mutate: toggle } = useMutation({
    mutationFn: () => toggleComplete(reminder.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['reminders'] });
      const prev = queryClient.getQueryData<Reminder[]>(['reminders']);
      queryClient.setQueryData<Reminder[]>(['reminders'], (old = []) =>
        old.map((r) =>
          r.id === reminder.id ? { ...r, completed: !r.completed } : r,
        ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      const current = queryClient.getQueryData<Reminder[]>(['reminders']) ?? [];
      queryClient.setQueryData(['reminders'], safeRollback(ctx, current));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const overdue = isOverdue(reminder.dueDate, reminder.completed);
  const dateLabel = formatDueDate(reminder.dueDate);
  const color = listColor ?? '#007AFF';

  return (
    <div className="group flex items-start gap-3 px-1 py-2 rounded-lg hover:bg-gray-50 transition-colors">
      {/* Circle checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer hover:opacity-70"
        style={{
          borderColor: color,
          backgroundColor: reminder.completed ? color : 'transparent',
        }}
      >
        {reminder.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedReminderId(reminder.id)}>
        <p
          className={`text-sm leading-5 ${
            reminder.completed ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {reminder.title}
          {reminder.priority !== 'NONE' && (
            <span className="ml-1 text-red-500 font-bold text-xs">
              {PRIORITY_ICONS[reminder.priority]}
            </span>
          )}
        </p>
        {reminder.notes && (
          <p className="text-gray-400 truncate" style={{ fontSize: '13px' }}>
            {reminder.notes}
          </p>
        )}
        {dateLabel && (
          <p
            className="text-xs mt-0.5"
            style={{ color: overdue ? '#FF3B30' : '#8E8E93' }}
          >
            {dateLabel}
          </p>
        )}
      </div>

      {/* Detail button */}
      <button
        onClick={() => setSelectedReminderId(reminder.id)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-400 hover:text-blue-500 transition-all p-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
