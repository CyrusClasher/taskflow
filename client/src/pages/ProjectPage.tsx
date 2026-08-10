import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProjectStats from '../components/ProjectStats';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';
import TaskDetailModal from '../components/TaskDetailModal';
import ProjectForm from '../components/ProjectForm';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import TaskFilters, { type SortOption } from '../components/TaskFilters';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import * as projectService from '../services/projectService';
import * as taskService from '../services/taskService';
import type { Project, Task, TaskPriority, TaskStatus } from '../types';

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  const filteredTasks = useFilteredTasks({ tasks, search, statusFilter, priorityFilter, sortBy });
  const hasActiveFilters = Boolean(search) || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  async function loadProject() {
    if (!projectId) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await projectService.getProject(projectId);
      setProject(data);
      setTasks(data.tasks ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load this project.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // --- Task actions ---

  async function handleCreateTask(data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
  }) {
    if (!projectId) return;
    const created = await taskService.createTask(projectId, data);
    setTasks((prev) => [created, ...prev]);
    setShowTaskForm(false);
  }

  async function handleUpdateTask(data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
  }) {
    if (!editingTask) return;
    const updated = await taskService.updateTask(editingTask.id, data);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setEditingTask(null);
    setSelectedTask(null);
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    const updated = await taskService.updateTaskStatus(task.id, status);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTask(updated);
  }

  async function handleDeleteTaskConfirmed() {
    if (!taskToDelete) return;
    setIsDeletingTask(true);
    try {
      await taskService.deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
      setSelectedTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete task.');
    } finally {
      setIsDeletingTask(false);
    }
  }

  // --- Project actions ---

  async function handleUpdateProject(data: { name: string; description?: string }) {
    if (!project) return;
    const updated = await projectService.updateProject(project.id, data);
    setProject((prev) => (prev ? { ...prev, ...updated } : prev));
    setShowEditProject(false);
  }

  async function handleDeleteProjectConfirmed() {
    if (!project) return;
    setIsDeletingProject(true);
    try {
      await projectService.deleteProject(project.id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete project.');
      setIsDeletingProject(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <LoadingState message="Loading project..." />
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <ErrorState message={error} onRetry={loadProject} />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
          &larr; Back to Projects
        </Link>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
            {project.description && <p className="mt-1 text-sm text-slate-500">{project.description}</p>}
          </div>
          <div className="flex flex-shrink-0 gap-2">
            <button
              onClick={() => setShowEditProject(true)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteProject(true)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setShowTaskForm(true)}
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              New Task
            </button>
          </div>
        </div>

        <div className="mt-5">
          <ProjectStats tasks={tasks} />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar value={search} onChange={setSearch} />
          <TaskFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />
        </div>

        <div className="mt-5">
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks in this project."
              description="Create your first task to start tracking work."
              actionLabel="New Task"
              onAction={() => setShowTaskForm(true)}
            />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              title={hasActiveFilters && search ? 'No tasks match your search.' : 'No tasks match the selected filters.'}
              description="Try adjusting your search or filters."
            />
          ) : (
            <TaskBoard tasks={filteredTasks} onTaskClick={setSelectedTask} />
          )}
        </div>
      </main>

      {showTaskForm && <TaskForm onSubmit={handleCreateTask} onClose={() => setShowTaskForm(false)} />}

      {editingTask && (
        <TaskForm task={editingTask} onSubmit={handleUpdateTask} onClose={() => setEditingTask(null)} />
      )}

      {selectedTask && !editingTask && (
        <TaskDetailModal
          task={selectedTask}
          onEdit={() => setEditingTask(selectedTask)}
          onDelete={() => setTaskToDelete(selectedTask)}
          onStatusChange={(status) => handleStatusChange(selectedTask, status)}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Delete Task"
          message={`Are you sure you want to delete "${taskToDelete.title}"?`}
          isSubmitting={isDeletingTask}
          onConfirm={handleDeleteTaskConfirmed}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {showEditProject && (
        <ProjectForm project={project} onSubmit={handleUpdateProject} onClose={() => setShowEditProject(false)} />
      )}

      {showDeleteProject && (
        <ConfirmDialog
          title="Delete Project"
          message={`Are you sure you want to delete "${project.name}"? This will also delete all of its tasks.`}
          isSubmitting={isDeletingProject}
          onConfirm={handleDeleteProjectConfirmed}
          onCancel={() => setShowDeleteProject(false)}
        />
      )}
    </div>
  );
}
