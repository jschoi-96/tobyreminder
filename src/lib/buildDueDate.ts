interface DueDateParams {
  dateEnabled: boolean;
  dateValue: string;
  timeEnabled: boolean;
  timeValue: string;
}

function localOffset(): string {
  const off = new Date().getTimezoneOffset(); // 양수 = UTC 서쪽, 음수 = UTC 동쪽
  const sign = off <= 0 ? '+' : '-';
  const abs = Math.abs(off);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  return `${sign}${h}:${m}`;
}

export function buildDueDate({ dateEnabled, dateValue, timeEnabled, timeValue }: DueDateParams): string | undefined {
  if (!dateEnabled || !dateValue) return undefined;
  // timeEnabled이지만 timeValue가 비어있는 경우 방어 처리
  const hasTime = timeEnabled && timeValue.trim() !== '';
  const time = hasTime ? `${timeValue}:00` : '00:00:00';
  return `${dateValue}T${time}${localOffset()}`;
}
