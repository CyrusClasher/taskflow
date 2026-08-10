import request from './apiClient';
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../types';

export function getTasks(projectId: string) {
  return request<Task[]>(`/projects/${projectId}/tasks`);
}

export function createTask(projectId: string, data: CreateTaskInput) {
  return request<Task>(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTask(id: string, data: UpdateTaskInput) {
  return request<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id: string) {
  return request<void>(`/tasks/${id}`, { method: 'DELETE' });
}

export function updateTaskStatus(id: string, status: TaskStatus) {
  return request<Task>(`/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
