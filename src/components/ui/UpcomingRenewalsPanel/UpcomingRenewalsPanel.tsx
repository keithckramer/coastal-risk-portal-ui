export interface UpcomingRenewalItem {
  insuredName: string;
  policyNumber: string;
  renewalDate: string;
  daysUntilRenewal: number;
  riskLevel: "Low" | "Medium" | "High";
}

export interface UpcomingRenewalsPanelProps {
  renewals: UpcomingRenewalItem[];
  onViewAll?: () => void;
  onRenewalClick?: (renewal: UpcomingRenewalItem) => void;
}

/**
 * Panel component displaying upcoming policy renewals with risk indicators
 * @param renewals - Array of upcoming renewal items (max 5 displayed)
 * @param onViewAll - Optional callback when "View all" button is clicked
 * @param onRenewalClick - Optional callback when a renewal item is clicked
 */
function UpcomingRenewalsPanel({ renewals, onViewAll, onRenewalClick }: UpcomingRenewalsPanelProps) {
  // Limit to 5 renewals
  const displayedRenewals = renewals.slice(0, 5);

  // Helper function to format date
  const formatDate = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get color for risk level badge
  const getRiskLevelColor = (riskLevel: UpcomingRenewalItem['riskLevel']) => {
    switch (riskLevel) {
      case 'Low':
        return { backgroundColor: '#10b981', color: '#fff' }; // Green
      case 'Medium':
        return { backgroundColor: '#f59e0b', color: '#fff' }; // Yellow/Orange
      case 'High':
        return { backgroundColor: '#dc2626', color: '#fff' }; // Red
      default:
        return { backgroundColor: '#6b7280', color: '#fff' }; // Gray
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
      aria-labelledby="upcoming-renewals-heading"
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <div>
          <h3
            id="upcoming-renewals-heading"
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
            }}
          >
            Upcoming Renewals
          </h3>
          <p style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}>
            {renewals.length > 5
              ? `Showing 5 of ${renewals.length}`
              : renewals.length === 0
                ? 'Next 30 days'
                : `${renewals.length} ${renewals.length === 1 ? 'renewal' : 'renewals'}`
            }
          </p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            aria-label="View all upcoming renewals"
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.625rem 1rem',
              minHeight: '44px',
              fontWeight: '500',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1d4ed8';
              e.currentTarget.style.backgroundColor = '#dbeafe';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#2563eb';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px #2563eb';
              e.currentTarget.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            View all →
          </button>
        )}
      </div>

      {/* Renewals List */}
      {displayedRenewals.length === 0 ? (
        <p
          role="status"
          aria-live="polite"
          style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem',
            margin: 0,
          }}
        >
          No upcoming renewals in the next 30 days.
        </p>
      ) : (
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          aria-label="List of upcoming policy renewals"
        >
          {displayedRenewals.map((renewal, index) => (
            <li
              key={`${renewal.policyNumber}-${index}`}
              role={onRenewalClick ? "button" : undefined}
              tabIndex={onRenewalClick ? 0 : undefined}
              onClick={() => onRenewalClick?.(renewal)}
              onKeyDown={(e) => {
                if (onRenewalClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRenewalClick(renewal);
                }
              }}
              aria-label={`${renewal.insuredName}, policy ${renewal.policyNumber}, expires ${formatDate(renewal.renewalDate)}, ${renewal.daysUntilRenewal} days remaining, ${renewal.riskLevel} risk`}
              style={{
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s ease',
                cursor: onRenewalClick ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                if (onRenewalClick) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              onFocus={(e) => {
                if (onRenewalClick) {
                  e.currentTarget.style.boxShadow = '0 0 0 2px #2563eb';
                  e.currentTarget.style.outline = 'none';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Left side: Insured info */}
              <div style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}>
                  🏢
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.9375rem',
                    fontWeight: '500',
                    color: '#1f2937',
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {renewal.insuredName}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: '#6b7280',
                  }}>
                    {renewal.policyNumber}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: '#9ca3af',
                    marginTop: '0.25rem',
                  }}>
                    {formatDate(renewal.renewalDate)}
                  </div>
                </div>
              </div>

              {/* Right side: Badges */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.5rem',
              }}>
                {/* Days until renewal badge */}
                <div
                  style={{
                    padding: '0.25rem 0.625rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap',
                  }}
                  aria-hidden="true"
                >
                  {renewal.daysUntilRenewal} {renewal.daysUntilRenewal === 1 ? 'day' : 'days'}
                </div>

                {/* Risk level badge */}
                <div
                  style={{
                    padding: '0.25rem 0.625rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap',
                    ...getRiskLevelColor(renewal.riskLevel),
                  }}
                  role="status"
                  aria-label={`Risk level: ${renewal.riskLevel}`}
                >
                  {renewal.riskLevel}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default UpcomingRenewalsPanel;
