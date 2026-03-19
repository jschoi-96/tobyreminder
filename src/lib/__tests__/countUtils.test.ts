import { describe, it, expect } from 'vitest';
import { buildIncompleteCountMap } from '../countUtils';
import type { Reminder } from '@/types';

const makeReminder = (id: number, listId: number | null, completed: boolean): Reminder => ({
  id,
  title: `reminder ${id}`,
  notes: null,
  dueDate: null,
  priority: 'NONE',
  completed,
  completedAt: null,
  listId,
  createdAt: '',
  updatedAt: '',
});

describe('buildIncompleteCountMap()', () => {
  it('빈 배열이면 빈 맵을 반환한다', () => {
    expect(buildIncompleteCountMap([])).toEqual({});
  });

  it('미완료 리마인더를 listId별로 카운트한다', () => {
    const reminders = [
      makeReminder(1, 10, false),
      makeReminder(2, 10, false),
      makeReminder(3, 20, false),
    ];
    expect(buildIncompleteCountMap(reminders)).toEqual({ 10: 2, 20: 1 });
  });

  it('완료된 리마인더는 카운트하지 않는다', () => {
    const reminders = [
      makeReminder(1, 10, false),
      makeReminder(2, 10, true),
    ];
    expect(buildIncompleteCountMap(reminders)).toEqual({ 10: 1 });
  });

  it('listId가 null인 리마인더는 무시한다', () => {
    const reminders = [
      makeReminder(1, null, false),
      makeReminder(2, 10, false),
    ];
    expect(buildIncompleteCountMap(reminders)).toEqual({ 10: 1 });
  });

  it('모두 완료이면 빈 맵을 반환한다', () => {
    const reminders = [
      makeReminder(1, 10, true),
      makeReminder(2, 10, true),
    ];
    expect(buildIncompleteCountMap(reminders)).toEqual({});
  });
});
