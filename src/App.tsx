import { useEffect, useState } from "react";
import { fetchUpcomingRenewals } from "./api";
import type { UpcomingRenewal } from "./types";

function App() {
  const [days, setDays] = useState(60);
  const [data, setData] = useState<UpcomingRenewal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchUpcomingRenewals(days)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [days]);

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
