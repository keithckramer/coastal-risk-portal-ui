import { useEffect, useState } from "react";
import { fetchUpcomingRenewals, fetchRenewalSummary } from "./api";
import type { UpcomingRenewal, RenewalSummary } from "./types/renewals";
import { RenewalSummaryCard, PortalNavbar, UpcomingRenewalsPanel } from "./components";
import type { UpcomingRenewalItem } from "./components";

type Route = 'Dashboard' | 'Renewals' | 'Reports';

function isHighRisk(renewal: UpcomingRenewal): boolean {
  return renewal.daysToExpiration <= 30 || renewal.openClaimCount > 0;
}

function getRiskLevel(renewal: UpcomingRenewal): "Low" | "Medium" | "High" {
  if (renewal.daysToExpiration <= 30 || renewal.openClaimCount > 0) {
    return "High";
  } else if (renewal.daysToExpiration <= 60) {
    return "Medium";
  }
  return "Low";
}

function convertToRenewalItem(renewal: UpcomingRenewal): UpcomingRenewalItem {
  return {
    insuredName: renewal.buildingName,
    policyNumber: renewal.policyNumber,
    renewalDate: renewal.expirationDate,
    daysUntilRenewal: renewal.daysToExpiration,
    riskLevel: getRiskLevel(renewal),
  };
}

function App() {
  const [activeRoute, setActiveRoute] = useState<Route>('Dashboard');
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

  const renderPage = () => {
    switch (activeRoute) {
      case 'Dashboard':
        return (
          <div>
            <h1>Dashboard</h1>

            {loading && <p>Loading…</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && summary && (
              <RenewalSummaryCard summary={summary} days={days} />
            )}

            {!loading && !error && (
              <div style={{ marginTop: "1.5rem" }}>
                <UpcomingRenewalsPanel
                  renewals={data.map(convertToRenewalItem)}
                  onViewAll={() => setActiveRoute('Renewals')}
                />
              </div>
            )}
          </div>
        );

      case 'Renewals':
        return (
          <div>
            <h1>Upcoming Renewals</h1>

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
              <RenewalSummaryCard summary={summary} days={days} />
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

      case 'Reports':
        return (
          <div>
            <h1>Reports</h1>
            <p>Reports view coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <nav style={{
        padding: "1rem 1.5rem",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "1.5rem"
      }}>
        <a href="/" style={{
          textDecoration: "none",
          color: "#2563eb",
          fontSize: "1.25rem",
          fontWeight: "600"
        }}>
          Coastal Risk Portal
        </a>
      </nav>

      <div style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <h1>Upcoming Renewals</h1>

      <label>
        Days to expiration:{" "}
        <input
          type="number"
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          style={{ width: 80 }}
        />
      </label>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
            {data.map(r => (
              <tr key={r.policyNumber}>
                <td>{r.policyNumber}</td>
                <td>{r.buildingName}</td>
                <td>{`${r.city}, ${r.state}`}</td>
                <td>{new Date(r.expirationDate).toLocaleDateString()}</td>
                <td>{r.daysToExpiration}</td>
                <td>${r.annualPremium.toLocaleString()}</td>
                <td>{r.openClaimCount}</td>
              </tr>
            ))}
            {data.length === 0 && !loading && (
              <tr>
                <td colSpan={7}>No renewals in this window.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
}

export default App;
