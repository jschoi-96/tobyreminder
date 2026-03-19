import { describe, it, expect } from 'vitest';
import { safeRollback } from '../toggleRollback';
import type { Reminder } from '@/types';

const makeReminder = (id: number): Reminder => ({
  id, title: 'test', notes: null, dueDate: null,
  priority: 'NONE', completed: false, completedAt: null,
  listId: null, createdAt: '', updatedAt: '',
});

describe('safeRollback()', () => {
  it('prev가 있으면 prev를 반환한다', () => {
    const prev = [makeReminder(1)];
    expect(safeRollback({ prev }, [])).toBe(prev);
  });

  it('context가 undefined이면 current를 반환한다', () => {
    const current = [makeReminder(1)];
    expect(safeRollback(undefined, current)).toBe(current);
  });

  it('context.prev가 undefined이면 current를 반환한다', () => {
    const current = [makeReminder(1)];
    expect(safeRollback({ prev: undefined }, current)).toBe(current);
  });
});
