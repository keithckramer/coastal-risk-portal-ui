import type { RenewalSummary } from "../types/renewals";

interface RenewalSummaryCardProps {
  summary: RenewalSummary;
  days: number;
}

function RenewalSummaryCard({ summary, days }: RenewalSummaryCardProps) {
  const stats = [
    {
      label: 'Total Policies',
      value: summary.totalPolicies.toString(),
      icon: '📄'
    },
    {
      label: 'Total Premium',
      value: `$${summary.totalAnnualPremium.toLocaleString()}`,
      icon: '💵'
    },
    {
      label: 'Policies with Open Claims',
      value: summary.policiesWithOpenClaims.toString(),
      icon: '⚠️'
    },
    {
      label: 'Avg Days to Expiration',
      value: Math.round(summary.averageDaysToExpiration).toString(),
      icon: '🕐'
    }
  ];

  return (
    <div style={{
      marginTop: "1.5rem",
      padding: "1.5rem",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    }}>
      <h2 style={{
        marginTop: 0,
        marginBottom: "1.5rem",
        fontSize: "1.125rem",
        fontWeight: "600",
        color: "#1f2937"
      }}>
        Renewal Risk Summary (next {days} days)
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem"
      }}>
        {stats.map((stat, index) => (
          <div key={index}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#6b7280",
              fontSize: "0.875rem",
              marginBottom: "0.5rem"
            }}>
              <span>{stat.icon}</span>
              <span>{stat.label}</span>
            </div>
            <div style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1f2937"
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RenewalSummaryCard;
