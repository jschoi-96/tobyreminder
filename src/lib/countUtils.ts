import type { Reminder } from '@/types';

/** listId별 미완료 리마인더 수를 O(n) 단일 패스로 계산 */
export function buildIncompleteCountMap(reminders: Reminder[]): Record<number, number> {
  const map: Record<number, number> = {};
  for (const r of reminders) {
    if (r.completed || r.listId == null) continue;
    map[r.listId] = (map[r.listId] ?? 0) + 1;
  }
  return map;
}
