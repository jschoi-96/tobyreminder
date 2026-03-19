import type { Reminder, ReminderList, ReminderRequest, ReminderListRequest } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export type GetRemindersParams = {
  listId?: number;
  filter?: 'all' | 'today' | 'scheduled' | 'completed';
};

export function getReminders(params: GetRemindersParams = {}): Promise<Reminder[]> {
  const query = new URLSearchParams();
  if (params.listId != null) query.set('listId', String(params.listId));
  if (params.filter && params.filter !== 'all') query.set('filter', params.filter);
  const qs = query.toString();
  return request<Reminder[]>(`/api/reminders${qs ? `?${qs}` : ''}`);
}

export function getReminderById(id: number): Promise<Reminder> {
  return request<Reminder>(`/api/reminders/${id}`);
}

export function createReminder(data: ReminderRequest): Promise<Reminder> {
  return request<Reminder>('/api/reminders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateReminder(id: number, data: ReminderRequest): Promise<Reminder> {
  return request<Reminder>(`/api/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function toggleComplete(id: number): Promise<Reminder> {
  return request<Reminder>(`/api/reminders/${id}/complete`, {
    method: 'PATCH',
  });
}

export function deleteReminder(id: number): Promise<void> {
  return request<void>(`/api/reminders/${id}`, { method: 'DELETE' });
}

export function getLists(): Promise<ReminderList[]> {
  return request<ReminderList[]>('/api/lists');
}

export function createList(data: ReminderListRequest): Promise<ReminderList> {
  return request<ReminderList>('/api/lists', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateList(id: number, data: ReminderListRequest): Promise<ReminderList> {
  return request<ReminderList>(`/api/lists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteList(id: number): Promise<void> {
  return request<void>(`/api/lists/${id}`, { method: 'DELETE' });
}
