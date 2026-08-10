import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import { STATUS_LABELS } from '../utils/format';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  TODO: 'bg-slate-400',
  IN_PROGRESS: 'bg-blue-500',
  DONE: 'bg-green-500',
};

export default function TaskColumn({ status, tasks, onTaskClick }: TaskColumnProps) {
  return (
    <div className="flex flex-1 flex-col rounded-lg bg-slate-100 p-3">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-2 w-2 rounded-full ${COLUMN_ACCENT[status]}`} />
        <h3 className="text-sm font-semibold text-slate-700">{STATUS_LABELS[status]}</h3>
        <span className="ml-auto text-xs text-slate-400">{tasks.length}</span>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            No tasks here.
          </p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)
        )}
      </div>
    </div>
  );
}
