import type { UpcomingRenewal } from "./types";

const API_BASE_URL = "https://localhost:7246";

export async function fetchUpcomingRenewals(days = 365): Promise<UpcomingRenewal[]> {
  const res = await fetch(`${API_BASE_URL}/api/renewals?days=${days}`);

  if (!res.ok) {
    throw new Error(`Failed to load renewals (${res.status})`);
  }

  return res.json();
}
