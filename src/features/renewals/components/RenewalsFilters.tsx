/**
 * Filter controls for the renewals page
 */

import { Input } from '../../../components/common/Input';
import { DEFAULT_VALUES } from '../../../lib/constants';

interface RenewalsFiltersProps {
  days: number;
  onDaysChange: (days: number) => void;
}

export function RenewalsFilters({ days, onDaysChange }: RenewalsFiltersProps) {
  const handleChange = (value: string) => {
    const numValue = Number(value);
    if (numValue >= DEFAULT_VALUES.MIN_RENEWAL_DAYS) {
      onDaysChange(numValue);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <Input
        type="number"
        label="Days to expiration:"
        value={days}
        onChange={(e) => handleChange(e.target.value)}
        min={DEFAULT_VALUES.MIN_RENEWAL_DAYS}
        max={DEFAULT_VALUES.MAX_RENEWAL_DAYS}
        style={{ width: '120px' }}
      />
    </div>
  );
}
