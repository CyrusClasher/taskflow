import type { TaskPriority, TaskStatus } from '../types';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'dueDateAsc'
  | 'dueDateDesc'
  | 'priorityHighFirst'
  | 'priorityLowFirst';

interface TaskFiltersProps {
  statusFilter: TaskStatus | 'ALL';
  onStatusFilterChange: (value: TaskStatus | 'ALL') => void;
  priorityFilter: TaskPriority | 'ALL';
  onPriorityFilterChange: (value: TaskPriority | 'ALL') => void;
  sortBy: SortOption;
  onSortByChange: (value: SortOption) => void;
}

const selectClasses =
  'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500';

export default function TaskFilters({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <select
        aria-label="Filter by status"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | 'ALL')}
        className={selectClasses}
      >
        <option value="ALL">All Statuses</option>
        <option value="TODO">Todo</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        aria-label="Filter by priority"
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriority | 'ALL')}
        className={selectClasses}
      >
        <option value="ALL">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <select
        aria-label="Sort tasks"
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value as SortOption)}
        className={selectClasses}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="dueDateAsc">Due date — earliest first</option>
        <option value="dueDateDesc">Due date — latest first</option>
        <option value="priorityHighFirst">Priority — high to low</option>
        <option value="priorityLowFirst">Priority — low to high</option>
      </select>
    </div>
  );
}
