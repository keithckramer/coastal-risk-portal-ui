/**
 * Table component for displaying upcoming renewals
 */

import { Table } from '../../../components/common/Table';
import { formatDate, formatCurrency, formatLocation } from '../../../lib/formatters';
import type { UpcomingRenewal } from '../../../types';

interface RenewalsTableProps {
  data: UpcomingRenewal[];
}

export function RenewalsTable({ data }: RenewalsTableProps) {
  const columns = [
    {
      key: 'policyNumber',
      header: 'Policy #',
      render: (item: UpcomingRenewal) => item.policyNumber,
    },
    {
      key: 'buildingName',
      header: 'Building',
      render: (item: UpcomingRenewal) => item.buildingName,
    },
    {
      key: 'location',
      header: 'Location',
      render: (item: UpcomingRenewal) => formatLocation(item.city, item.state),
    },
    {
      key: 'expirationDate',
      header: 'Expires',
      render: (item: UpcomingRenewal) => formatDate(item.expirationDate),
    },
    {
      key: 'daysToExpiration',
      header: 'Days Left',
      render: (item: UpcomingRenewal) => item.daysToExpiration.toString(),
    },
    {
      key: 'annualPremium',
      header: 'Premium',
      render: (item: UpcomingRenewal) => formatCurrency(item.annualPremium),
    },
    {
      key: 'openClaimCount',
      header: 'Open Claims',
      render: (item: UpcomingRenewal) => item.openClaimCount.toString(),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      emptyMessage="No renewals in this window."
      getRowKey={(item) => item.policyNumber}
    />
  );
}
