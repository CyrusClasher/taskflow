import { useMemo } from 'react';
import type { Task, TaskPriority, TaskStatus } from '../types';
import type { SortOption } from '../components/TaskFilters';

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { LOW: 0, MEDIUM: 1, HIGH: 2 };

interface UseFilteredTasksArgs {
  tasks: Task[];
  search: string;
  statusFilter: TaskStatus | 'ALL';
  priorityFilter: TaskPriority | 'ALL';
  sortBy: SortOption;
}

// Combines search + filters + sorting into the final task list shown on the
// board. Kept as one hook since these three operations always run together
// and recomputing them is cheap, but useMemo avoids redoing the work on
// every unrelated re-render (e.g. opening/closing a modal).
export function useFilteredTasks({ tasks, search, statusFilter, priorityFilter, sortBy }: UseFilteredTasksArgs) {
  return useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        (task.description ?? '').toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'dueDateAsc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'dueDateDesc':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        case 'priorityHighFirst':
          return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
        case 'priorityLowFirst':
          return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        default:
          return 0;
      }
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);
}
