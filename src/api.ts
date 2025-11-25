import type { UpcomingRenewal, RenewalSummary } from "./types/renewals";

const API_BASE_URL = "https://localhost:7246";

export async function fetchUpcomingRenewals(days = 365): Promise<UpcomingRenewal[]> {
  const res = await fetch(`${API_BASE_URL}/api/renewals?days=${days}`);

  if (!res.ok) {
    throw new Error(`Failed to load renewals (${res.status})`);
  }

  return res.json();
}

export async function fetchRenewalSummary(days = 365): Promise<RenewalSummary> {
  const res = await fetch(`${API_BASE_URL}/api/renewals/summary?days=${days}`);

  if (!res.ok) {
    throw new Error(`Failed to load renewal summary (${res.status})`);
  }

  return res.json();
}
