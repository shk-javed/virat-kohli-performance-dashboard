const API_URL = "http://localhost:8000/api";

async function fetchJson(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const getDashboard = (filters) => {
  const params = new URLSearchParams();
  
  // FIX: Handle both string and object cases correctly
  if (typeof filters === "string") {
    if (filters !== "All") {
      params.append("format", filters);
    }
  } else if (filters && typeof filters === "object") {
    if (filters.format && filters.format !== "All") {
      params.append("format", filters.format);
    }
    if (filters.year) {
      params.append("year", filters.year);
    }
    if (filters.opponent) {
      params.append("opponent", filters.opponent);
    }
    if (filters.venue) {
      params.append("venue", filters.venue);
    }
    if (filters.homeAway) {
      params.append("homeAway", filters.homeAway);
    }
  }
  
  return fetchJson(`/dashboard?${params.toString()}`);
};