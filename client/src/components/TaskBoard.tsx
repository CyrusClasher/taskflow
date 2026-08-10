import type { Task } from '../types';
import TaskColumn from './TaskColumn';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const todo = tasks.filter((t) => t.status === 'TODO');
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const done = tasks.filter((t) => t.status === 'DONE');

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <TaskColumn status="TODO" tasks={todo} onTaskClick={onTaskClick} />
      <TaskColumn status="IN_PROGRESS" tasks={inProgress} onTaskClick={onTaskClick} />
      <TaskColumn status="DONE" tasks={done} onTaskClick={onTaskClick} />
    </div>
  );
}
