import { useEffect, useState } from "react";
import { fetchUpcomingRenewals, fetchRenewalSummary } from "./api";
import type { UpcomingRenewal, RenewalSummary } from "./types/renewals";

function isHighRisk(renewal: UpcomingRenewal): boolean {
  return renewal.daysToExpiration <= 30 || renewal.openClaimCount > 0;
}

function App() {
  const [days, setDays] = useState(60);
  const [data, setData] = useState<UpcomingRenewal[]>([]);
  const [summary, setSummary] = useState<RenewalSummary | null>(null);
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetchUpcomingRenewals(days),
      fetchRenewalSummary(days)
    ])
      .then(([renewals, summaryData]) => {
        setData(renewals);
        setSummary(summaryData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div style={{ padding: "1.5rem", fontFamily: "system-ui" }}>
      <h1>Coastal Risk Portal – Upcoming Renewals</h1>

      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <label>
          Days to expiration:{" "}
          <input
            type="number"
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            style={{ width: 80 }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={highRiskOnly}
            onChange={e => setHighRiskOnly(e.target.checked)}
          />
          Show high-risk only
        </label>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && summary && (
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
      )}

      {!loading && !error && (
        <table style={{ marginTop: "1rem", borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Policy #</th>
              <th>Building</th>
              <th>Location</th>
              <th>Expires</th>
              <th>Days Left</th>
              <th>Premium</th>
              <th>Open Claims</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter(r => !highRiskOnly || isHighRisk(r))
              .map(r => {
                const isRisky = isHighRisk(r);
                return (
                  <tr
                    key={r.policyNumber}
                    style={{
                      backgroundColor: isRisky ? "rgba(220, 38, 38, 0.1)" : "transparent",
                      borderLeft: isRisky ? "3px solid #dc2626" : "none"
                    }}
                  >
                    <td>{r.policyNumber}</td>
                    <td>
                      {r.buildingName}
                      {isRisky && (
                        <span style={{
                          marginLeft: "0.5rem",
                          padding: "0.125rem 0.5rem",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backgroundColor: "#dc2626",
                          color: "white",
                          borderRadius: "4px"
                        }}>
                          High risk
                        </span>
                      )}
                    </td>
                    <td>{`${r.city}, ${r.state}`}</td>
                    <td>{new Date(r.expirationDate).toLocaleDateString()}</td>
                    <td>{r.daysToExpiration}</td>
                    <td>${r.annualPremium.toLocaleString()}</td>
                    <td>{r.openClaimCount}</td>
                  </tr>
                );
              })}
            {data.filter(r => !highRiskOnly || isHighRisk(r)).length === 0 && !loading && (
              <tr>
                <td colSpan={7}>No renewals in this window.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
