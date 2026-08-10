import type { Task } from '../types';
import { formatDate, isOverdue, PRIORITY_LABELS, PRIORITY_STYLES } from '../utils/format';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <p className="text-sm font-medium text-slate-900">{task.title}</p>
      {task.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{task.description}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {task.dueDate && (
          <span className={`text-xs ${overdue ? 'font-medium text-red-600' : 'text-slate-400'}`}>
            {overdue ? 'Overdue: ' : ''}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </button>
  );
}
