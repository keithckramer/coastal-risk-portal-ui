/**
 * Error message display component
 */

interface ErrorMessageProps {
  message: string;
  title?: string;
}

export function ErrorMessage({ message, title = 'Error' }: ErrorMessageProps) {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '4px',
        marginTop: '1rem',
      }}
      role="alert"
    >
      <strong>{title}: </strong>
      <span>{message}</span>
    </div>
  );
}
