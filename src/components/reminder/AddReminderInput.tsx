'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReminder } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import type { Reminder } from '@/types';

export function AddReminderInput() {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { selection } = useAppStore();

  const listId = selection.type === 'list' ? selection.listId : undefined;

  const { mutate: addReminder } = useMutation({
    mutationFn: (title: string) => createReminder({ title, listId }),
    onMutate: async (title) => {
      await queryClient.cancelQueries({ queryKey: ['reminders'] });
      const prev = queryClient.getQueryData<Reminder[]>(['reminders']);
      const optimistic: Reminder = {
        id: Date.now(),
        title,
        notes: null,
        dueDate: null,
        priority: 'NONE',
        completed: false,
        completedAt: null,
        listId: listId ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Reminder[]>(['reminders'], (old = []) => [...old, optimistic]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['reminders'], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (!trimmed) return;
      addReminder(trimmed);
      setValue('');
      // Stay in editing mode for continuous input; focus is kept
    }
    if (e.key === 'Escape') {
      setValue('');
      setIsEditing(false);
    }
  }

  function handleBlur() {
    if (!value.trim()) {
      setIsEditing(false);
    }
  }

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 text-blue-500 text-sm font-medium px-1 py-2 hover:opacity-70 transition-opacity"
      >
        <span className="text-lg leading-none">+</span>
        <span>새로운 리마인더 추가</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="제목"
        className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
      />
    </div>
  );
}
