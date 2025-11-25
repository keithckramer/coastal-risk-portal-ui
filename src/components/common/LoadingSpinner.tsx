/**
 * Loading spinner component for async operations
 */

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <p>{message}</p>
    </div>
  );
}
