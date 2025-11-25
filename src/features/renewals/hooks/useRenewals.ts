/**
 * Custom hook for managing renewals data fetching and state
 * Encapsulates business logic for the renewals feature
 */

import { useEffect, useState } from 'react';
import { fetchUpcomingRenewals } from '../../../services/renewals.service';
import type { UpcomingRenewal } from '../../../types';

interface UseRenewalsResult {
  data: UpcomingRenewal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch and manage upcoming renewals data
 */
export function useRenewals(days: number): UseRenewalsResult {
  const [data, setData] = useState<UpcomingRenewal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const renewals = await fetchUpcomingRenewals(days);
      setData(renewals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
