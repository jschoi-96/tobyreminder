export type Priority = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

export type SmartFilter = 'all' | 'today' | 'scheduled' | 'completed';

export interface ReminderList {
  id: number;
  name: string;
  color: string | null;
  icon: string | null;
  createdAt: string;
}

export interface Reminder {
  id: number;
  title: string;
  notes: string | null;
  dueDate: string | null;
  priority: Priority;
  completed: boolean;
  completedAt: string | null;
  listId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderListRequest {
  name: string;
  color?: string;
  icon?: string;
}

export interface ReminderRequest {
  title: string;
  notes?: string;
  dueDate?: string;
  priority?: Priority;
  listId?: number;
}
