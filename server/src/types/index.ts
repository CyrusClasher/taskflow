// Shared shape for every API response so the frontend can rely on one format.
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}
