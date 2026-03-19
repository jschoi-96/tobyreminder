export function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function isScheduled(dateStr: string | null, completed: boolean): boolean {
  if (!dateStr || completed) return false;
  return isToday(dateStr) || new Date(dateStr) > new Date();
}

export function isOverdue(dateStr: string | null, completed: boolean): boolean {
  if (!dateStr || completed) return false;
  return new Date(dateStr) < new Date();
}

export function formatDueDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isToday(dateStr)) {
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}
