import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import * as projectService from '../services/projectService';
import type { Project } from '../types';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadProjects() {
    setIsLoading(true);
    setError('');
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load projects.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreateProject(data: { name: string; description?: string }) {
    const created = await projectService.createProject(data);
    setProjects((prev) => [created, ...prev]);
    setShowForm(false);
  }

  async function handleDeleteConfirmed() {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await projectService.deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete project.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          New Project
        </button>
      </Header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-xl font-semibold text-slate-900">Projects</h1>
        <p className="mt-1 text-sm text-slate-500">Organize your work into projects and track tasks in each one.</p>

        <div className="mt-6">
          {isLoading ? (
            <LoadingState message="Loading projects..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadProjects} />
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Create your first project to get started."
              actionLabel="Create Project"
              onAction={() => setShowForm(true)}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={setProjectToDelete} />
              ))}
            </div>
          )}
        </div>
      </main>

      {showForm && <ProjectForm onSubmit={handleCreateProject} onClose={() => setShowForm(false)} />}

      {projectToDelete && (
        <ConfirmDialog
          title="Delete Project"
          message={`Are you sure you want to delete "${projectToDelete.name}"? This will also delete all of its tasks.`}
          isSubmitting={isDeleting}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setProjectToDelete(null)}
        />
      )}
    </div>
  );
}
