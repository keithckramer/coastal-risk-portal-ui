import { UpcomingRenewalsPanel } from './components';

// Mock data for testing
const mockRenewals = [
  {
    insuredName: "Beachfront Resort & Spa",
    policyNumber: "POL-2024-001234",
    renewalDate: "2025-12-15T00:00:00Z",
    daysUntilRenewal: 5,
    riskLevel: "High" as const,
  },
  {
    insuredName: "Coastal Marina Complex",
    policyNumber: "POL-2024-005678",
    renewalDate: "2025-12-20T00:00:00Z",
    daysUntilRenewal: 10,
    riskLevel: "Medium" as const,
  },
  {
    insuredName: "Ocean View Condominiums",
    policyNumber: "POL-2024-009012",
    renewalDate: "2025-12-28T00:00:00Z",
    daysUntilRenewal: 18,
    riskLevel: "Low" as const,
  },
  {
    insuredName: "Seaside Shopping Center with Very Long Building Name That Should Truncate",
    policyNumber: "POL-2024-003456",
    renewalDate: "2026-01-05T00:00:00Z",
    daysUntilRenewal: 26,
    riskLevel: "High" as const,
  },
  {
    insuredName: "Waterfront Warehouse District",
    policyNumber: "POL-2024-007890",
    renewalDate: "2026-01-10T00:00:00Z",
    daysUntilRenewal: 31,
    riskLevel: "Low" as const,
  },
];

const emptyRenewals: typeof mockRenewals = [];

function ComponentReviewTest() {
  return (
    <div style={{ 
      fontFamily: 'system-ui',
      backgroundColor: '#242424',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <h1 style={{ color: '#fff', marginBottom: '2rem' }}>
        UpcomingRenewalsPanel Component Review
      </h1>
      
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '1200px'
      }}>
        {/* Default state with data */}
        <section>
          <h2 style={{ color: '#999', fontSize: '1rem', marginBottom: '1rem' }}>
            Default State (With Data & View All Button)
          </h2>
          <UpcomingRenewalsPanel 
            renewals={mockRenewals} 
            onViewAll={() => alert('View all clicked!')}
          />
        </section>

        {/* Without View All button */}
        <section>
          <h2 style={{ color: '#999', fontSize: '1rem', marginBottom: '1rem' }}>
            Without View All Button
          </h2>
          <UpcomingRenewalsPanel renewals={mockRenewals} />
        </section>

        {/* Empty state */}
        <section>
          <h2 style={{ color: '#999', fontSize: '1rem', marginBottom: '1rem' }}>
            Empty State (No Renewals)
          </h2>
          <UpcomingRenewalsPanel 
            renewals={emptyRenewals}
            onViewAll={() => alert('View all clicked!')}
          />
        </section>

        {/* Mobile width simulation */}
        <section>
          <h2 style={{ color: '#999', fontSize: '1rem', marginBottom: '1rem' }}>
            Mobile Width (375px)
          </h2>
          <div style={{ maxWidth: '375px' }}>
            <UpcomingRenewalsPanel 
              renewals={mockRenewals}
              onViewAll={() => alert('View all clicked!')}
            />
          </div>
        </section>

        {/* Tablet width simulation */}
        <section>
          <h2 style={{ color: '#999', fontSize: '1rem', marginBottom: '1rem' }}>
            Tablet Width (768px)
          </h2>
          <div style={{ maxWidth: '768px' }}>
            <UpcomingRenewalsPanel 
              renewals={mockRenewals}
              onViewAll={() => alert('View all clicked!')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ComponentReviewTest;
