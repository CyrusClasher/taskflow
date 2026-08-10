import Modal from './Modal';
import type { Task, TaskStatus } from '../types';
import { formatDate, PRIORITY_LABELS, PRIORITY_STYLES, STATUS_LABELS } from '../utils/format';

interface TaskDetailModalProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onClose: () => void;
}

export default function TaskDetailModal({ task, onEdit, onDelete, onStatusChange, onClose }: TaskDetailModalProps) {
  return (
    <Modal title="Task Details" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
          {task.description && <p className="mt-1 text-sm text-slate-600">{task.description}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]} priority
          </span>
          {task.dueDate && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
              Due {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="status-select" className="block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status-select"
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="TODO">{STATUS_LABELS.TODO}</option>
            <option value="IN_PROGRESS">{STATUS_LABELS.IN_PROGRESS}</option>
            <option value="DONE">{STATUS_LABELS.DONE}</option>
          </select>
        </div>

        <dl className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div>
            <dt>Created</dt>
            <dd className="font-medium text-slate-700">{formatDate(task.createdAt)}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd className="font-medium text-slate-700">{formatDate(task.updatedAt)}</dd>
          </div>
        </dl>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button
            onClick={onDelete}
            className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 sm:w-auto"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 sm:w-auto"
          >
            Edit Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
