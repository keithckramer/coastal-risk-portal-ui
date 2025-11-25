/**
 * Service layer for renewals API operations
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../lib/constants';
import type { UpcomingRenewal } from '../types';

/**
 * Fetches upcoming policy renewals within the specified number of days
 */
export async function fetchUpcomingRenewals(
  days: number
): Promise<UpcomingRenewal[]> {
  return apiClient.get<UpcomingRenewal[]>(
    `${API_ENDPOINTS.RENEWALS}?days=${days}`
  );
}
