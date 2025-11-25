/**
 * Main page component for viewing upcoming policy renewals
 * Orchestrates filters, data fetching, and table display
 */

import { useState } from 'react';
import { useRenewals } from './hooks/useRenewals';
import { RenewalsFilters } from './components/RenewalsFilters';
import { RenewalsTable } from './components/RenewalsTable';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { DEFAULT_VALUES } from '../../lib/constants';

export function RenewalsPage() {
  const [days, setDays] = useState<number>(DEFAULT_VALUES.RENEWAL_DAYS);
  const { data, loading, error } = useRenewals(days);

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'system-ui', maxWidth: '1400px', margin: '0 auto' }}>
      <h1>Coastal Risk Portal – Upcoming Renewals</h1>

      <RenewalsFilters days={days} onDaysChange={setDays} />

      {loading && <LoadingSpinner message="Loading renewals..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <RenewalsTable data={data} />}
    </div>
  );
}
