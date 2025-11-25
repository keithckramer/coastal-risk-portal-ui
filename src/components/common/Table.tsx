/**
 * Reusable table component with TypeScript generics for type safety
 */

import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
}

export function Table<T>({
  data,
  columns,
  emptyMessage = 'No data available',
  getRowKey,
}: TableProps<T>) {
  return (
    <table
      style={{
        marginTop: '1rem',
        borderCollapse: 'collapse',
        width: '100%',
      }}
    >
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                borderBottom: '2px solid #ddd',
              }}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#666',
              }}
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={getRowKey(item)}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
