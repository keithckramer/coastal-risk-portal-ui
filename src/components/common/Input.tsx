/**
 * Reusable input component with label support
 */

import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '0.25rem' }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          padding: '0.5rem',
          fontSize: '1rem',
          border: error ? '1px solid #f44' : '1px solid #ccc',
          borderRadius: '4px',
          ...props.style,
        }}
      />
      {error && (
        <span style={{ color: '#f44', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {error}
        </span>
      )}
    </div>
  );
}
