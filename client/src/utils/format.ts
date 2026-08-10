import type { TaskPriority, TaskStatus } from '../types';

export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Used to check if a due date has passed for a task that isn't done yet
export function isOverdue(dateString: string | null, status: TaskStatus): boolean {
  if (!dateString || status === 'DONE') return false;
  return new Date(dateString) < new Date(new Date().toDateString());
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

// Tailwind class groups for each priority badge, kept in one place so the
// styling stays consistent everywhere a priority is shown.
export const PRIORITY_STYLES: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600 border-slate-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  HIGH: 'bg-red-50 text-red-700 border-red-200',
};
