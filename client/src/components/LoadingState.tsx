interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
        role="status"
        aria-label="Loading"
      />
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}
