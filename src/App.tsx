import { useEffect, useState } from "react";
import { fetchUpcomingRenewals, fetchRenewalSummary } from "./api";
import type { UpcomingRenewal, RenewalSummary } from "./types/renewals";
import { RenewalSummaryCard, PortalNavbar, UpcomingRenewalsPanel, ReportsPage } from "./components";
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
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1.5rem',
              marginTop: 0,
            }}>Dashboard</h1>

            {loading && <p style={{ color: '#6b7280' }}>Loading…</p>}
            {error && <p style={{
              color: '#dc2626',
              backgroundColor: '#fee2e2',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}>{error}</p>}

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
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '1.5rem',
              marginTop: 0,
            }}>Upcoming Renewals</h1>

            <div style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}>
              <label style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}>
                <span style={{
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}>Days to expiration:</span>
                <input
                  type="number"
                  value={days}
                  onChange={e => setDays(Number(e.target.value))}
                  style={{
                    width: 100,
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "0.9375rem",
                  }}
                />
              </label>

              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={highRiskOnly}
                  onChange={e => setHighRiskOnly(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                <span style={{
                  fontSize: "0.9375rem",
                  color: "#374151",
                }}>Show high-risk only</span>
              </label>
            </div>

            {loading && <p style={{ color: '#6b7280' }}>Loading…</p>}
            {error && <p style={{
              color: '#dc2626',
              backgroundColor: '#fee2e2',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}>{error}</p>}

            {!loading && !error && summary && (
              <RenewalSummaryCard summary={summary} days={days} />
            )}

            {!loading && !error && (
              <div style={{
                marginTop: "1.5rem",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}>
                <table style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: "#f9fafb",
                      borderBottom: "1px solid #e5e7eb",
                    }}>
                      <th style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Policy #</th>
                      <th style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Building</th>
                      <th style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Location</th>
                      <th style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Expires</th>
                      <th style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Days Left</th>
                      <th style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Premium</th>
                      <th style={{
                        padding: "0.75rem 1rem",
                        textAlign: "left",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>Open Claims</th>
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
                              backgroundColor: isRisky ? "#fef2f2" : "#ffffff",
                              borderBottom: "1px solid #f3f4f6",
                              borderLeft: isRisky ? "3px solid #dc2626" : "3px solid transparent",
                            }}
                          >
                            <td style={{
                              padding: "1rem",
                              fontSize: "0.875rem",
                              color: "#1f2937",
                            }}>{r.policyNumber}</td>
                            <td style={{
                              padding: "1rem",
                              fontSize: "0.875rem",
                              color: "#1f2937",
                            }}>
                              {r.buildingName}
                              {isRisky && (
                                <span style={{
                                  marginLeft: "0.5rem",
                                  padding: "0.125rem 0.5rem",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  backgroundColor: "#dc2626",
                                  color: "white",
                                  borderRadius: "12px",
                                }}>
                                  High risk
                                </span>
                              )}
                            </td>
                            <td style={{
                              padding: "1rem",
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}>{`${r.city}, ${r.state}`}</td>
                            <td style={{
                              padding: "1rem",
                              fontSize: "0.875rem",
                              color: "#6b7280",
                            }}>{new Date(r.expirationDate).toLocaleDateString()}</td>
                            <td style={{
                              padding: "1rem",
                              fontSize: "0.875rem",
                              color: "#1f2937",
                              fontWeight: "500",
                            }}>{r.daysToExpiration}</td>
                            <td style={{
                              padding: "1rem",
                              fontSize: "0.875rem",
                              color: "#1f2937",
                              fontWeight: "500",
                            }}>${r.annualPremium.toLocaleString()}</td>
                            <td style={{
                              padding: "1rem",
                              fontSize: "0.875rem",
                              color: r.openClaimCount > 0 ? "#dc2626" : "#6b7280",
                              fontWeight: r.openClaimCount > 0 ? "600" : "400",
                            }}>{r.openClaimCount}</td>
                          </tr>
                        );
                      })}
                    {data.filter(r => !highRiskOnly || isHighRisk(r)).length === 0 && !loading && (
                      <tr>
                        <td colSpan={7} style={{
                          padding: "2rem",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          color: "#9ca3af",
                        }}>No renewals in this window.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );

      case 'Reports':
        return <ReportsPage />;

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "system-ui", minHeight: "100vh" }}>
      <header>
        <PortalNavbar
          activeRoute={activeRoute}
          onRouteChange={setActiveRoute}
          userName="John Smith"
        />
      </header>
      <main style={{
        paddingTop: "calc(64px + 1.5rem)",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingBottom: "1.5rem",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%"
      }}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
