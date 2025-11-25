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
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        border: '1px solid #333',
        padding: '1.5rem',
        // TODO: Add responsive styles for mobile/tablet
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
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#fff',
            }}
          >
            Upcoming Renewals
          </h3>
          <p style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.875rem',
            color: '#aaa',
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
              color: '#646cff',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: '0.625rem 1rem',
              minHeight: '44px',
              fontWeight: '500',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8087ff';
              e.currentTarget.style.backgroundColor = 'rgba(100, 108, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#646cff';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px #646cff';
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
            color: '#aaa',
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
                backgroundColor: '#242424',
                borderRadius: '6px',
                border: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.2s ease',
                cursor: onRenewalClick ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2a2a2a';
                if (onRenewalClick) {
                  e.currentTarget.style.borderColor = '#444';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#242424';
                e.currentTarget.style.borderColor = '#333';
              }}
              onFocus={(e) => {
                if (onRenewalClick) {
                  e.currentTarget.style.boxShadow = '0 0 0 2px #646cff';
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
                minWidth: 0, // Allow text truncation
              }}>
                <div style={{
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  color: '#fff',
                  marginBottom: '0.25rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {renewal.insuredName}
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  color: '#aaa',
                }}>
                  {renewal.policyNumber}
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  color: '#ccc',
                  marginTop: '0.25rem',
                }}>
                  {formatDate(renewal.renewalDate)}
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
                    backgroundColor: '#404040',
                    color: '#e5e5e5',
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
