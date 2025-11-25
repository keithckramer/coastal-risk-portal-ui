/**
 * Utility functions for formatting data for display
 */

/**
 * Formats a date string to localized date format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

/**
 * Formats a number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/**
 * Formats city and state into a single location string
 */
export function formatLocation(city: string, state: string): string {
  return `${city}, ${state}`;
}
