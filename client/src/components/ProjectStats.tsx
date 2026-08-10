import type { Task } from '../types';

interface ProjectStatsProps {
  tasks: Task[];
}

export default function ProjectStats({ tasks }: ProjectStatsProps) {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'TODO').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const done = tasks.filter((t) => t.status === 'DONE').length;
  const percentComplete = total === 0 ? 0 : Math.round((done / total) * 100);

  const stats = [
    { label: 'Total', value: total },
    { label: 'Todo', value: todo },
    { label: 'In Progress', value: inProgress },
    { label: 'Done', value: done },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className="mt-0.5 text-xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{percentComplete}% complete</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-slate-900 transition-all" style={{ width: `${percentComplete}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
