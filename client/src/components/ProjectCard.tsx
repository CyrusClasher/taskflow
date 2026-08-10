import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { formatDate } from '../utils/format';

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const tasks = project.tasks ?? [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <Link to={`/projects/${project.id}`} className="flex-1">
        <h3 className="font-semibold text-slate-900 hover:underline">{project.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {project.description || 'No description provided.'}
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>
          {completedTasks}/{totalTasks} tasks done
        </span>
        <span>{formatDate(project.createdAt)}</span>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
        <Link
          to={`/projects/${project.id}`}
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Open
        </Link>
        <button
          onClick={() => onDelete(project)}
          aria-label={`Delete ${project.name}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
