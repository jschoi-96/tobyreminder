import { describe, it, expect } from 'vitest';
import { buildDueDate } from '../buildDueDate';

describe('buildDueDate()', () => {
  it('dateEnabled=false이면 undefined를 반환한다', () => {
    expect(buildDueDate({ dateEnabled: false, dateValue: '2026-03-19', timeEnabled: false, timeValue: '' })).toBeUndefined();
  });

  it('dateValue가 비어있으면 undefined를 반환한다', () => {
    expect(buildDueDate({ dateEnabled: true, dateValue: '', timeEnabled: false, timeValue: '' })).toBeUndefined();
  });

  it('날짜만 활성화되면 T00:00:00 붙은 문자열을 반환한다', () => {
    expect(buildDueDate({ dateEnabled: true, dateValue: '2026-03-19', timeEnabled: false, timeValue: '' }))
      .toBe('2026-03-19T00:00:00');
  });

  it('날짜+시간이 활성화되면 T{time}:00 붙은 문자열을 반환한다', () => {
    expect(buildDueDate({ dateEnabled: true, dateValue: '2026-03-19', timeEnabled: true, timeValue: '14:30' }))
      .toBe('2026-03-19T14:30:00');
  });

  it('timeEnabled=true이지만 timeValue가 비어있으면 T00:00:00을 반환한다 (방어처리)', () => {
    expect(buildDueDate({ dateEnabled: true, dateValue: '2026-03-19', timeEnabled: true, timeValue: '' }))
      .toBe('2026-03-19T00:00:00');
  });
});
