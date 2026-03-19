'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReminders, getLists, updateReminder, ApiError } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import type { Priority, Reminder, ReminderList } from '@/types';

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'NONE', label: '없음' },
  { value: 'LOW', label: '낮음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'HIGH', label: '높음' },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function ReminderDetailPanel() {
  const { selectedReminderId, setSelectedReminderId } = useAppStore();
  const queryClient = useQueryClient();
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: () => getReminders({}),
  });
  const { data: lists = [] } = useQuery<ReminderList[]>({
    queryKey: ['lists'],
    queryFn: getLists,
  });

  const reminder = reminders.find((r) => r.id === selectedReminderId) ?? null;

  // Local editable state
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('NONE');
  const [listId, setListId] = useState<number | ''>('');
  const [dateEnabled, setDateEnabled] = useState(false);
  const [dateValue, setDateValue] = useState('');
  const [timeEnabled, setTimeEnabled] = useState(false);
  const [timeValue, setTimeValue] = useState('');

  // Sync local state when reminder changes
  useEffect(() => {
    if (!reminder) return;
    setTitle(reminder.title);
    setNotes(reminder.notes ?? '');
    setPriority(reminder.priority);
    setListId(reminder.listId ?? '');
    if (reminder.dueDate) {
      const d = new Date(reminder.dueDate);
      setDateEnabled(true);
      setDateValue(d.toISOString().slice(0, 10));
      const h = d.getHours();
      const m = d.getMinutes();
      setTimeEnabled(h !== 0 || m !== 0);
      setTimeValue(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    } else {
      setDateEnabled(false);
      setDateValue('');
      setTimeEnabled(false);
      setTimeValue('');
    }
  }, [reminder?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [saveError, setSaveError] = useState<string | null>(null);

  const { mutate: save } = useMutation({
    mutationFn: (data: Parameters<typeof updateReminder>[1]) =>
      updateReminder(selectedReminderId!, data),
    onSuccess: (updated) => {
      setSaveError(null);
      queryClient.setQueryData<Reminder[]>(['reminders'], (old = []) =>
        old.map((r) => (r.id === updated.id ? updated : r)),
      );
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? `저장 실패 (${err.status}): ${err.message}`
          : '저장 중 오류가 발생했습니다.';
      setSaveError(message);
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  function buildDueDate(): string | undefined {
    if (!dateEnabled || !dateValue) return undefined;
    const base = timeEnabled && timeValue ? `${dateValue}T${timeValue}:00` : `${dateValue}T00:00:00`;
    return base;
  }

  const debouncedTitle = useDebounce(title, 500);
  const debouncedNotes = useDebounce(notes, 500);

  const saveRef = useRef(save);
  saveRef.current = save;

  const autoSave = useCallback(() => {
    if (!selectedReminderId || !reminder) return;
    saveRef.current({
      title: debouncedTitle || reminder.title,
      notes: debouncedNotes || undefined,
      priority,
      listId: listId !== '' ? (listId as number) : undefined,
      dueDate: buildDueDate(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedNotes, priority, listId, dateEnabled, dateValue, timeEnabled, timeValue, selectedReminderId]);

  // Auto-save whenever debounced values change
  useEffect(() => {
    if (!selectedReminderId) return;
    autoSave();
  }, [autoSave, selectedReminderId]);

  if (!selectedReminderId || !reminder) return null;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) setSelectedReminderId(null);
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-40"
      style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}
    >
      {/* Slide-in panel */}
      <div
        className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col"
        style={{ animation: 'slideIn 300ms ease-out' }}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-gray-100">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-gray-400">세부사항</span>
            <button
              onClick={() => setSelectedReminderId(null)}
              className="text-blue-500 text-sm font-semibold"
            >
              완료
            </button>
          </div>
          {saveError && (
            <div className="px-5 pb-3 text-xs text-red-500">{saveError}</div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 text-sm text-gray-900 outline-none border-b border-gray-200 pb-1 bg-transparent"
              placeholder="제목"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">메모</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full mt-1 text-sm text-gray-900 outline-none border border-gray-200 rounded-lg p-2 bg-transparent resize-none"
              placeholder="메모 추가"
            />
          </div>

          {/* Date */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">날짜</label>
              <button
                onClick={() => {
                  setDateEnabled((v) => !v);
                  if (dateEnabled) { setTimeEnabled(false); setTimeValue(''); }
                }}
                className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                  dateEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {dateEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            {dateEnabled && (
              <input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none"
              />
            )}
          </div>

          {/* Time */}
          {dateEnabled && (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">시간</label>
                <button
                  onClick={() => setTimeEnabled((v) => !v)}
                  className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    timeEnabled ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {timeEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              {timeEnabled && (
                <input
                  type="time"
                  value={timeValue}
                  onChange={(e) => setTimeValue(e.target.value)}
                  className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none"
                />
              )}
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">우선순위</label>
            <div className="mt-1 flex rounded-lg overflow-hidden border border-gray-200">
              {PRIORITIES.map((p, i) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                    priority === p.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  } ${i > 0 ? 'border-l border-gray-200' : ''}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {lists.length > 0 && (
            <div>
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">목록</label>
              <select
                value={listId}
                onChange={(e) => setListId(e.target.value === '' ? '' : Number(e.target.value))}
                className="mt-1 w-full text-sm border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-white"
              >
                <option value="">없음</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
