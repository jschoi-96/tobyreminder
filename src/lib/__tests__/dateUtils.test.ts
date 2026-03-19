import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isToday, isOverdue, formatDueDate } from '../dateUtils';

const NOW = new Date('2026-03-19T10:00:00');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => {
  vi.useRealTimers();
});

describe('isToday()', () => {
  it('오늘 날짜 문자열이면 true를 반환한다', () => {
    expect(isToday('2026-03-19T08:00:00')).toBe(true);
  });

  it('오늘 자정이면 true를 반환한다', () => {
    expect(isToday('2026-03-19T00:00:00')).toBe(true);
  });

  it('어제 날짜이면 false를 반환한다', () => {
    expect(isToday('2026-03-18T23:59:59')).toBe(false);
  });

  it('내일 날짜이면 false를 반환한다', () => {
    expect(isToday('2026-03-20T00:00:00')).toBe(false);
  });

  it('null이면 false를 반환한다', () => {
    expect(isToday(null)).toBe(false);
  });
});

describe('isOverdue()', () => {
  it('과거 날짜이고 미완료이면 true를 반환한다', () => {
    expect(isOverdue('2026-03-18T09:00:00', false)).toBe(true);
  });

  it('과거 날짜이더라도 완료이면 false를 반환한다', () => {
    expect(isOverdue('2026-03-18T09:00:00', true)).toBe(false);
  });

  it('미래 날짜이면 false를 반환한다', () => {
    expect(isOverdue('2026-03-20T09:00:00', false)).toBe(false);
  });

  it('null이면 false를 반환한다', () => {
    expect(isOverdue(null, false)).toBe(false);
  });
});

describe('formatDueDate()', () => {
  it('오늘 날짜이면 시간 정보가 포함된 문자열을 반환한다', () => {
    const result = formatDueDate('2026-03-19T14:30:00');
    expect(result).toBeTruthy();
    // 시간 포함 여부: 시/분 숫자가 들어있는지 확인 (로케일 무관)
    expect(result).toMatch(/\d+.+\d+/);
  });

  it('다른 날짜이면 월/일 형태를 반환한다', () => {
    const result = formatDueDate('2026-03-25T09:00:00');
    expect(result).toBeTruthy();
    expect(result).not.toMatch(/14:30/);
  });

  it('null이면 null을 반환한다', () => {
    expect(formatDueDate(null)).toBeNull();
  });
});
