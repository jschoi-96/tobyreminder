import type { Reminder } from '@/types';

interface RollbackContext {
  prev: Reminder[] | undefined;
}

/**
 * onError context가 undefined이거나 prev가 없을 때 current로 안전하게 fallback
 */
export function safeRollback(
  ctx: RollbackContext | undefined,
  current: Reminder[],
): Reminder[] {
  return ctx?.prev ?? current;
}
