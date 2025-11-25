/**
 * Dashboard page - Main landing page after login
 */

import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1>Dashboard</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Welcome to the Coastal Risk Portal
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem',
          }}
        >
          <DashboardCard
            title="Upcoming Renewals"
            description="View and manage policy renewals"
            link="/renewals"
            count={15}
          />
          <DashboardCard
            title="Active Policies"
            description="Browse all active insurance policies"
            link="/policies"
            count={248}
          />
          <DashboardCard
            title="Open Claims"
            description="Track and manage insurance claims"
            link="/claims"
            count={7}
          />
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Recent Activity</h2>
          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <p style={{ color: '#666' }}>No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  link: string;
  count?: number;
}

function DashboardCard({ title, description, link, count }: DashboardCardProps) {
  return (
    <Link
      to={link}
      style={{
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'box-shadow 0.2s',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '0.5rem',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{title}</h3>
          {count !== undefined && (
            <span
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              {count}
            </span>
          )}
        </div>
        <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
