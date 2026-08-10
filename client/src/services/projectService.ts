import request from './apiClient';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../types';

export function getProjects() {
  return request<Project[]>('/projects');
}

export function getProject(id: string) {
  return request<Project>(`/projects/${id}`);
}

export function createProject(data: CreateProjectInput) {
  return request<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProject(id: string, data: UpdateProjectInput) {
  return request<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProject(id: string) {
  return request<void>(`/projects/${id}`, { method: 'DELETE' });
}
