import type { RenewalSummary } from "../types/renewals";

interface RenewalSummaryCardProps {
  summary: RenewalSummary;
  days: number;
}

function RenewalSummaryCard({ summary, days }: RenewalSummaryCardProps) {
  return (
    <div style={{
      marginTop: "1.5rem",
      padding: "1.5rem",
      backgroundColor: "#1a1a1a",
      borderRadius: "8px",
      border: "1px solid #333"
    }}>
      <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.25rem" }}>
        Renewal Risk Summary (next {days} days)
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        <div>
          <div style={{ color: "#999", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Total Policies
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {summary.totalPolicies}
          </div>
        </div>
        <div>
          <div style={{ color: "#999", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Total Premium
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            ${summary.totalAnnualPremium.toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ color: "#999", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Policies with Open Claims
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {summary.policiesWithOpenClaims}
          </div>
        </div>
        <div>
          <div style={{ color: "#999", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Avg Days to Expiration
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {Math.round(summary.averageDaysToExpiration)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RenewalSummaryCard;
