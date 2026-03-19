interface DueDateParams {
  dateEnabled: boolean;
  dateValue: string;
  timeEnabled: boolean;
  timeValue: string;
}

export function buildDueDate({ dateEnabled, dateValue, timeEnabled, timeValue }: DueDateParams): string | undefined {
  if (!dateEnabled || !dateValue) return undefined;
  // timeEnabled이지만 timeValue가 비어있는 경우 방어 처리
  const hasTime = timeEnabled && timeValue.trim() !== '';
  return hasTime ? `${dateValue}T${timeValue}:00` : `${dateValue}T00:00:00`;
}
