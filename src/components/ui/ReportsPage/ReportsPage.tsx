import { useState } from 'react';

type ReportCategory = 'All' | 'Financial' | 'Risk' | 'Claims' | 'Operations' | 'Underwriting';

interface Report {
  id: string;
  title: string;
  description: string;
  category: Exclude<ReportCategory, 'All'>;
  icon: string;
  lastGenerated: string;
  downloadUrl?: string;
}

const DUMMY_REPORTS: Report[] = [
  {
    id: '1',
    title: 'Monthly Premium Summary',
    description: 'Overview of all premiums collected and outstanding balances',
    category: 'Financial',
    icon: '💵',
    lastGenerated: 'Nov 15, 2025',
  },
  {
    id: '2',
    title: 'Hurricane Season Risk Analysis',
    description: 'Risk assessment for all properties during active hurricane season',
    category: 'Risk',
    icon: '🌀',
    lastGenerated: 'Nov 10, 2025',
  },
  {
    id: '3',
    title: 'Claims Activity Report',
    description: 'Summary of all open, pending, and closed claims',
    category: 'Claims',
    icon: '⚠️',
    lastGenerated: 'Nov 20, 2025',
  },
  {
    id: '4',
    title: 'Policy Renewal Forecast',
    description: 'Upcoming renewals and projected premium changes',
    category: 'Operations',
    icon: '📅',
    lastGenerated: 'Nov 18, 2025',
  },
  {
    id: '5',
    title: 'Exposure by Location',
    description: 'Geographic distribution of insured properties and total exposure',
    category: 'Risk',
    icon: '📍',
    lastGenerated: 'Nov 12, 2025',
  },
  {
    id: '6',
    title: 'Loss Ratio Analysis',
    description: 'Comparison of premiums earned vs claims paid by property type',
    category: 'Financial',
    icon: '📊',
    lastGenerated: 'Nov 8, 2025',
  },
  {
    id: '7',
    title: 'Coastal Zone Risk Assessment',
    description: 'Analysis of properties in high-risk coastal flood zones',
    category: 'Risk',
    icon: '🌊',
    lastGenerated: 'Nov 5, 2025',
  },
  {
    id: '8',
    title: 'Wind Damage Claims Trends',
    description: 'Historical analysis of wind and hurricane damage claims',
    category: 'Claims',
    icon: '💨',
    lastGenerated: 'Nov 3, 2025',
  },
  {
    id: '9',
    title: 'Multi-Family Property Analysis',
    description: 'Performance metrics for apartment and condo complexes',
    category: 'Underwriting',
    icon: '🏘️',
    lastGenerated: 'Nov 1, 2025',
  },
];

function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('All');

  const categories: ReportCategory[] = ['All', 'Financial', 'Risk', 'Claims', 'Operations', 'Underwriting'];

  const filteredReports = selectedCategory === 'All'
    ? DUMMY_REPORTS
    : DUMMY_REPORTS.filter(report => report.category === selectedCategory);

  const handleDownload = (report: Report) => {
    alert(`Downloading ${report.title}...\n\nThis is a demo. In a real application, this would download the report file.`);
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.5rem',
        }}>
          Reports
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          margin: 0,
        }}>
          Generate and download insurance reports
        </p>
      </div>

      {/* Action Button */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => alert('This would open a dialog to generate a custom report')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9375rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }}
        >
          <span>📝</span>
          <span>Generate Custom Report</span>
        </button>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              border: selectedCategory === category ? '2px solid #2563eb' : '1px solid #e5e7eb',
              backgroundColor: selectedCategory === category ? '#dbeafe' : '#ffffff',
              color: selectedCategory === category ? '#2563eb' : '#6b7280',
              fontSize: '0.875rem',
              fontWeight: selectedCategory === category ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== category) {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
      }}>
        {filteredReports.map((report) => (
          <div
            key={report.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Card Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: getCategoryColor(report.category),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                {report.icon}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#6b7280',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
              }}>
                {report.category}
              </span>
            </div>

            {/* Card Content */}
            <div style={{ flex: 1, marginBottom: '1rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '0.5rem',
                marginTop: 0,
              }}>
                {report.title}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                lineHeight: '1.5',
              }}>
                {report.description}
              </p>
            </div>

            {/* Card Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #f3f4f6',
            }}>
              <span style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
              }}>
                Last: {report.lastGenerated}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(report);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#2563eb',
                  border: '1px solid #2563eb',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#2563eb';
                }}
              >
                <span>⬇️</span>
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.5rem',
          }}>
            No reports found
          </h3>
          <p style={{
            fontSize: '0.9375rem',
            color: '#6b7280',
            margin: 0,
          }}>
            There are no reports in this category yet.
          </p>
        </div>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Financial: '#dbeafe',
    Risk: '#fef3c7',
    Claims: '#fee2e2',
    Operations: '#e0e7ff',
    Underwriting: '#f3e8ff',
  };
  return colors[category] || '#f3f4f6';
}

export default ReportsPage;
