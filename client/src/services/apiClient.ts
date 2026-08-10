const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// A custom error so components can distinguish "the server responded with an
// error message" from unexpected failures like a dropped network connection.
export class ApiRequestError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // fetch itself throws on network failures (server down, no internet, etc.)
    throw new ApiRequestError('Unable to reach the server. Check your connection and try again.');
  }

  // 204 No Content (used by DELETE endpoints) has no JSON body to parse
  if (response.status === 204) {
    return undefined as T;
  }

  let body: { success: boolean; data?: T; message?: string };
  try {
    body = await response.json();
  } catch {
    throw new ApiRequestError('Received an unexpected response from the server.');
  }

  if (!response.ok || !body.success) {
    throw new ApiRequestError(body.message || 'Something went wrong. Please try again.');
  }

  return body.data as T;
}

export default request;
